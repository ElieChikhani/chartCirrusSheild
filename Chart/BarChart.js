import BaseChart from './BaseChart.js'; 

export default class BarChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }


    getType(){
        return 'bar';
    }

    getTitle(){
        let groupement=this.grouped?' groupe par '+this.groupLabel:'';
        return ('Comparaison du '+this.yAxisLabel+' par '+this.xAxisLabel+groupement); 

    }

    mapData(){
        let data;

        if(this.grouped){
            data=this.getGroupedData(); 

        }else{
            data=super.mapData(); 
            data.datasets[0].backgroundColor = this.getColorData(data.labels); 
        }

        return data; 

    }

    getGroupedData(){ 
    let dataLabels=this.getGroupedXValue(); 
    let datasetsLabels=this.getXElements(); 
    let colorData=this.getColorData(datasetsLabels); 
    let yData = this.getGroupedYValue(datasetsLabels,dataLabels);  
        
    let datasetArray=[]; 
        
    for(let i=0; i<yData.length; i++){
        
    datasetArray.push(
    {
    label : datasetsLabels[i],
    data: yData[i],
    backgroundColor : colorData[i],
    } )   
    } 

    return(
        {
          labels:dataLabels,
          datasets:datasetArray
          
        }
      )

    }
   
    getGroupedYValue(xData,groupCategory){

        let yData=[]; 
        let numberOfElements = xData.length; 
        let numberOfCategories = groupCategory.length; 
        yData.length=numberOfElements; 
      
       for(let i=0; i<numberOfElements; i++){
          yData[i]=[]; 
          yData[i].length=numberOfCategories; 
          yData[i].fill(null); 
        }; 
      
      
        this.jsonData.Data.forEach(function(item){
          let categoryIndex= groupCategory.indexOf((item.Name).substring((item.Name).indexOf('-')+1));
          let elementIndex = xData.indexOf((item.Name).substring(0,(item.Name).indexOf('-')));
          console.log(yData);
          yData[elementIndex][categoryIndex] = item.Value; 
        });
      
      
        return yData; 
       
    }

    stack(){
        this.chart.config.options.scales.x.stacked=true; 
        this.chart.config.options.scales.y.stacked=true;
        this.update(); 
    }

    unstack(){
        this.chart.config.options.scales.x.stacked=false;
        this.chart.config.options.scales.y.stacked=false;
        this.update(); 
    }

}