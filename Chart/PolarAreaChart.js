import PieChart from './PieChart.js'; 

export default class PolarAreaChart extends PieChart{

    constructor(clx,fetchedData){
        super(clx,fetchedData); 
    }

     /**
     * @override
     */
    getType(){
        return 'polarArea'; 
    }

     /**
     * @override
     */
    isGrouped(){
        return false; //ploar area are not grouped
    }
}