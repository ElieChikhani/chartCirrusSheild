import BaseChart from './BaseChart.js'; 

export default class MapChart extends BaseChart {

    countries; 

    constructor(clx,fetchedData,countries){
        super(clx,fetchedData); 
        this.countries = countries; 
        this.setConfig();  
    }

    getTitle(){
        return this.yAxisLabel+' mondialement'
    }

    getType(){
        return 'choropleth'
    }

    mapData(countries){
        let data= {
            labels: countries.map(country => country.properties.name),
            datasets: [{
               data:countries.map(country => ({feature : country, value : this.getValue(country.properties.name)
               })),

            }],
        }

        return data; 
    }  

    getValue(country) {
        let item = this.jsonData.Data.find(item => item.country == country);
        return item ? item.value : 0;
    }

    setConfig(){
        if(this.countries){
        let data = this.mapData(this.countries); 
        this.config = {
            type : this.getType(),
            data:data,
            options: this.getOptions(),
        } 
      }   

      console.log(this.config); 
    }
    
    getOptions(){
        let options=super.getOptions(); 
        options.showOutline=false; 
        options.showGraticule=false; 
        return options; 

    }

    getScales(){
        let barLabel = this.yAxisLabel; 
        return {
            projection: {
                axis: 'x',
                projection: 'equalEarth',
              },

              color :  {
                axis: 'x',
                legend: {
                  position: 'bottom-right',
                  align: 'right',
                },

                title : {
                    display : true, 
                    anchor : 'end', 
                    text : barLabel,
                    font: {
                        size: 11,  
                    },
                    color:'#001CA3 '
                }
            }
            
        }
    }

    isGrouped(){
        return false; 
    }

    updateGraticuleView(){
        this.chart.config.options.showOutline = ! this.chart.config.options.showOutline;
        this.chart.config.options.showGraticule = ! this.chart.config.options.showGraticule;
        this.chart.update(); 
    }

   
    

}