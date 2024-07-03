import BaseChart from './BaseChart.js'; 

export default class PieChart extends BaseChart {

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'pie'; 
    }

    getTitle(){
      let groupement=this.grouped?' groupé par '+this.groupLabel:'';
      return ('Repartition du '+this.yAxisLabel+' par '+this.xAxisLabel+groupement); 
    }
    
    //these plugins are external plugins, and not included in the plugin within the options 
    getPluginsExtention(){

      let plugins = []; 
         plugins.push(ChartDataLabels); //from the extension
         plugins.push(this.getDatalabels()); 
         
        if(this.grouped){
    
         plugins.push({
            id: 'outerLabel',
            afterDraw: (chart) => this.drawOuterLabels(chart) //after render : only after the first drawing not after any updates
         })
         plugins.push(this.getLegendMargin());
       }
    
      return plugins; 
    
    }
    
    getDatalabels() {
      return {
        formatter: (value, context) => {
         let total = this.getTotal(context); 
         
         if(total===null){
          return null; 
         }

         let percentage = ((value / total )* 100 ).toFixed(1);

         //check if the label can fit in the portion
         let sliceAngle = (value / total) * 360;
         let minAngleForLabel = this.grouped ? 38 : 35; 
         let chartArea = context.chart.chartArea;
         let radius = (Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2);
         let thickness = radius / context.dataset.data.length;


         console.log(thickness); 

         return this.displayDatalable(sliceAngle,thickness) ? value + '\n' + percentage+'%' : ' '; 
        },

        color: (context) => {
          let dataset = context.chart.data.datasets[context.datasetIndex];
          let bgColor = dataset.backgroundColor[context.dataIndex]; // Use the base background color
          let color = this.isLight(bgColor) ? 'black' : 'white'; // Determine color based on initial background color
          return color;
        },
        font: {
          weight: 'bold',
          size: 11,
          family: 'Arial'
        },
        anchor: 'center',
        align: 'center',
        offset: 20,
      };
    }

    //this method returns true if the datalble fits in the portion and false otherwise
    displayDatalable(angle,thickness){
      if(this.grouped){
        return (angle >= 38 && thickness >=40)
      }else {
        return (angle >= 20)
      }

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
      console.log(options); 
      options.aspectRatio=1.5
      options.plugins.tooltip=this.getTooltip()
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
  
      let horizontalOffset = 50; // Length of horizontal lines outside the chart
      let verticalSpacing = 30; // Vertical spacing between horizontal lines
      let angleLength = 20; // Length of the angled line segment
      let fixedAngle = Math.PI / 4; // Fixed angle (45 degrees)
  
      // Fixed end point for the horizontal lines
      let fixedEndX = this.chartArea.right + horizontalOffset;
  
      datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          const firstNonHiddenArc = meta.data.find(arc => !arc.hidden);
  
          if (!firstNonHiddenArc) return; // Skip if all data points are hidden
  
          let radius = firstNonHiddenArc.outerRadius; // Outer radius of the arc
  
          // Calculate start position at the top edge of the circle
          let startX = this.centerX;
          let startY = this.centerY - radius;
  
          // Calculate the endpoint of the angled line segment
          let angledEndX = startX + angleLength * Math.cos(fixedAngle);
          let angledEndY = startY - angleLength * Math.sin(fixedAngle);
  
          // Calculate the start position of the horizontal line
          let endX = fixedEndX - 200;
          let endY = angledEndY;
  
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
    //this function returns the total of the values of non hidden elements in the chart. 
    getTotal(context){
      let dataset = context.chart.data.datasets[context.datasetIndex];
      let meta = context.chart.getDatasetMeta(context.datasetIndex);
      let element = meta.data[context.dataIndex];
    
      if (element.hidden) {
        return null;
      }
    
      let total = dataset.data.reduce((sum, val, i) => {
        return meta.data[i].hidden ? sum : sum + val;
      }, 0);

      return total; 
    }

    getTooltip(){
      let that=this; 
      return {
        callbacks: {
          label: function(tooltipItem) {
            let value = tooltipItem.raw;
            let total = that.getTotal(tooltipItem)
            let percentage = (value/total * 100).toFixed(1);
            return `${value} (${percentage}%)`;
        }
        }
      }
    }

    getLegendMargin(){
      return {
      id:'legendMargin',
      afterInit(chart,args,plugins) {
        let originalFit = chart.legend.fit; 
        chart.legend.fit = function fit() {
          if(originalFit){
            originalFit.call(this)
          }

          return this.height += 25
        }
      }
    }

    }


}