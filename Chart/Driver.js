import BarChart from './BarChart.js'; 
import LineChart from './LineChart.js'; 
import PieChart from './PieChart.js'; 
import FunnelChart from './FunnelChart.js'; 
import DoughnutChart from './DoughnutChart.js'; 
import PolarAreaChart from './PolarAreaChart.js'; 
import GaugeChart from './GaugeChart.js'; 

let chart; 
async function fetchData() {
    const url = '../testData/grouped3.json'; 
    const response = await fetch(url);
    return response.json();
}

async function createChart(){
    let clx=document.getElementById('newChart').getContext('2d'); 
    let fetchedData = await fetchData(); 

    switch(fetchedData.DataChartType){
      case 'VerticalBarChart' :
        chart = new BarChart(clx, fetchedData);
        (document.getElementById('barOptions')).style.display='inline'; 
        (document.getElementById('vertical')).checked=true; 
        document.getElementById('stackOption').style.display=chart.grouped?'inline':'none'; 
        chart.drawChart(); 
      break;

      case 'PieChart' :
        document.getElementById('scaleOption').style.display='none'; 
        chart = new PieChart(clx, fetchedData);
        chart.drawChart(); 
      break; 

      case 'LineChart' :
        chart = new LineChart(clx, fetchedData);
        chart.drawChart(); 
      break; 

      case 'funnel':
        chart = new FunnelChart(clx, fetchedData);
        document.getElementById('scaleOption').style.display='none'; 
        chart.drawChart(); 
      break; 

      case 'doughnut':
        chart = new DoughnutChart(clx, fetchedData);
        document.getElementById('scaleOption').style.display='none'; 
        chart.drawChart(); 
      break; 

      case 'polarArea' :
        chart=new PolarAreaChart(clx,fetchedData); 
        document.getElementById('scaleOption').style.display='none'; 
        chart.drawChart(); 
      break; 

      case 'gauge' :
      let container = document.getElementById('chartViewContainer');
       container.removeChild(document.getElementById('newChart'));
       container.style.display='flex';
       container.style.flexWrap='wrap'; 
       container.style.height='100%';  
       

        fetchedData.Data.forEach(function(item,i){
          let newCanvas= document.createElement('canvas'); 
          container.appendChild(newCanvas);
          newCanvas.className='gaugeCanvas';  
          chart = new GaugeChart(newCanvas,fetchedData,i);
          chart.drawChart(); 
        })
        document.getElementById('scaleOption').style.display = 'none'; 
        document.getElementById('gaugeTitle').style.display = 'block'; 
        document.getElementById('gaugeTitle').innerHTML = chart.xAxisLabel +' par '+chart.yAxisLabel;
      break; 

      default :
      throw new Error('Chart type is not supported'); 
      }
    
}

createChart();



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
    if(this.checked){
      chart.stack(); 
    }else{
      chart.unstack(); 
    }
  })

document.getElementById('scale').addEventListener('change',function(){
    chart.config.options.scales.y.ticks.stepSize=this.value; 
    chart.update(); 
  })


