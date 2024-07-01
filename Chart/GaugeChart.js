import DoughnutChart from './DoughnutChart.js'; 

export default class GaugeChart extends DoughnutChart {

    dataIndex; 

    constructor(clx,fetchedData,dataIndex){
       super(clx,fetchedData)
       this.dataIndex=dataIndex;
       this. grouped = false;  
       this.setConfig(); 
    }

    getTitle(){
        if(this.dataIndex>=0) {
            return this.jsonData.Data[this.dataIndex].Name; 
        }
    }

    mapData(){
        if(this.dataIndex>=0) {
        let data = {}
        data.datasets=[
            {
                data : this.jsonData.Data[this.dataIndex].Dataset,
                backgroundColor : this.jsonData.Data[this.dataIndex].ChartJS_Color,
                needleValue : this.jsonData.Data[this.dataIndex].Value,
            }
        ]
        data.datasets[0].circumference=180; 
        data.datasets[0].rotation=270; 
        data.datasets[0].cutout='80%'; 
        return data; 
      }else{
        return super.mapData(); 
      }
    }

    getLayout(){
        return {
            padding : {
                bottom : 20
            }
        }; 
    }

    setConfig(){
        this.config = {
            type : this.getType(),
            data:this.mapData(),
            options: this.getOptions(),
            plugins:[this.getGaugeNeedle(),this.getFlowMeter()]
        }
    }

    getOptions(){
        let options = super.getOptions(); 
        options.onClick = {}; 
        return options; 
    }

    getPlugins(){
        let plugins=super.getPlugins(); 
        plugins.legend.display=false; 
        plugins.title.font.size=20; 
        return plugins;
    }

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
                let orientation = ((chart.getDatasetMeta(0).data[0].circumference/Math.PI)/data.datasets[0].data[0])  * needleValue; 
                
                if(orientation>1){
                    orientation =1; 
                }else if(orientation<0){
                    orientation =0; 
                }


                ctx.save(); 
                ctx.translate(xCenter,yCenter); 
                ctx.rotate(Math.PI * (orientation - 1.5))

                //needle drawing

                ctx.beginPath(); 
                ctx.strokeStyle='grey';
                ctx.fillStyle='grey'; 
                ctx.moveTo(0-10  ,0);
                ctx.lineTo(0, innerRadius-5); 
                ctx.lineTo(0 + 10 , 0); 
                ctx.fill(); 
                ctx.stroke(); 

                //the circle 
                ctx.beginPath(); 
                ctx.arc(0, 0, 10, 0, 360 * Math.PI/180,false);
                ctx.fill(); 

                ctx.restore(); 
            

            }
        }

    }

    getFlowMeter(){

        let yAxisLabel = this.yAxisLabel; 
        return {
            id: 'gaugeFlowMeter',
            afterDatasetsDraw(chart, args, plugins){
                const {ctx, data } = chart; 
                ctx.save();
                let needleValue = data.datasets[0].needleValue;  
                let xCenter = chart.getDatasetMeta(0).data[0].x; 
                let yCenter = chart.getDatasetMeta(0).data[0].y;
                let orientation = ((chart.getDatasetMeta(0).data[0].circumference/Math.PI)/data.datasets[0].data[0])  * needleValue; 

                ctx.font ='bold 20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'black';
                ctx.fillText(needleValue,xCenter, yCenter+35); 
                ctx.fillText(yAxisLabel,xCenter, yCenter+55); 

            }


        }

    }

    getTooltip(){
    }

}