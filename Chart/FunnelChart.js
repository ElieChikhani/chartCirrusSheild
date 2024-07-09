import BaseChart from './BaseChart.js'; 

export default class FunnelChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

     /**
     * @override
     */
    getType(){
        return 'funnel';
    }

     /**
     * @override
     */
    getTitle(){
        return (this.yAxisLabel+' par '+this.xAxisLabel); 
    }

      /**
     * @override
     */
      mapData(){
        let data=super.mapData();  
        data.datasets[0].backgroundColor=this.getColorData(data.labels); 
        return data; 
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
        let plugins=super.getPlugins(); 
        console.log(plugins); 
        plugins.datalabels ={formatter:function(value, context) {
            return value;
        }}
        return plugins; 
    }

     /**
     * @override
     */
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

     /**
     * @override
     */
    getOptions(){
        let options=super.getOptions();
        options.indexAxis='y'; 
        return options; 
    }





}