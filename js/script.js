var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var NTAleaflet = {};


var map = L.map('myMap',{tap:false}).setView( [40.731649,-73.924255], 10);
map.addLayer(layer);

var rentData = [];
rentData[0]={};
var currid=0;
var med=0;
var currNTAname;
    

var chart;
var chart2;

var manhattan = [40.763121,-73.948288];
var brooklyn = [40.637925,-73.948288];
var bronx = [40.841606, -73.874817];
var queens = [40.716298,-73.853874];
var statenisland = [40.571719,-74.148788];

var panOptions = {
    animate: true,
    duration: 2
 	}

      $(".myButton").click(function() {
      if($(this).attr('id') == 'one' ) {
        map.panTo(manhattan, panOptions);
      } 
      
      else if 
      ($(this).attr('id') == 'two' ) {
        $(this).css('background-color','#fff');
        map.panTo(brooklyn, panOptions);
      } 

      else if 
      ($(this).attr('id') == 'three' ) {
        $(this).css('background-color','#fff');
        map.panTo(bronx, panOptions);
      } 

      else if 
      ($(this).attr('id') == 'four' ) {
        $(this).css('background-color','#fff');
        map.panTo(queens, panOptions);
      } 

      else {
        $(this).css('background-color','#fff');
        map.panTo(statenisland, panOptions);
      }
    });
      
// function onEachFeature(feature, layer) {
//     // does this feature have a property named popupContent?
//     if (feature.properties && feature.properties.popupContent) {
//         layer.bindPopup(feature.properties.popupContent);
//     }
// }

  $("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
    });


  var geojson;

  $.getJSON('data/cfa.geojson', function(data) {
    geojson = L.geoJson(data, {
    	style: style,
    	onEachFeature: onEachFeature
    }).addTo(map);
    updateChart(data.features[currid].properties);
    updateChart2(data.features[currid].properties);
    //updateChart3(prop.NTAName)

  });


  function getColor(d) {

    return d > 10000000 ? '#444' :
           d > 8000000  ? '#444' :
           d > 6000000  ? '#444' :
           d > 3000000  ? '#444' :
           d > 800000  ? '#444' :
           d > 500000  ? '#444' :
           d > 200000  ? '#444' :
                     '#444' ;





     // return d > 10000000 ? '#900410' :
     //       d > 8000000  ? '#BD0026' :
     //       d > 6000000  ? '#E31A1C' :
     //       d > 3000000  ? '#FC4E2A' :
     //       d > 800000  ? '#FD8D3C' :
     //       d > 500000  ? '#FEB24C' :
     //       d > 200000  ? '#FED976' :
     //                 '#FFEDA0' ;
  }


  function style(feature) {
    return {
        fillColor: getColor(feature.properties.ALLOCATED_FUNDS),
        weight: .6,
        opacity: 1,
        color: '#fff',
        dashArray: '0',
        fillOpacity: 0.9
    };
  }

  function highlightNTA(leafletid){
    var layer = geojson._layers[leafletid];
    layer.setStyle({
        weight: 5,
        opacity: 0.5,
        color: '#FFF000',
        dashArray: '',
        fillOpacity: 0.7
    });
    updateChart(layer.feature.properties);
    updateChart2(layer.feature.properties);
    $('#side2').html('<h3>' + layer.feature.properties.NTAName + ' ' + layer.feature.properties.ntacode + '</h3>');
   


  }

  function resetHighlightNTA(leafletid) {
    geojson.resetStyle(geojson._layers[leafletid]);
  }

  function mouseoverFunction(e) {
    var layer = e.target;
    //console.log(layer);
    // med value
    //med = e.target.feature.properties.median_income;
    //console.log(med);


    layer.setStyle({
        weight: 5,
        opacity: 0.5,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    // try updatechart
    updateChart(e.target.feature.properties);
    updateChart2(e.target.feature.properties);
    //updateChart3(e.target.this.series.xAxis.categories);

    currNTAname = e.target.feature.properties.NTAName;
    console.log(currNTAname);

    // console.log(layer.feature.properties.VALUE2);
    $('#side').html('<h3>' + layer.feature.properties.NTAName + ' ' + layer.feature.properties.ntacode +'</h3>' + '<h4>' + 'Total Population' + '</h4>');
  	

    $('#side2').html('<h3>' + layer.feature.properties.NTAName + ' ' + layer.feature.properties.ntacode + '</h3>');}
   

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function onEachFeature(feature, layer) {
    NTAleaflet[feature.properties.NTAName] = layer._leaflet_id;
    //console.log(feature);
    //console.log(layer);
    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight
        //click: zoomToFeature
    });
  }

