import BaseChart from './BaseChart.js'; 

export default class BubbleChart extends BaseChart {
    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'bubble';
    }

    mapData() {
        return this.jsonData.Data; 
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
                text: this.xAxisLabel + (this.grouped?' groupé par '+this.groupLabel : '')
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
        return {
        datalabels : {
            display:false,
            align:"end",
            anchor:"end",
        },

        legend : {
            display:this.grouped
        }
    }

    }

    updateDatalabelView(){ 
        this.chart.config.options.plugins.datalabels.display=!this.chart.config.options.plugins.datalabels.display; 
        this.update(); 
    }

    

}