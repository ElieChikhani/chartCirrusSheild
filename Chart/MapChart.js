import BaseChart from './BaseChart.js'; 
export default class MapChart extends BaseChart {

    countries; //topo JSON File

    constructor(clx,fetchedData,countries){
        super(clx,fetchedData); 
        this.countries = countries; 
        this.setConfig();  
    }

     /**
     * @override
     */
    getTitle(){
        return this.yAxisLabel+' par '+ this.xAxisLabel
    }

     /**
     * @override
     */
    getType(){
        return 'choropleth'
    }

     /**
     * @override
     * 
     * all countries in the TopoJson file should be mentioned in the chart data. 
     */
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

    //searching for the value of the countrie in the data, if countrie not found, return 0.
    getValue(country) {
        let item = this.jsonData.Data.find(item => item.country == country);
        return item ? item.value : 0;
    }

     /**
     * @override
     */
    setConfig(){
        if(this.countries){
        let data = this.mapData(this.countries); 
        this.config = {
            type : this.getType(),
            data:data,
            options: this.getOptions(),
        } 
      }   
    }
    
     /**
     * @override
     */
    getOptions(){
        let options=super.getOptions(); 
        options.showOutline=false; 
        options.showGraticule=false; 
        return options; 

    }

     /**
     * @override
     */
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

     /**
     * @override
     */
    isGrouped(){
        return false; 
    }

    updateGraticuleView(){
        this.chart.config.options.showOutline = ! this.chart.config.options.showOutline;
        this.chart.config.options.showGraticule = ! this.chart.config.options.showGraticule;
        this.chart.update(); 
    }

    /**
     * @override
     */
    displayDynamicOptions(){
        document.getElementById('mapOptions').style.display = 'inline'; 
    }

   
}