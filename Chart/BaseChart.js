

export default class BaseChart {
    clx
    config
    chart 
    jsonData
    groupLabel
    xAxisLabel
    yAxisLabel
   
    

    constructor(clx,fetchedData){
        this.jsonData=fetchedData;
        this.clx = clx;
        this.setXAxisLabel();
        this.setYAxisLabel();
        this.setGroupLabel();
        this.grouped=this.isGrouped();  
        this.setConfig();
    }


    /**
     * Checks if the  data is grouped by checking if a group label has been passed form the jsonFile. 
     * @returns boolean
     */
    isGrouped(){
      return this.groupLabel ? true : false; //group label is a Field added to the JSONData  
    } 

    /**
     * Returns the type name supported by chart.js (too general to implement at this phase)
     * @returns string
     */
    getType(){
        throw new Error('Invalid type ! ')
    }

    getTitle(){
        return ' ';  
    }

    /**
     * Sets the geenral structure of the config of any chart
     */
    setConfig(){
        this.config = {
            type : this.getType(),
            data:this.mapData(),
            options: this.getOptions(),
        }
    }

    //retriving labels from the jsonData : 
    setXAxisLabel(){
        this.xAxisLabel=this.jsonData.DataChartXFieldLabel; 
    }

    setYAxisLabel(){
        this.yAxisLabel=this.jsonData.DataChartYFieldLabel;
    }

    //the group label is added (not in the original format of the json file)
    setGroupLabel(){
        this.groupLabel=this.jsonData.GroupedBy;
    }

  
    getOptions() {
        return {
            responsive:true,
            maintainAspectRatio: false, // to make it responsive with the size of the div containing the chart
            indexAxis:'x', 
            scales:this.getScales(),
            plugins:this.getPlugins(),
            layout:this.getLayout(),
            onClick: (event, elements) => {
              if (elements.length > 0) {
                  //scroll down and filter to the report
              } 
          }
        } 
      

    }

    getPlugins(){

        return {
        legend : {
            display : false 
        },

        title : {
            display : true,
            text:this.getTitle(),
            font: {
                size: 24, // Font size of the title
                weight: 'bold' // Font weight of the title
              },
              align: 'center', 
              justify:'end'
        },
    }
    }

    getScales(){
        return {
            x:{
              title : {
                display: true,
                text: this.xAxisLabel + (this.grouped?' groupé par '+this.groupLabel : '')
              }
              },
              y:{
                beginAtZero : true,
                title: {
                  display: true,
                  text: this.yAxisLabel
                }, 
      
              },
          }
    }

    /**
     * //the implementation of mapData (and all its overides) should be modidied when the JSONData is in correct format 
     * @returns array 
     */
    mapData(){ 
        return {
            labels: this.jsonData.Data.map(item => item.Name),
            datasets: [{
              data: this.jsonData.Data.map(item => item.Value),
            }],
          };
    }

    getLayout(){
        return {
          //no implmentation needed at this phase. 
        }
    }


    /**
     * Actions performed on all type of charts : 
     */


    //create a chart in chart.js, automatically draws it. 
    drawChart(){ 
        this.chart = new Chart(this.clx,this.config)
        this.displayDynamicOptions(); 
    }

    destroyChart(){
      this.chart.destroy(); 
    }

    displayDynamicOptions(){
      //implemented at later stages
    }

    update(){
      this.chart.update(); 
    }

    //used to switch axis
    updateIndexAxis(axis) {
      if (this.chart) {
        this.chart.config.options.indexAxis=axis; 

        //when the indexAxis is changed, the properties of the axes should also be switched. 
        let tempScales = this.chart.config.options.scales.x; 
        this.chart.config.options.scales.x=this.chart.config.options.scales.y; 
        this.chart.config.options.scales.y=tempScales; 
        this.update(); 
      }
    }

    //used to update the ticks of the scale (echelle)
    updateScale(newScale,axis){
      if (this.chart) {
        if(axis==='x'){ 
          this.chart.config.options.scales.x.ticks.stepSize=newScale;
        }else {
          this.chart.config.options.scales.y.ticks.stepSize=newScale;
        }

        this.update(); 
      }
    }


  
    // ----------------------- Data manipulation functions  -----------------------

    //Due to the "incorrect grouping" in the current JSON file, these methods groups the data correctly. 
     
    /**
     * @returns xData : Array (the list of all the xData)
     */
    getXElements(){ 
        let xData=[]; 
        this.jsonData.Data.forEach(function(item){ 
          let element = (item.Name).substring(0,(item.Name).indexOf('-')); //according to the current format Name =  xElement-Group
      
          if(!(xData.includes(element))){
            xData.push(element); 
          }
      }); 
      
      return xData; 
    }
    
    /**
     * @returns groupCategories : Array (the list of all groups)
     */
    getGroupedXValue(){ 
        let groupCategories=[]; 
        this.jsonData.Data.forEach(function(item){ 
      
          let group = (item.Name).substring((item.Name).indexOf('-')+1); 
          if(!(groupCategories.includes(group))){ 
            groupCategories.push(group); 
        }
      });
      
        return groupCategories; 
    }

    /**
     * @returns yData : Multidimensional Array :  yData for each group Category and xData in a multidimentional array 
     * (since the same xData can be found in many groups)
     */
    getGroupedYValue(groupCategory){ 
        let numberOfCategories=groupCategory.length; 
        let yData=[]; 
      
        for(let i=0; i<numberOfCategories; i++){
          if(typeof yData[i]!=='object'){
            yData[i]=[];
          }
      
          this.jsonData.Data.forEach(function(item){
            if((item.Name).substring(item.Name.indexOf('-')+1)===groupCategory[i]){
              yData[i].push(item.Value);
            }
          })
      
        
        } 
      
        return yData; 
      
    }

    /**
     * @returns colorData : Array - Array of colors for each group (in case of grouping) or each xData if available (picklist)
     * it returns an empty array if no color is chosen by the user (chart.js will choose random colors when given an empty array)
     */
    getColorData(coloredData){
      let grouped=this.grouped; 
      let colorData=[]; 
      if(!this.jsonData.Data[0].ChartJS_Color){
        return colorData;  
      }else{
      colorData.length=coloredData.length; 
      this.jsonData.Data.forEach(function(item){
        if(!colorData.includes(item.ChartJS_Color)){
            //the color data should be in the same order of the colored data (group or xValue)
            if(grouped){
            colorData[coloredData.indexOf(item.Name.substring(0,item.Name.indexOf('-')))]=item.ChartJS_Color; 
            }else{
            colorData[coloredData.indexOf(item.Name)]=item.ChartJS_Color; 
            }
        }
      })
     
      return colorData; 
      }
    }

}