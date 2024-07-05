import ColorService from '../Services/ColorService.js';
import BaseChart from './BaseChart.js'; 

export default class BubbleChart extends BaseChart {
    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'bubble';
    }

    getTitle(){
        let groupement = this.grouped ? ' groupé par '+this.jsonData.GroupedBy : ' ';
        return this.xAxisLabel+', '+this.yAxisLabel+' et '+this.jsonData.NumericalValue3+groupement; 
    }

    mapData() {
        let data = this.jsonData.Data; 

        data.datasets.forEach(function(item){
            if(item.backgroundColor){
                item.borderColor = item.backgroundColor; 
                item.backgroundColor = ColorService.changeOpacity(item.backgroundColor,0.2)
            }
        })
        return data; 

    }

    isGrouped(){
        return this.groupLabel ? true : false; 
    }

    getScales(){
        return {
            x:{
              beginAtZero:true,
              title : {
                display: true,
                text: this.xAxisLabel
              },
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

    setXAxisLabel(){
        this.xAxisLabel=this.jsonData.NumericalValue1; 
    }

    setYAxisLabel(){
        this.yAxisLabel=this.jsonData.NumericalValue2;
    }

    setConfig(){
        super.setConfig(); 
        this.config.plugins=[ChartDataLabels]; 
    }

    getPlugins(){
        let plugins = super.getPlugins(); 
        plugins.datalabels = {
            display:false,
            align:"end",
            anchor:"end",
        }

        plugins.legend = {
            display:this.grouped
        }

        return plugins; 

    }

    updateDatalabelView(){ 
        this.chart.config.options.plugins.datalabels.display=!this.chart.config.options.plugins.datalabels.display; 
        this.update(); 
    }

    displayDynamicOptions(){
        document.getElementById('scaleOptions').style.display='block';
        document.getElementById('secondScale').style.display='inline';
        document.getElementById('datalabelsOptions').style.display='block';
    }

    

}