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

    canDisplayDatalable(angle,thickness){
        if(this.grouped){
          return (angle >= 38 && thickness >=60)
        }else {
          return (angle >= 20)
        }
  
      }
}