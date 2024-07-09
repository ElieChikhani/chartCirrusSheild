import BaseChart from './BaseChart.js'; 
import ColorService from "../Services/ColorService.js"

export default class BarChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

     /**
      *  @override
     */
    getType(){
        return 'bar';
    }

     /**
     * @override
     */
    getTitle(){
        let groupement=this.grouped?' groupe par '+this.groupLabel:'';
        return ('Comparaison du '+this.yAxisLabel+' par '+this.xAxisLabel+groupement); 
    }

     /**
     * @override
     */
    getScales(){
        let scales=super.getScales();
        scales.x.stacked=true;
        scales.y.stacked=true;
        return scales; 
    }

     /**
     * @override
     */
    mapData(){
        let data;

        if(this.grouped){
            data=this.getGroupedData(); 

        }else{
            data=super.mapData(); 
            let colorData = this.getColorData(data.labels); 
            data.datasets[0].borderWidth=1; 
            data.datasets[0].borderColor=colorData; 
            data.datasets[0].backgroundColor =colorData.map(color => ColorService.changeOpacity(color,0.2))
        }

        return data; 

    }

     /**
     * @override
     */
    getPlugins(){
        let plugins=super.getPlugins();
        plugins.legend.display=this.grouped; 

        return plugins; 
    }

    updateStackStatus(){
        this.chart.config.options.scales.x.stacked=!this.chart.config.options.scales.x.stacked; 
        this.chart.config.options.scales.y.stacked=!this.chart.config.options.scales.y.stacked;
        this.update(); 
    }

    displayDynamicOptions(){
        (document.getElementById('barOptions')).style.display='block'; 
        (document.getElementById('vertical')).checked=true; 
        document.getElementById('stackOption').style.display=this.grouped?'inline':'none'; 
        (document.getElementById('stack')).checked=true; 
        document.getElementById('scaleOptions').style.display='block';
    }

    
     // ----------------------- Data manipulation functions  -----------------------

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
    borderWidth:1,
    borderColor:colorData[i],
    backgroundColor : ColorService.changeOpacity(colorData[i],0.2),
    } )   
    } 

    console.log(datasetArray[1].backgroundColor); 
    return(
        {
          labels:dataLabels,
          datasets:datasetArray
          
        }
      )

    }
   
     /**
     * @override
     */
    getGroupedYValue(xData,groupCategory){

        let yData=[]; 
        let numberOfElements = xData.length; 
        let numberOfCategories = groupCategory.length; 
        yData.length=numberOfElements; 
      
       for(let i=0; i<numberOfElements; i++){
          yData[i]=[]; 
          yData[i].length=numberOfCategories; 
          yData[i].fill(null); // when an xData has no value in a group, its y Value is set to null
        }; 
      
      
        this.jsonData.Data.forEach(function(item){
          let categoryIndex= groupCategory.indexOf((item.Name).substring((item.Name).indexOf('-')+1));
          let elementIndex = xData.indexOf((item.Name).substring(0,(item.Name).indexOf('-')));
          yData[elementIndex][categoryIndex] = item.Value; 
        });
      
      
        return yData; 
       
    }
    
}