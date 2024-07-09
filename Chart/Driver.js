import BarChart from './BarChart.js'; 
import LineChart from './LineChart.js'; 
import PieChart from './PieChart.js'; 
import FunnelChart from './FunnelChart.js'; 
import DoughnutChart from './DoughnutChart.js'; 
import PolarAreaChart from './PolarAreaChart.js'; 
import GaugeChartList from './GaugeChartList.js';  
import RadarChart from './RadarChart.js';  
import BubbleChart from './BubbleChart.js';  
import MapChart from './MapChart.js';  
import HeatChart from './HeatChart.js'; 


let chart; 
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

let testUrl='../testData/'+'regular1.json'; 
createChart(testUrl); 


async function createChart(url){
    let clx=document.getElementById('newChart').getContext('2d'); 
    let fetchedData = await fetchData(url); 
    

    if(chart){
      chart.destroyChart(); 
    }

    switch(fetchedData.DataChartType){
      case 'VerticalBarChart' :
        chart = new BarChart(clx, fetchedData);
        chart.drawChart(); 
      break;

      case 'PieChart' :
        chart = new PieChart(clx, fetchedData);
        chart.drawChart(); 
      break; 

      case 'LineChart' :
        chart = new LineChart(clx, fetchedData);
        chart.drawChart(); 
      break; 

      case 'funnel':
        chart = new FunnelChart(clx, fetchedData); 
        chart.drawChart(); 
      break; 

      case 'doughnut':
        chart = new DoughnutChart(clx, fetchedData); 
        chart.drawChart(); 
      break; 

      case 'polarArea' :
        chart=new PolarAreaChart(clx,fetchedData); 
        chart.drawChart(); 
      break; 

      case 'gauge' :
        chart=new GaugeChartList(fetchedData); 
        chart.drawChart(); 
      break;
      
      case 'radar' :
        chart = new RadarChart(clx, fetchedData);
        chart.drawChart(); 
      break;  

      case 'bubble' :
        chart = new BubbleChart(clx, fetchedData);
        chart.drawChart();
      break;  

      case 'map' :
        let countries;
        await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json').then((result)=>result.json()).then((datapoint) => {
        countries = ChartGeo.topojson.feature(datapoint, datapoint.objects.countries).features; 
        });

        chart = new MapChart(clx,fetchedData,countries);
        chart.drawChart(); 
      break;  

      case 'heat' : 
      chart = new HeatChart(clx,fetchedData);
      chart.drawChart(); 
      break; 

      default :
      throw new Error('Chart type is not supported'); 
    }
    
}



/**
 * Event listeners : 
 */

document.getElementById('vertical').addEventListener('change', function(){
    document.getElementById('horizontal').checked=false; 
    chart.updateIndexAxis('x'); 
  }); 
  
document.getElementById('horizontal').addEventListener('change', function(){
    document.getElementById('vertical').checked=false; 
    chart.updateIndexAxis('y'); 
  
  }); 
  
document.getElementById('stack').addEventListener('change',function(){
    chart.updateStackStatus()
  })

document.getElementById('scale').addEventListener('change',function(){
    if(chart.config.options.indexAxis==='x'){
      chart.updateScale(this.value,'y');
    }else {
      chart.updateScale(this.value,'x');
    }
})

document.getElementById('secondScale').addEventListener('change',function(){
  chart.updateScale(this.value,'x'); 
})

document.getElementById('showDatalable').addEventListener('change',function(){
  chart.updateDatalabelView(); 
})

document.getElementById('showGraticules').addEventListener('change',function(){
  chart.updateGraticuleView(); 
})






