const clx = document.getElementById('myChart').getContext('2d');  
let newChart;  


async function fetchData(testUrl) {
    const url = testUrl; 
    const response = await fetch(url);
    return response.json();
}

function isGrouped(jsonData) {
  return (jsonData.Data[0].Name.includes('-')); 
}

function getGroupedXValue(jsonData){ 
  let groupCategory=[]; 
  jsonData.Data.forEach(function(item){ 

    let group = (item.Name).substring((item.Name).indexOf('-')+1); 
    if(!(groupCategory.includes(group))){
      groupCategory.push(group); 
  }
});

  return groupCategory; 
}

function getXElements(jsonData){ 
  let xData=[]; 
  jsonData.Data.forEach(function(item){ 
    let element = (item.Name).substring(0,(item.Name).indexOf('-')); 

    if(!(xData.includes(element))){
      xData.push(element); 
    }
}); 

return xData; 
}

function getGroupedYValueForBar(xData,groupCategory,jsonData){

  let yData=[]; 
  let numberOfElements = xData.length; 
  let numberOfCategories = groupCategory.length; 
  console.log(numberOfElements+' '+numberOfCategories); 
  yData.length=numberOfElements; 

 for(i=0; i<numberOfElements; i++){
    yData[i]=[]; 
    yData[i].length=numberOfCategories; 
    yData[i].fill(null); 
  }; 


  jsonData.Data.forEach(function(item){
    let categoryIndex= groupCategory.indexOf((item.Name).substring((item.Name).indexOf('-')+1));
    let elementIndex = xData.indexOf((item.Name).substring(0,(item.Name).indexOf('-')));
    console.log(yData);
    yData[elementIndex][categoryIndex] = item.Value; 
  });


  return yData; 
 
}

function getGroupedYValueForPie(groupCategory,jsonData){ 
  let numberOfCategories=groupCategory.length; 
  let yData=[]; 

  for(let i=0; i<numberOfCategories; i++){
    if(typeof yData[i]!=='object'){
      yData[i]=[];
    }

    jsonData.Data.forEach(function(item){
      if((item.Name).substring(item.Name.indexOf('-')+1)===groupCategory[i]){
        yData[i].push(item.Value);
      }
    })

  
  } 

  return yData; 

}

function getColorData(coloredData,jsonData){
  let colorData=[]; 
  if(!jsonData.Data[0].ChartJS_Color){
    return colorData;  
  }else{
  colorData.length=coloredData.length; 
  jsonData.Data.forEach(function(item){
    if(!colorData.includes(item.ChartJS_Color)){
      if(getChartType(jsonData.DataChartType) === 'line') {//lines grouping takes color diffrently (it takes it by grouping)
      colorData[coloredData.indexOf(item.Name.substring(item.Name.indexOf('-')+1))]=item.ChartJS_Color;
      }else{
        colorData[coloredData.indexOf(item.Name.substring(0,item.Name.indexOf('-')))]=item.ChartJS_Color;
      }
    }
  })
  return colorData; 
  }
  

}

function getChartType(chartTypeFromData){ 
  //the chartType in the data is still in the format of d3.js so a mapping is necessary 
  switch(chartTypeFromData){
    case 'VerticalBarChart' : 
    return 'bar'; 
    break;

    case 'PieChart' :
    return 'pie';
    break; 

    case 'LineChart' :
    case 'mixed' :
    return 'line';
    break;
    
    default:
    return chartTypeFromData; 
  }
}

function getChartTitle(chartType,jsonData,grouped){

  let action=''; 
  let group=grouped?(' groupé par '+jsonData.GroupedBy):''; 
  let title=''; 

  switch(chartType){
    case 'line' :
    action='Tendance'; 
    break; 

    case 'bar' :
    action='Comparaison '; 
    break; 

    case 'pie' :
    case 'polarArea' :
    case 'doughnut':
    action='Repartition'; 
    break; 
    
  }

  let secondYData = jsonData.DataChartYFeildLabel2?' et '+jsonData.DataChartYFeildLabel2:''; 

  title = action + ' du ' + jsonData.DataChartYFeildLabel + secondYData + ' par ' + jsonData.DataChartXFieldLabel + group;

  return title; 
}

//this function is only used when a bar chart is generated and the sub-type is changed 
function updateIndexAxis(axis) {
  if (newChart) {
    newChart.config.options.indexAxis=axis; 

    //the x and y scales must be switched. 
    let tempScales = newChart.config.options.scales.x; 
    newChart.config.options.scales.x=newChart.config.options.scales.y; 
    newChart.config.options.scales.y=tempScales; 
    newChart.update(); 
    console.log('Updated chart config:', newChart.config);
  }
}

