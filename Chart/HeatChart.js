import DrawingService from '../Services/DrawingService.js';
import BaseChart from './BaseChart.js'; 

export default class HeatChart extends BaseChart {


    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'matrix';
    }

    getTitle(){
        return this.jsonData.valueLabel+' par '+this.jsonData.rowLabel+' et '+this.jsonData.columnLabel; 
    }

    isGrouped(){
        return false; 
    }

    mapData(){
        let data = this.jsonData.Data;
        let vValues = this.jsonData.Data.map(item => item.v)
        let minValue=Math.min(...vValues);
        let maxValue=Math.max(...vValues);
        this.setMinMaxValues(minValue,maxValue); 
        let numberOfXTicks = Math.max(...data.map(d => d.x)) + 1;
        let numberOfYTicks = Math.max(...data.map(d => d.y)) + 1;
        let that=this; //in order to access functions from this class. 

        return {
            datasets: [{
                data: data,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    return that.getColor(value,minValue,maxValue);
                },
                borderWidth: 0,
                width: function(context) {
                    let chartArea = context.chart.chartArea;
                    if (!chartArea) {
                        return 20; // Default width
                    }
                    return (chartArea.right - chartArea.left) / (numberOfXTicks-1); 
                },
                height: function(context) {
                    let chartArea = context.chart.chartArea;
                    if (!chartArea) {
                        return 20; // Default height
                    }
                    return (chartArea.bottom - chartArea.top) / (numberOfYTicks-1)  ; 
                }
            }]
        }
    }

    setMinMaxValues(minValue,maxValue){
        this.minValue=minValue; 
        this.maxValue=maxValue;
    }

    setConfig(){
        super.setConfig();
        this.config.plugins=[this.createColorBarPluginExtension()]
    }

    getScales(){
        let xLabels = this.jsonData.rows; 
        let yLabels = this.jsonData.columns; 
        return {
            x:{
                title:{
                display:true,
                text:this.jsonData.rowLabel,
                },
                position:'top',
                ticks : {
                    stepSize:1,
                    callback: function(value) {
                        return xLabels[value-1] ? xLabels[value-1] : ' ';
                    }
                },
                grid : {
                    display : false
                }

            },

            y: {
                offset:true,
                title:{
                    display:true,
                    text:this.jsonData.columnLabel,
                },
                ticks : {
                    stepSize:1,
                    callback: function(value) {
                        return yLabels[value-1] ? yLabels[value-1] : ' ';
                    }
                },
                grid : {
                    display : false
                }
            }
        }
    }

    getLayout(){
        return {
            padding: {
                left: 50,
                right: 100,
                top: 0,
                bottom: 50
            }
        }
    }

    getPlugins(){
        let that=this;
        let plugins=super.getPlugins(); 
        plugins.tooltip = {
                callbacks: {
                    label: function(context) {
                        return context.raw.v;
                    },

                    title : function(context) {
                        return that.jsonData.valueLabel; 
                    }
                }
        };

        return plugins;    
    }

    getColor(value,min,max) {
        const opacity = ((value - min) / (max - min)) + 0.1;
        return `rgba(0, 0, 255, ${opacity})`;
    }

    //in a heat chart, the color bar should be created manually 
    createColorBarPluginExtension(){
    return {
        id: 'colorBarPlugin',
        afterDraw: (chart) => {
        let {ctx, chartArea} = chart;
        let barWidth = 10;
        let barHeight = (chartArea.bottom - chartArea.top) * 0.25; // 25% of the chart height
        let margin = 20; // Define the margin between the chart and the color bar

        let gradient = ctx.createLinearGradient(0, chartArea.bottom - barHeight, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(chartArea.right + margin, chartArea.bottom - barHeight, barWidth, barHeight);

        ctx.restore();

        this.fillBarValues(chartArea,barWidth,barHeight,margin,ctx); 
        }

       } 
    }

    fillBarValues(chartArea,barWidth,barHeight,margin,ctx){

        let topValue = this.maxValue;
        let bottomValue = this.minValue;
        let centerValue = Math.floor((topValue - bottomValue)/2);
        let title=this.jsonData.valueLabel;

        // Top value
        DrawingService.fillText(ctx,'black','Arial 12px','Left',topValue, chartArea.right + margin + barWidth + 5, chartArea.bottom - barHeight);

        // Center value
        DrawingService.fillText(ctx,'black','Arial 12px','Left',centerValue, chartArea.right + margin + barWidth + 5, chartArea.bottom - barHeight / 2);

        // Bottom value
        DrawingService.fillText(ctx,'black','Arial 12px','Left',bottomValue, chartArea.right + margin + barWidth + 5, chartArea.bottom);
        
        // Vertical title
        ctx.save();
        ctx.translate(chartArea.right + margin + barWidth + 35, chartArea.bottom - barHeight / 2);
        ctx.rotate(Math.PI / 2);
        DrawingService.fillText(ctx,'blue','Arial 12px','center',title, 0, 0);
        ctx.restore(); 

    }

    
   
}