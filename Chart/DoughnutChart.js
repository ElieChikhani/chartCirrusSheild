import PieChart from './PieChart.js'; 

export default class DoughnutChart extends PieChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'doughnut'; 
    }

    getOptions(){
        let options = super.getOptions();
        options.cutout='35%'; 
        return options; 
    }
}