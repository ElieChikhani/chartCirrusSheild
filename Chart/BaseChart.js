

export default class BaseChart {
    clx
    config
    chart 
    jsonData
    groupLabel
    xAxisLabel
    yAxisLabel
   
    

    constructor(clx,fetchedData){
        this.jsonData=fetchedData;
        this.clx = clx;
        this.setXAxisLabel();
        this.setYAxisLabel();
        this.setGroupLabel();
        this.grouped=this.isGrouped();  
        this.setConfig();
    }


    /**
     * Getters and setters for all chart attributes : 
     */

    isGrouped(){
      return this.groupLabel ? true : false; //group label is a feild added to the JSONData  
    } 

    getType(){
        throw new Error('Invalid type ! ')
    }

    getTitle(){
        return ' ';  
    }

    setConfig(){
        this.config = {
            type : this.getType(),
            data:this.mapData(),
            options: this.getOptions(),
        }
    }

    setXAxisLabel(){
        this.xAxisLabel=this.jsonData.DataChartXFieldLabel; 
    }

    setYAxisLabel(){
        this.yAxisLabel=this.jsonData.DataChartYFeildLabel;
    }

    setGroupLabel(){
        this.groupLabel=this.jsonData.GroupedBy;
    }

    getOptions() {
        return {
            responsive:true,
            maintainAspectRatio: false,
            indexAxis:'x',
            scales:this.getScales(),
            plugins:this.getPlugins(),
            layout:this.getLayout(),
            onClick: (event, elements) => {
              if (elements.length > 0) {
                  const clickedElementIndex = elements[0].index;
                  const sectionId = `section-${clickedElementIndex}`; 
                  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
                  document.getElementById(sectionId).style.backgroundColor = 'rgb(0,0,0,0.1)';
                  setTimeout(() => {
                  document.getElementById(sectionId).style.backgroundColor = 'white';
                }, 500); 
          }
        } 
        }

    }

    getPlugins(){

        return {
        legend : {
            display : false 
        },

        title : {
            display : true,
            text:this.getTitle(),
            font: {
                size: 24, // Font size of the title
                weight: 'bold' // Font weight of the title
              },
              align: 'center', 
              justify:'end'
        },
    }
    }

    getScales(){
        return {
            x:{
              title : {
                display: true,
                text: this.xAxisLabel + (this.grouped?' groupé par '+this.groupLabel : '')
              }
              },
              y:{
                beginAtZero : true,
                title: {
                  display: true,
                  text: this.yAxisLabel
                }, 
      
              },
          }
    }

    //the implementation of mapData (and all its overides) should be modidied when the JSONData is in correct format 
    mapData(){ 
        return {
            labels: this.jsonData.Data.map(item => item.Name),
            datasets: [{
              data: this.jsonData.Data.map(item => item.Value),
            }],
          };
    }

    getLayout(){
        return {
          //no implmentation needed at this phase. 
        }
    }


    /**
     * Actions performed on all type of charts : 
     */


    drawChart(){ 
        this.chart = new Chart(this.clx,this.config)
    }

    destroyChart(){
      this.chart.destroy(); 
    }

    update(){
      this.chart.update(); 
    }

    updateIndexAxis(axis) {
      if (this.chart) {
        this.chart.config.options.indexAxis=axis; 
   
        let tempScales = this.chart.config.options.scales.x; 
        this.chart.config.options.scales.x=this.chart.config.options.scales.y; 
        this.chart.config.options.scales.y=tempScales; 
        this.update(); 
      }
    }

    updateScale(newScale,axis){
      if (this.chart) {

        if(axis==='x'){
          this.chart.config.options.scales.x.ticks.stepSize=newScale;
        }else {
          this.chart.config.options.scales.y.ticks.stepSize=newScale;
        }

        this.update(); 
      }
    }

    resize(){
      this.chart.resize(); 
    }

    getXElements(){ 
        let xData=[]; 
        this.jsonData.Data.forEach(function(item){ 
          let element = (item.Name).substring(0,(item.Name).indexOf('-')); 
      
          if(!(xData.includes(element))){
            xData.push(element); 
          }
      }); 
      
      return xData; 
    }
      
    getGroupedXValue(){ 
        let groupCategory=[]; 
        this.jsonData.Data.forEach(function(item){ 
      
          let group = (item.Name).substring((item.Name).indexOf('-')+1); 
          if(!(groupCategory.includes(group))){
            groupCategory.push(group); 
        }
      });
      
        return groupCategory; 
    }

    getGroupedYValue(groupCategory){ 
        let numberOfCategories=groupCategory.length; 
        let yData=[]; 
      
        for(let i=0; i<numberOfCategories; i++){
          if(typeof yData[i]!=='object'){
            yData[i]=[];
          }
      
          this.jsonData.Data.forEach(function(item){
            if((item.Name).substring(item.Name.indexOf('-')+1)===groupCategory[i]){
              yData[i].push(item.Value);
            }
          })
      
        
        } 
      
        return yData; 
      
    }

    getColorData(coloredData){
      let grouped=this.grouped; 
      let colorData=[]; 
      if(!this.jsonData.Data[0].ChartJS_Color){
        return colorData;  
      }else{
      colorData.length=coloredData.length; 
      this.jsonData.Data.forEach(function(item){
        if(!colorData.includes(item.ChartJS_Color)){
            if(grouped){
            colorData[coloredData.indexOf(item.Name.substring(0,item.Name.indexOf('-')))]=item.ChartJS_Color;
            }else{
            colorData[coloredData.indexOf(item.Name)]=item.ChartJS_Color; 
            }
        }
      })
     
      return colorData; 
      }
    }

}