// subway stations
// $.getJSON('data/subwaystop.geojson', function(data2) {
//   // console.log(data);

// var subwaystations = {
//     radius: 2,
//     fillColor: "green",
//     color: "#fff",
//     weight: .5,
//     opacity: 1,
//     fillOpacity: 01,
    
// };

// L.geoJson(data2, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, subwaystations);
//     }
// }).addTo(map);
// });

//dropdown scroll
  $(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  });


//bar chart
nv.addGraph(function() {
  chart = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .showValues(true)
    .margin({left:0,right:0})

    .color(['rgb(189, 195, 199)','rgb(166, 172, 175)','rgb(144, 148, 151)','rgb(121, 125, 127)'])

    // .color(['rgb(131, 153, 173)','rgb(87, 117, 143)','rgb(32, 65, 95)','rgb(12, 41, 67)'])

    .valueFormat(function(d){
        return Math.round(d * 10)/10;
      });
    ;

  nv.utils.windowResize(chart.update);

  return chart;
});


//Each bar represents a single discrete quantity.
function updateChart(f){

  rentData[0].key = "vacancyrent";
  rentData[0].values =
    [
        { 
          "label" : "Total Population 2000" , 
          "value" : f.pop2000
        } , 
        { 
          "label" : "Total Population 2010" , 
          "value" : f.pop2010
        } ,
         { 
          "label" : "Projected Population 2020" , 
          "value" : f.pop2000*1.15
        },
        { 
          "label" : "Projected Population 2030" , 
          "value" : f.pop2010*1.3
        } 
      ]
    d3.select('#chart svg')
    .datum(rentData)
    .transition().duration(500)
    .call(chart);
  
}


nv.addGraph(function() {
  chart2 = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .showValues(true)
    .margin({left:0,right:0})

    .color(['rgb(189, 195, 199)','rgb(166, 172, 175)','rgb(144, 148, 151)','rgb(121, 125, 127)'])

    // .color(['rgb(131, 153, 173)','rgb(87, 117, 143)','rgb(32, 65, 95)','rgb(12, 41, 67)'])

    .valueFormat(function(d){
        return Math.round(d * 10)/10;
      });
    ;

  nv.utils.windowResize(chart2.update);

  return chart2;
});


//Each bar represents a single discrete quantity.
function updateChart2(f2){

  rentData[0].key = "vacancyrent";
  rentData[0].values =
    [
        { 
          "label" : "Child (<5)" , 
          "value" : f2.Child5
        } , 
        { 
          "label" : "Youth (5-19)" , 
          "value" : f2.Youth5_19
        } ,
         { 
          "label" : "Adult (20-60)" , 
          "value" : f2.Adult20_60
        },
        { 
          "label" : "Senior (>60)" , 
          "value" : f2.Senior60
        } 
      ]
    d3.select('#chart2 svg')
    .datum(rentData)
    .transition().duration(0)
    .call(chart2);
  
}



//bulletchart
// nv.addGraph(function() {  
//   var chart2 = nv.models.bulletChart();

//   d3.select('#chart2 svg')
//       .datum(exampleData())
//       .transition().duration(1000)
//       .call(chart2);

//   return chart2;
// });


// function exampleData() {
//   return {
//     "title":"Revenue",    //Label the bullet chart
//     "subtitle":"US$",   //sub-label for bullet chart
//     "ranges":[150,225,300],  //Minimum, mean and maximum values.
//     "measures":[220],    //Value representing current measurement (the thick blue line in the example)
//     "markers":[250]      //Place a marker on the chart (the white triangle marker)
//   };
// }


