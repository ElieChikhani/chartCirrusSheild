import BaseChart from './BaseChart.js'; 
import ColorService from '../Services/ColorService.js';
import DrawingService from '../Services/DrawingService.js';

export default class PieChart extends BaseChart {

    //GROUP LABELS CONTRAINTS :
    HORIZONTAL_OFFSET = 50; // Length of horizontal lines outside the chart
    VERTICAL_SPACING = 30; // Vertical spacing between horizontal lines
    ANGLE_LENGTH = 20; // Length of the angled line segment 
    FIXED_ANGLE = Math.PI / 4; // Fixed angle (45 degrees)



    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

     /**
     * @override
     */
    getType(){
        return 'pie'; 
    }

     /**
     * @override
     */
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
            afterDraw: (chart) => this.drawGroupLabels(chart) //after render : only after the first drawing not after any updates
         })
         plugins.push(this.getLegendMargin());
       }
    
      return plugins; 
    
    }
   
    getDatalabels() {
      return {
        formatter: (value,context) => this.generateDatalabelContent(value,context),

        color: (context) =>  this.generateDatalableColor(context),
        font:{
          weight: 'bold',
          size: 10,
          family: 'Arial'
        },
        anchor: 'center',
        align: 'center',
        offset: 20,
      };
    }

    generateDatalabelContent(value,context){
      let total = this.getTotal(context); 
      if(total===null){
        return null; 
      }

      let percentage  = ((value / total )*100).toFixed(1); 
      let label = value + '\n' + percentage+'%';
      let sliceAngle = (value / total) * 360; 

      let chartArea = context.chart.chartArea
      let outerRadius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2;
      let thickness = outerRadius/this.numberOfGroups; 
      let groupIndex = context.datasetIndex; 
      let middleArcLength = this.getMiddleArcLength(thickness,groupIndex,sliceAngle,outerRadius); 
      let labelLength = this.getLabelLength(label);

      return this.canDisplayDatalabel(thickness, middleArcLength, labelLength) ? value + '\n' + percentage+'%' : ' '; 
    }

    getMiddleArcLength(thickness,groupIndex,sliceAngle,outerRadius){
      let sliceAngleRadians = sliceAngle * (Math.PI / 180);
      let radius = outerRadius - (groupIndex * thickness) - 0.5*thickness; 
      return(radius * sliceAngleRadians);
    }

    //generate the text color of the datalable according to the background of the portion
    generateDatalableColor(context){
      let dataset = context.chart.data.datasets[context.datasetIndex];
      let bgColor = dataset.backgroundColor[context.dataIndex]; // Use the base background color
      let color = ColorService.isLightColor(bgColor) ? 'black' : 'white'; // Determine color based on initial background color
      return color;
    }

    getLabelLength(label) {
      this.clx.font = 'bold 10px Arial'; // Adjust this to match your chart's font
      let labelLines = label.split('\n'); 
      let labelWidths = labelLines.map(line => this.clx.measureText(line).width);
      return Math.max(...labelWidths);
    }

    //this method returns true if the datalble fits in the portion and false otherwise
    canDisplayDatalabel(thickness, arcLength,labelLength) {
      return (thickness >= labelLength && arcLength >= labelLength);
    }

     /**
     * @override
     */
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

            if(meta.data[index]){
            meta.data[index].hidden = !meta.data[index].hidden;
            }
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
      
     /**
     * @override
     */
    setConfig(){
        let pluingsExtension=this.getPluginsExtention(); 
        super.setConfig(); 
        this.config.plugins=pluingsExtension;
    }

     /**
     * @override
     */
    getOptions(){
      let options = super.getOptions();
      console.log(options); 
      options.aspectRatio=1.5
      options.plugins.tooltip=this.getTooltip()
      return options; 
    }

     /**
     * @override
     */
    mapData(){
      let data; 

      if(this.grouped){
         data=this.getGroupedData(); 
      }else{
        data=super.mapData(); 
         data.datasets[0].backgroundColor=this.getColorData(data.labels); 
      }

        this.numberOfGroups = data.datasets.length; 
        return data; 

    }


    drawGroupLabels(chart) {
      let datasets = chart.data.datasets;
  
      let chartArea = chart.chartArea;

      //finding the center of the pie. 
      let centerX = (chartArea.left + chartArea.right) / 2;
      let centerY = (chartArea.top + chartArea.bottom) / 2;
  
      // Maximum radius
      let maxRadius = Math.max(...datasets.map(dataset => {
          let meta = chart.getDatasetMeta(datasets.indexOf(dataset));
          let firstNonHiddenArc = meta.data.find(arc => !arc.hidden);
          return firstNonHiddenArc ? firstNonHiddenArc.outerRadius : 0;
      })); 

  
      // Fixed end point for the horizontal lines
      let fixedEndX = chartArea.right + this.HORIZONTAL_OFFSET;
  
      this.drawGroupAnnotations(chart,datasets,centerX,centerY,fixedEndX); 
    }

    //draws lines and annotations of the group labels
    drawGroupAnnotations(chart,datasets,centerX,centerY,fixedEndX){
      datasets.forEach((dataset, i) => {
        let meta = chart.getDatasetMeta(i);
        let firstNonHiddenArc = meta.data.find(arc => !arc.hidden);

        if (!firstNonHiddenArc) return; // Skip if all data points are hidden

        let radius = firstNonHiddenArc.outerRadius; // Outer radius of the arc

        // Calculate start position at the top edge of the circle
        let startX = centerX;
        let startY = centerY - radius;

        // Calculate the endpoint of the angled line segment
        let angledEndX = startX + this.ANGLE_LENGTH * Math.cos(this.FIXED_ANGLE);
        let angledEndY = startY - this.ANGLE_LENGTH * Math.sin(this.FIXED_ANGLE);

        // Calculate the start position of the horizontal line
        let endX = fixedEndX - 200;
        let endY = angledEndY;

        DrawingService.drawLine(this.clx,'black',startX,startY,angledEndX,angledEndY);
        DrawingService.drawLine(this.clx,'black',angledEndX,angledEndY,endX,endY); 
        DrawingService.fillText(this.clx,'black','12px Arial','left',dataset.label,endX+5,endY)
    });

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

     /**
     * @override
     */
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

    //this is an extra plugins to add space between the legends and the graph so the lines of 
    //the groups anmes don't get in the way of the legends
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

     /**
     * @override
     */
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


}