import BaseChart from './BaseChart.js'; 

export default class LineChart extends BaseChart{
    yAxisLabel2;  

    constructor(clx,fetchedData){
       super(clx,fetchedData); 
       this.setYAxisLabel2(); 
       this.chartData = this.mapData(); 
       this.setConfig(); 
    }

    setYAxisLabel2(){
        this.yAxisLabel2=this.jsonData.DataChartYFeildLabel2; 
    }

    getType(){
        return 'line'; 
    }

    getTitle(){
    let secondYData = this.yAxisLabel2?' et '+this.yAxisLabel2:''
    let grouping = this.isGrouped()? ' groupé par '+ this.groupLabel :''
    return ('Tendance' + ' des ' + this.yAxisLabel + secondYData + ' par ' + this.xAxisLabel+grouping);
    }

    mapData(){
        let data; 

        if(this.grouped){
            data=this.getGroupedData(); 
        }else {
            data=super.mapData(); 
            if(this.yAxisLabel2){
                data.datasets[0].label = this.yAxisLabel; 
                data.datasets[0].type = this.jsonData.Type1; 
                data.datasets.push({
                    type : this.jsonData.Type2,
                    label:this.yAxisLabel2,
                    data:this.jsonData.Data.map((d)=>d.Value2)
                })
            }
        }

        console.log(data); 
        return data; 

    }

    getPlugins(){
        let plugins=super.getPlugins(); 
        plugins.legend.display=this.isGrouped() || this.yAxisLabel2 !== undefined;
        return plugins; 
    }

    getGroupedData(){
        
          let dataLabels=this.getXElements(); 
          let datasetsLabels=this.getGroupedXValue();
          let colorData=this.getColorData(datasetsLabels);  
          let yData = this.getGroupedYValue(datasetsLabels); 
        
        
        let datasetArray=[]; 
        
        for(let i=0; i<yData.length; i++){
        
          datasetArray.push(
            {
              label : datasetsLabels[i],
              data: yData[i],
              backgroundColor : colorData[i],
              borderColor:colorData[i],
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

    getColorData(coloredData){
        let colorData=[]; 
        if(!this.jsonData.Data[0].ChartJS_Color){
          return colorData;  
        }else{
        colorData.length=coloredData.length; 
        this.jsonData.Data.forEach(function(item){
          if(!colorData.includes(item.ChartJS_Color)){
            colorData[coloredData.indexOf(item.Name.substring(item.Name.indexOf('-')+1))]=item.ChartJS_Color;
          }
        })
        return colorData; 
        }
        
    }
}