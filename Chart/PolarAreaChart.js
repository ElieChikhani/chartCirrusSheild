import PieChart from './PieChart.js'; 

export default class PolarAreaChart extends PieChart{

    constructor(clx,fetchedData){
        super(clx,fetchedData); 
        this.grouped=false; 
    }

    getType(){
        return 'polarArea'; 
    }
}