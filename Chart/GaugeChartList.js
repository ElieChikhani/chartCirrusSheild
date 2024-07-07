import GaugeChart from './GaugeChart.js';

export default class GaugeChartList {
    //a gauges chart is a group of gauge charts 
    chartList=[]

    constructor(fetchedData){
        this.setChartList(fetchedData); 
    }
    

    //create the canvas html elements
    getCanvasList(fetchedData){
        document.getElementById('newChart').style.display='none';
        let canvasList = []; 
        let container = document.getElementById('chartViewContainer');
        let gaugeContainer = document.createElement('div'); 
        container.appendChild(gaugeContainer); 
        gaugeContainer.className = 'gaugeContainer'  
        this.setTitle(fetchedData,gaugeContainer)
        fetchedData.Data.forEach(function(item){
            let newCanvas= document.createElement('canvas'); 
            gaugeContainer.appendChild(newCanvas);
            newCanvas.className='gaugeCanvas';  
            canvasList.push(newCanvas); 
        })

        return canvasList; 

    }

    //create the gayge charts
    setChartList(fetchedData){
        let canvasList = this.getCanvasList(fetchedData); 
        let that = this; 
        fetchedData.Data.forEach(function(item,i){
            that.chartList.push (new GaugeChart(canvasList[i],fetchedData.Data[i]))
        })

    }

    //draw all the charts. 
    drawChart(){
       this.chartList.forEach(function(item){
            item.drawChart(); 
        })
    }

    //sets the general title of all the charts 
    setTitle(fetchedData,container){
        let titleElement = document.createElement('h3'); 
        titleElement.innerHTML = fetchedData.DataChartYFieldLabel+' par '+fetchedData.DataChartXFieldLabel
        container.appendChild(titleElement); 

    }
} 