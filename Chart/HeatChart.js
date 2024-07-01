import BaseChart from './BaseChart.js'; 

export default class HeatChart extends BaseChart {
   

    constructor(clx,fetchedData){
        super(clx,fetchedData);
    }

    getType(){
        return 'matrix';
    }

    isGrouped(){
        return false; 
    }

    mapData(){
        let that=this; //in order to access functions from this class. 
        let data = this.jsonData.Data;
        let vValues = this.jsonData.Data.map(item => item.v)
        let minValue = Math.min(...vValues); 
        let maxValue = Math.max(...vValues); 
        let numberOfXTicks = Math.max(...data.map(d => d.x)) + 1;
        let numberOfYTicks = Math.max(...data.map(d => d.y)) + 1;

        return {
            datasets: [{
                data: data,
                backgroundColor: function(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    return that.getColor(value,minValue,maxValue);
                },
                borderWidth: 0,
                width: function(context) {
                    const chartArea = context.chart.chartArea;
                    if (!chartArea) {
                        return 20; // Default width
                    }
                    return (chartArea.right - chartArea.left) / numberOfXTicks; 
                },
                height: function(context) {
                    const chartArea = context.chart.chartArea;
                    if (!chartArea) {
                        return 20; // Default height
                    }
                    return (chartArea.bottom - chartArea.top) / (numberOfYTicks - 1) ; 
                }
            }]
        }
    }

    getScales(){
        let xLabels = this.jsonData.xLabels; 
        let yLabels = this.jsonData.yLabels; 
        return {
            x:{
                beginAtZero:true,
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
                beginAtZero:true,
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
                left: 150,
                right: 150,
                top: 0,
                bottom: 50
            }
        }
    }

    getColor(value,min,max) {
        const opacity = ((value - min) / (max - min)) + 0.1;
        return `rgba(0, 0, 255, ${opacity})`;
    }

    getPlugin(){
        return {
            
        }
    }
}