function getData(jsonData,chartType){
  let data; 
  let xData = jsonData.Data.map(item => item.Name); 
  let yData = jsonData.Data.map(item => item.Value);
  console.log(yData,false); 
  let colorData=[]; 
  
  if(jsonData.Data[0].ChartJS_Color){
  colorData = jsonData.Data.map(item => item.ChartJS_Color); 
  }

  console.log(jsonData.Data.DataChartYFeildLabe); 
  
  data= {
    labels: xData,
    datasets: [{
      label:jsonData.DataChartYFeildLabel, 
      data: yData,
      backgroundColor:(chartType==='line'?'':colorData),
      pointBackgroundColor:colorData
    }],
  };

  if(jsonData.Data[0].Value2){
    //to display 2 lines in a charts
    let yData2=jsonData.Data.map(item => item.Value2)
    data.datasets.push({
      label:jsonData.DataChartYFeildLabel2,
      data:yData2
    })

    //to display mixed charts
    if(jsonData.DataChartType==='mixed'){
      data.datasets[0].type='bar'; 
      data.datasets[1].type='line'; 
    }
  } 

return data; 
  
}

function getGroupedData(chartType,jsonData){

  let dataLabels;
  let datasetsLabels;
  let colorData; 

  //getting the values (a grouped bar takes values diffretly than other types)
  if(chartType==='bar'){
    dataLabels=getGroupedXValue(jsonData); 
    datasetsLabels=getXElements(jsonData); 
    colorData=getColorData(datasetsLabels,jsonData); 
    yData = getGroupedYValueForBar(datasetsLabels,dataLabels,jsonData); 
  }else{
    dataLabels=getXElements(jsonData); 
    datasetsLabels=getGroupedXValue(jsonData);
    colorData=getColorData(chartType==='line'?datasetsLabels:dataLabels,jsonData); 
    yData = getGroupedYValueForPie(datasetsLabels,jsonData); 
  }


  
  
  let datasetArray=[]; 
  
  for(let i=0; i<yData.length; i++){

    datasetArray.push(
      {
        label : datasetsLabels[i],
        data: yData[i],
        backgroundColor : (chartType==='pie')?colorData:colorData[i],
        borderColor:chartType==='line'?colorData[i]:'white',
        //if it's a pie, each circle will have all the colors but if it is a grouped bar (or other type of grouped chart) each bar will tak eone color 
      }
    )

  }
  
  return(
    {
      labels:dataLabels,
      datasets:datasetArray
      
    }
  )

}

function getConfig(data,chosenChartType,jsonData,grouped) {
  let title=getChartTitle(chosenChartType,jsonData,grouped); 
  let urls=getDatapointUrls(jsonData); 
  let manyDatasets=data.datasets.length > 1;  
  console.log(urls); 

  console.log('title : '+title); 
    const config = {
      type: chosenChartType,
      data,
      options: {
        onClick : jsonData.Data[0].Record_Url ? function(evt, activeElements) {
          // Check if any elements are clicked
          if (activeElements.length > 0) {
              // Get the first active element
              const firstElement = activeElements[0];
              
              // Get the dataset and index of the clicked element
              const datasetIndex = firstElement.datasetIndex;
      
              // Perform your desired action
              window.open(getDatapointUrls(jsonData)[datasetIndex])
          }
        } : 'none',
        responsive:true, 
        indexAxis: 'x', 
        scales: {
          x:{
          display:(chosenChartType!=='pie' && chosenChartType!=='doughnut' &&  chosenChartType!=='polarArea'),//if it's a pie chart we don't need to show scales
          title : {
            display: true,
            text: jsonData.DataChartXFieldLabel + (grouped?' groupé par '+jsonData.GroupedBy : '')
          }
          },
          y:{
            display:(chosenChartType!=='pie' && chosenChartType!=='doughnut' &&  chosenChartType!=='polarArea'),//if it's a pie chart we don't need to show scales
            beginAtZero : true,
            title: {
              display: !(chosenChartType=='line' && manyDatasets && !grouped) ,
              text: jsonData.DataChartYFeildLabel
            },

  

          },

        },

        plugins : {

          legend : {
            //if it is not grouped there is no need to show the labels at the legends unless it is a pie (because a pie dpesn't have  axes)
            display: chosenChartType === 'pie' || manyDatasets ||  chosenChartType === 'doughnut' ||  chosenChartType === 'polarArea',
          },

          title: {
            display: true,
            text:title,
            font: {
              size: 24, // Font size of the title
              weight: 'bold' // Font weight of the title
            },
          },

          tooltip: { 
            callbacks: {
                display:true,
                label: function(tooltipItem) {
                    const total = tooltipItem.dataset.data.reduce((acc, curr) => acc + curr, 0);
                    const value = tooltipItem.raw;
                    const percentage = (chosenChartType==='pie' || chosenChartType==='doughnut' || chosenChartType==='polarArea' ) ? (((value / total) * 100).toFixed(2))+'%': '';
                    //createStaticTooltips(tooltipItem.dataset.label,value,percentage,tooltipItem.dataset.backgroundColor); 
                    return `${tooltipItem.dataset.label}: ${value} ${percentage}`; //if it is not a polar,pie or doughnut chart, the percentage will not show
                }
            }
        }
        },
      }
    }

    return config; 
  
}

