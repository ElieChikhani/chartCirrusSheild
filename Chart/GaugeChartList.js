import GaugeChart from './GaugeChart.js';

export default class GaugeChartList {

    chartList=[]

    constructor(fetchedData){
        this.setChartList(fetchedData); 
    }
    

    getCanvasList(fetchedData){
        document.getElementById('newChart').style.display='none';
        let canvasList = []; 
        let container = document.getElementById('chartViewContainer');
        container.style.display='flex';   
        this.setTitle(fetchedData,container)
        fetchedData.Data.forEach(function(item){
            let newCanvas= document.createElement('canvas'); 
            container.appendChild(newCanvas);
            newCanvas.className='gaugeCanvas';  
            canvasList.push(newCanvas); 
        })

        return canvasList; 

    }

    setChartList(fetchedData){
        let canvasList = this.getCanvasList(fetchedData); 
        let that = this; 
        fetchedData.Data.forEach(function(item,i){
            that.chartList.push (new GaugeChart(canvasList[i],fetchedData.Data[i]))
        })

    }

    drawChart(){
       this.chartList.forEach(function(item){
            item.drawChart(); 
        })
    }

    setTitle(fetchedData,container){
        let titleElement = document.createElement('h3'); 
        titleElement.innerHTML = fetchedData.DataChartYFeildLabel+' par '+fetchedData.DataChartXFieldLabel
        container.appendChild(titleElement); 

    }
} 