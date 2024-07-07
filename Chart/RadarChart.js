import BaseChart from './BaseChart.js'; 
import ColorService from '../Services/ColorService.js';

export default class RadarChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

     /**
     * @override
     */
    getType(){
        return 'radar'
    }

     /**
     * @override
     */
    isGrouped(){
        return false; 
    }

     /**
     * @override
     */
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

     /**
     * @override
     */
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

     /**
     * @override
     */
    getPlugins(){
        return {
            legend: {
                display: true
            }

        }
        
    }

}