function stack(){
  newChart.config.options.scales.x.stacked=true; 
  newChart.config.options.scales.y.stacked=true;
  
  newChart.update(); 
}

function unstack(){
  newChart.config.options.scales.x.stacked=false; 
  newChart.config.options.scales.y.stacked=false;
  
  newChart.update(); 

}

function displayDynamicOptions(chartType,grouped){
  //the scale selector :
  if(chartType==='pie' || chartType ==='doughnut' || chartType === 'polarArea'){
    document.getElementById('scaleOption').style.display='none'; 
  }else{
    document.getElementById('scaleOption').style.display='inline';
    document.getElementById('scale').value='undefined'; //to reset it 
  }

  if(chartType==='bar'){
  (document.getElementById('barOptions')).style.display='inline'; 
  (document.getElementById('vertical')).checked=true; 
 
    if(grouped){
    (document.getElementById('stackOption')).style.display='inline';
    (document.getElementById('stack')).checked=false;
    }else{ 
      document.getElementById('stackOption').style.display='none';
    }

  }else{ //for demo purposes when switching between test files
    document.getElementById('barOptions').style.display='none';
    } 
}

/** 
function createStaticTooltips(label,value,percentage,color) {
  const tooltipList = document.getElementById('customTooltip');
  tooltipList.style.display='block'; 
  tooltipList.innerHTML = ''; // Clear existing tooltips

  newChart.config.data.labels.forEach((label, index) => {
      const value = newChart.config.data.datasets[0].data[index]
      const tooltipItem = document.createElement('div');
      tooltipItem.style.marginBottom = '10px';
      tooltipItem.innerHTML = `<span> <strong>Color:</strong> <span style="display:inline-block;width:12px;height:12px;background-color:${color};"></span> </span> ${label}  ${value} ${percentage}`;
      tooltipList.appendChild(tooltipItem);
  });
}
*/

async function createRegularChart(jsonData) {
    let chartType=getChartType(jsonData.DataChartType); 
    let data = getData(jsonData,chartType); 
    let config=getConfig(data,chartType,jsonData,false); 
    newChart = new Chart(clx,config); 
    displayDynamicOptions(chartType,false);
}

async function createGroupedChart(jsonData) {
  let chartType=getChartType(jsonData.DataChartType);
  let data = getGroupedData(chartType,jsonData); 
  let config=getConfig(data,chartType,jsonData, true);  
  newChart = new Chart(clx,config); 
  displayDynamicOptions(chartType,true);
}

function getDatapointUrls(jsonData){ 
let urls=[]; 
jsonData.Data.forEach(function(item){
  if(!(urls.includes(item.Record_Url))){ 
    urls.push(item.Record_Url)
  }
})

return urls; 
}

document.getElementById('vertical').addEventListener('change', function(){
  document.getElementById('horizontal').checked=false; 
  updateIndexAxis('x'); 
}); 

document.getElementById('horizontal').addEventListener('change', function(){
  document.getElementById('vertical').checked=false; 
  updateIndexAxis('y'); 

}); 

document.getElementById('stack').addEventListener('change',function(){
  if(this.checked){
    stack(); 
  }else{
    unstack(); 
  }
})

document.getElementById('testButton').addEventListener('click',function(){
  let testUrl='../testData/'+document.getElementById('testFile').value; 
  console.log('Test File : ', testUrl); 
  createChart(testUrl); 
})

document.getElementById('scale').addEventListener('change',function(){
  newChart.config.options.scales.y.ticks.stepSize=this.value; 
  newChart.update(); 
  console.log(newChart.config); 
})

async function createChart(testUrl){

  if(newChart){
    newChart.destroy(); //destrotying an already existing chart to replace it with a new one. 
  }


  let jsonData = await fetchData(testUrl); 

  getSelectionData(jsonData); 

  if(!isGrouped(jsonData)){
    createRegularChart(jsonData);

  }else {
    createGroupedChart(jsonData); 
  }
}

function getSelectionData(jsonData){
  document.getElementById('chartType').innerHTML = jsonData.DataChartType; 
  document.getElementById('xAxis').innerHTML = jsonData.DataChartXFieldLabel; 
  document.getElementById('yAxis').innerHTML = jsonData.DataChartYFeildLabel; 
  document.getElementById('yAxis2').innerHTML = (jsonData.DataChartYFeildLabel2)?jsonData.DataChartYFeildLabel2:'' 
  document.getElementById('group').innerHTML = jsonData.GroupedBy?jsonData.GroupedBy:''; 
  

}
 