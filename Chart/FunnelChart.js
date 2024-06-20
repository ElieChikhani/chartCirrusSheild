import BaseChart from './BaseChart.js'; 

export default class FunnelChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }


    getType(){
        return 'funnel';
    }

    getTitle(){
        return (this.yAxisLabel+' par '+this.xAxisLabel); 

    }

    setConfig(){
        super.setConfig(); 

        ChartDataLabels

        this.config.plugins=[ChartDataLabels]; 
    }

    getPlugins(){
        let plugins=super.getPlugins(); 
        console.log(plugins); 
        plugins.datalabels ={formatter:function(value, context) {
            // Return the value as is, without percentage
            return value;
        }}
        return plugins; 
    }

    getScales(){
        return {
            x:{
                display:false
            },

            y:{
                display:true
            }
        }
    }

    getOptions(){
        let options=super.getOptions();
        options.indexAxis='y'; 
        return options; 
    }

    mapData(){
        let data=super.mapData();  
        data.datasets[0].backgroundColor=this.getColorData(data.labels); 
        return data; 
    }



}