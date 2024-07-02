import BaseChart from './BaseChart.js'; 

export default class RadarChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'radar'
    }

    isGrouped(){
        return false; 
    }

    mapData(){
        let data = this.jsonData;
        return data.Data; 
    }

    getScales(){
    return {
        x:{
          display:false
          },
        y:{
            display : false
          },

        r:{
            beginAtZero:true
        }
      }
    }

    getPlugins(){
        return {
            legend: {
                display: true
            }

        }
        
    }

}