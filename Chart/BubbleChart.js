import ColorService from '../Services/ColorService.js';
import BaseChart from './BaseChart.js'; 

export default class BubbleChart extends BaseChart {
    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    /**
     * @override
     */
    getType(){
        return 'bubble';
    }

    /**
     * @override
     */
    getTitle(){
        let groupement = this.grouped ? ' groupé par '+this.jsonData.GroupedBy : ' ';
        return this.xAxisLabel+', '+this.yAxisLabel+' et '+this.jsonData.NumericalValue3+groupement; 
    }

    /**
     * @override
     */
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

    /**
     * @override
     */
    isGrouped(){
        return this.groupLabel ? true : false; 
    }

    /**
     * @override
     */
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

    /**
     * @override
     */
    setXAxisLabel(){
        this.xAxisLabel=this.jsonData.NumericalValue1; 
    }

    /**
     * @override
     */
    setYAxisLabel(){
        this.yAxisLabel=this.jsonData.NumericalValue2;
    }

    /**
     * @override
     */
    setConfig(){
        super.setConfig(); 
        this.config.plugins=[ChartDataLabels]; 
    }

    /**
     * @override
     */
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

    /**
     * @override
     */
    displayDynamicOptions(){
        document.getElementById('scaleOptions').style.display='block';
        document.getElementById('secondScale').style.display='inline';
        document.getElementById('datalabelsOptions').style.display='block';
    }

    //if the display is true ist becomes false and vice versa. 
    updateDatalabelView(){ 
        this.chart.config.options.plugins.datalabels.display=!this.chart.config.options.plugins.datalabels.display; 
        this.update(); 
    }

    

}