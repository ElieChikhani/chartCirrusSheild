import DoughnutChart from './DoughnutChart.js'; 
import DrawingService from '../Services/DrawingService.js'

export default class GaugeChart extends DoughnutChart {

    constructor(clx,fetchedData){
       super(clx,fetchedData)
    }

     /**
     * @override
     */
    getTitle(){
        return this.jsonData.Name; 
    }

     /**
     * @override
     */
    mapData(){
        let data = {}
        data.datasets=[
            {
                data : this.jsonData.Dataset,
                backgroundColor : this.jsonData.ChartJS_Color,
                needleValue : this.jsonData.Value,
            }
        ]
        data.datasets[0].circumference=180; 
        data.datasets[0].rotation=270; 
        data.datasets[0].cutout='80%'; 
        return data; 
    }

     /**
     * @override
     */
    getLayout(){
        return {
            padding : {
                bottom : 20
            }
        }; 
    }

     /**
     * @override
     */
    setConfig(){
        this.config = {
            type : this.getType(),
            data:this.mapData(),
            options: this.getOptions(),
            plugins:[this.getGaugeNeedle(),this.getFlowMeter()] //adding the extrnal plugins
        }
    }

     /**
     * @override
     */
    getOptions(){
        let options = super.getOptions(); 
        options.onClick = {}; 
        return options; 
    }

     /**
     * @override
     */
    getPlugins(){
        let plugins=super.getPlugins(); 
        plugins.legend.display=false; 
        plugins.title.font.size=20; 
        return plugins;
    }

    //external plugins : 


    //drawing the needle
    getGaugeNeedle(){
        return {
            id: 'gaugeNeedle',
            afterDatasetsDraw(chart, args, plugins){
                const {ctx, data } = chart; 
                let xCenter = chart.getDatasetMeta(0).data[0].x; 
                let yCenter = chart.getDatasetMeta(0).data[0].y;
                let outerRadius = chart.getDatasetMeta(0).data[0].outerRadius; 
                let innerRadius = chart.getDatasetMeta(0).data[0].innerRadius; 
                let needleValue = data.datasets[0].needleValue; 
                let dataTotal = data.datasets[0].data.reduce((a,b)=> a+b,0); 

                //mathematical calcultaion to get the orientation of the needle (angle with x axis) :
                let orientation = ((chart.getDatasetMeta(0).data[0].circumference/Math.PI)/data.datasets[0].data[0])  * needleValue; 
                
                if(orientation>1){
                    orientation =1; 
                }else if(orientation<0){
                    orientation =0; 
                }

                ctx.save(); 
                ctx.translate(xCenter,yCenter); 
                ctx.rotate(Math.PI * (orientation - 1.5))

               DrawingService.drawNeedle(ctx,'grey',0,0,innerRadius-5); 
            }
        }
    }

    
    getFlowMeter(){
        return {
            id: 'gaugeFlowMeter',
            afterDatasetsDraw(chart, args, plugins){
                const {ctx, data } = chart; 
                ctx.save();
                let needleValue = data.datasets[0].needleValue;  
                let xCenter = chart.getDatasetMeta(0).data[0].x; 
                let yCenter = chart.getDatasetMeta(0).data[0].y;

                DrawingService.fillText(ctx,'black','bold 20px sans-serif','center',needleValue,xCenter,yCenter+35);
            }
        }
    }
}