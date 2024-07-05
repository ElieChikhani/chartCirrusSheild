import BarChart from './BarChart.js'; 
import LineChart from './LineChart.js'; 
import PieChart from './PieChart.js'; 
import FunnelChart from './FunnelChart.js'; 
import DoughnutChart from './DoughnutChart.js'; 
import PolarAreaChart from './PolarAreaChart.js'; 
import GaugeChart from './GaugeChart.js';  
import RadarChart from './RadarChart.js';  
import BubbleChart from './BubbleChart.js';  
import MapChart from './MapChart.js';  
import HeatChart from './HeatChart.js'; 


let chart; 
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

let testUrl='../testData/'+'grouped4.json'; 
createChart(testUrl); 


async function createChart(url){
    document.getElementById('newChart').style.display='block'; 
    document.getElementById('chartViewContainer').style.display='block'; 
    let gaugeCharts = document.getElementsByClassName("gaugeCanvas");; 
    if (gaugeCharts.length > 0) {
      // Convert HTMLCollection to an array
      Array.from(gaugeCharts).forEach(function(item) {
        item.remove();
      });
    }

    let clx=document.getElementById('newChart').getContext('2d'); 
    let fetchedData = await fetchData(url); 
    

    if(chart){
      chart.destroyChart(); 
    }

    switch(fetchedData.DataChartType){
      case 'VerticalBarChart' :
        chart = new BarChart(clx, fetchedData);
        (document.getElementById('barOptions')).style.display='inline'; 
        (document.getElementById('vertical')).checked=true; 
        document.getElementById('stackOption').style.display=chart.grouped?'inline':'none'; 
        (document.getElementById('stack')).checked=true; 
        chart.drawChart(); 
        document.getElementById('scaleOptions').style.display='block';
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
      let container = document.getElementById('chartViewContainer');
      container.style.display='flex';   

        fetchedData.Data.forEach(function(item,i){
          let newCanvas= document.createElement('canvas'); 
          container.appendChild(newCanvas);
          newCanvas.className='gaugeCanvas';  
          chart = new GaugeChart(newCanvas,fetchedData,i);
          chart.drawChart(); 
        })
        document.getElementById('scaleOptions').style.display = 'none'; 
      break;
      
      case 'radar' :
        chart = new RadarChart(clx, fetchedData);
        chart.drawChart(); 
      break;  

      case 'bubble' :
        chart = new BubbleChart(clx, fetchedData);
        chart.drawChart();
        document.getElementById('scaleOptions').style.display='block';
        document.getElementById('secondScale').style.display='inline';
        document.getElementById('datalabelsOptions').style.display='block';
      break;  

      case 'map' :
        let countries;
        await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json').then((result)=>result.json()).then((datapoint) => {
        countries = ChartGeo.topojson.feature(datapoint, datapoint.objects.countries).features; 
        });

        chart = new MapChart(clx,fetchedData,countries);
        chart.drawChart(); 
        document.getElementById('mapOptions').style.display = 'inline'
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
    chart.updateScale(this.value,chart.config.options.scales.indexAxis); 
})

document.getElementById('secondScale').addEventListener('change',function(){
  chart.updateScale(this.value,'x'); 
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






