import BaseChart from './BaseChart.js'; 

export default class PieChart extends BaseChart {



    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'pie'; 
    }

    getTitle(){
        let groupement=this.grouped?' groupe par '+this.groupLabel:'';
        return ('Repartition du '+this.yAxisLabel+' par '+this.xAxisLabel+groupement); 
    }

    getDrawLinePlugin(){ 
      return {
        id: 'drawLinePlugin',
    
        beforeDatasetsDraw(chart, args, options) {
          const { ctx, chartArea } = chart;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;
    
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
              if (!element.hidden) {
                const midAngle = (element.startAngle + element.endAngle) / 2;
                const radius = element.outerRadius;
                const startX = centerX + Math.cos(midAngle) * radius;
                const startY = centerY + Math.sin(midAngle) * radius;
                const angleX = startX + Math.cos(midAngle) * 30;
                const angleY = startY + Math.sin(midAngle) * 30;
                const endX = startX < centerX ? angleX - 50 : angleX + 60;
    
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(startX, startY);  // Start from the edge of the segment
                ctx.lineTo(angleX, angleY);  // Draw angled line
                ctx.lineTo(endX, angleY);  // Draw horizontally
                ctx.strokeStyle = '#a6a6a6'; // Line color
                ctx.lineWidth = 2; // Line width
                ctx.stroke();
                ctx.restore();
    
                // Store end position
                element.endX = endX;
                element.endY = angleY;
                element.centerX = centerX; 
                element.startX = startX; 
              }
            });
          });
        },
    
        afterDatasetsDraw(chart, args, options) {
          const { ctx, chartArea } = chart;
          const datasets = chart.data.datasets;
    
          ctx.save();
          ctx.font = 'bold 12px Lucida Bright';
          ctx.fillStyle = 'black';
    
          datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
              if (!element.hidden) {
                const value = dataset.data[index];
                const total = dataset.data.reduce((sum, val, i) => {
                  return meta.data[i].hidden ? sum : sum + val;
                }, 0);
                const percentage = ((value / total) * 100).toFixed(1) + '%';
    
                // Calculate the label position
                const endX = element.endX;
                const endY = element.endY;
                const centerX=element.centerX; 
                const startX = element.startX; 
    
                // Draw the value above the line and percentage below it
                ctx.textAlign = 'center';
                ctx.fillText(value, startX < centerX ? endX+10: endX -5, endY - 10);  // Value above the line
                ctx.fillText(percentage, startX < centerX ? endX+10: endX -5, endY + 10);  // Percentage below the line
              }
            });
          });
    
          ctx.restore();
        }
      }; 
    }

    getDatalabels() { 
      return {
        formatter: (value, context) => {
          const dataset = context.chart.data.datasets[context.datasetIndex];
          const meta = context.chart.getDatasetMeta(context.datasetIndex);
          const element = meta.data[context.dataIndex];
    
          if (element.hidden) {
            return null;
          }
    
          const total = dataset.data.reduce((sum, val, i) => {
            return meta.data[i].hidden ? sum : sum + val;
          }, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return value + '\n' + percentage;
        },
        color: (context) => {
          const dataset = context.chart.data.datasets[context.datasetIndex];
          const meta = context.chart.getDatasetMeta(context.datasetIndex);
          const bgColor = meta.data[context.dataIndex].options.backgroundColor;
          const color = this.isLight(bgColor) ? 'black' : 'white'; // Adjust color based on background
          return color;
        },
        font: {
          weight: 'bold',
          size: 12,
          family: 'Arial'  // Updated to use Georgia font for more style
        },
        anchor: 'center',
        align: 'center',
        offset: 10,
      };
    }

    //for colors 
    isLight(color) {
      // Parse the color to RGB and calculate luminance
      const rgb = color.match(/\d+/g); // Assuming input like "rgb(255, 255, 255)"
      const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      return luminance > 186; // A commonly used threshold for contrast
    }

    getPlugins(){
        let plugins=super.getPlugins(); 
        plugins.legend={
          display:true,
        }   
        plugins.legend.onClick=(e, legendItem, legend) =>   {
          const index = legendItem.index;
          const ci = legend.chart;
        
          // Toggle visibility of the item
          ci.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = ci.getDatasetMeta(datasetIndex);
            meta.data[index].hidden = !meta.data[index].hidden;
          });
        
          // Recalculate and update the chart
          ci.update({
            duration: 800, // Animation duration in milliseconds
            easing: 'easeOutBounce' // Animation easing function
          });
        
          // Update the legend item hidden state
          ci.legend.legendItems.forEach((item, i) => {
            item.hidden = ci.getDatasetMeta(0).data[i].hidden;
          });
        };
    
        plugins.datalabels=this.getDatalabels(); 

        return plugins; 
    }
      
    setConfig(){
        let pluingsExtension=this.getPluginsExtention(); 
        super.setConfig(); 
        this.config.plugins=pluingsExtension;
    }

    getOptions(){
      let options = super.getOptions();
      options.aspectRatio=1.5
      return options; 
    }

    mapData(){

        let data; 

        if(this.grouped){

            data=this.getGroupedData(); 

        }else{
            data=super.mapData(); 
            data.datasets[0].backgroundColor=this.getColorData(data.labels); 
        }

        return data; 

    }

    getPluginsExtention(){

        let plugins = []; 

           plugins.push(this.getLegendMargin())
           
          if(this.grouped){
      
           plugins.push({
              id: 'outerLabel',
              afterDraw: (chart) => this.drawOuterLabels(chart) //after render : only after the first drawing not after any updates
           })
           plugins.push(ChartDataLabels);
           plugins.push(this.getDatalabels()); 
         }else{
          plugins.push(this.getDrawLinePlugin()); 
         }
      
        return plugins; 
      
    }
      
    drawOuterLabels(chart) {
      let ctx = chart.ctx;
      let datasets = chart.data.datasets;
  
      this.chartArea = chart.chartArea;
      this.centerX = (this.chartArea.left + this.chartArea.right) / 2;
      this.centerY = (this.chartArea.top + this.chartArea.bottom) / 2;
  
      // Maximum radius
      this.maxRadius = Math.max(...datasets.map(dataset => {
          const meta = chart.getDatasetMeta(datasets.indexOf(dataset));
          const firstNonHiddenArc = meta.data.find(arc => !arc.hidden);
          return firstNonHiddenArc ? firstNonHiddenArc.outerRadius : 0;
      }));
  
      const horizontalOffset = 50; // Length of horizontal lines outside the chart
      const verticalSpacing = 30; // Vertical spacing between horizontal lines
      const angleLength = 20; // Length of the angled line segment
      const fixedAngle = Math.PI / 4; // Fixed angle (45 degrees)
  
      // Fixed end point for the horizontal lines
      const fixedEndX = this.chartArea.right + horizontalOffset;
  
      datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          const firstNonHiddenArc = meta.data.find(arc => !arc.hidden);
  
          if (!firstNonHiddenArc) return; // Skip if all data points are hidden
  
          const radius = firstNonHiddenArc.outerRadius; // Outer radius of the arc
  
          // Calculate start position at the top edge of the circle
          const startX = this.centerX;
          const startY = this.centerY - radius;
  
          // Calculate the endpoint of the angled line segment
          const angledEndX = startX + angleLength * Math.cos(fixedAngle);
          const angledEndY = startY - angleLength * Math.sin(fixedAngle);
  
          // Calculate the start position of the horizontal line
          const endX = fixedEndX;
          const endY = angledEndY;
  
          // Draw the angled line segment
          ctx.save();
          ctx.strokeStyle = 'black';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(angledEndX, angledEndY);
          ctx.stroke();
  
          // Draw the horizontal line segment
          ctx.beginPath();
          ctx.moveTo(angledEndX, angledEndY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
  
          // Draw the label at the end of the horizontal line
          ctx.fillStyle = 'black';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(dataset.label, endX + 5, endY); // Position the label slightly to the right of the line end
          ctx.restore();
      });
  }

    getGroupedData(){
          let dataLabels=this.getXElements(); 
          let datasetsLabels=this.getGroupedXValue();
          let colorData=this.getColorData(dataLabels);  
          let yData = this.getGroupedYValue(datasetsLabels); 
    
        
        let datasetArray=[]; 
        
        for(let i=0; i<yData.length; i++){
        
          datasetArray.push(
            {
              label : datasetsLabels[i],
              data: yData[i],
              backgroundColor : colorData
            }
          )
        
        }
        
        return(
          {
            labels:dataLabels,
            datasets:datasetArray
            
          }
        )
        
    }

    getLayout(){
    return {
      
        padding: {
          left: 150,
          right: 150,
          top: 0,
          bottom: 50
      }
  }
    }

    getScales(){
        return {
            x:{
                display:false
            },

            y:{
                display:false
            }
        }
    }
  
    //too add space between labels and chart
    getLegendMargin(){
      return {
      id:'legendMargin',
      afterInit(chart,args,plugins) {
        let originalFit = chart.legend.fit; 
        chart.legend.fit = function fit() {
          if(originalFit){
            originalFit.call(this)
          }

          return this.height += 50
        }
      }
    }

    }

}