import PieChart from './PieChart.js'; 

export default class DoughnutChart extends PieChart {

  MIN_THICKNESS = 60

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    /**
     * @override
     */
    getType(){
        return 'doughnut'; 
    }

    /**
     * @override
     */
    getOptions(){
        let options = super.getOptions();
        options.cutout='35%'; 
        return options; 
    }

  }