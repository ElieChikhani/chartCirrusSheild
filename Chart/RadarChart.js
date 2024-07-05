import BaseChart from './BaseChart.js'; 
import ColorService from '../Services/ColorService.js';

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
        let data = this.jsonData.Data; 

        data.datasets.forEach(function(item){
            if(item.backgroundColor){
                item.borderColor = item.backgroundColor; 
                item.backgroundColor = ColorService.changeOpacity(item.backgroundColor,0.2)
            }
        })
        return data; 
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