import PieChart from './PieChart.js'; 

export default class DoughnutChart extends PieChart { 

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
        options.cutout= 50 ;  
        return options; 
    }

    /**
     * @override
     * removing the cutout percentage of the outeradius and find the thickness
     */
    getThickness(outerRadius){
        return (outerRadius - (this.config.options.cutout/100)*outerRadius) / this.numberOfGroups; 
    }

}