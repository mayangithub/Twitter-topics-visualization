var statesInfo;

var mapGraphic;
var lineChartGraphic;
var barChartGraphic;
var pieChartGraphic;
var forceChartGraphic;

var mapData;
var tagsData;
var nodeData;
//blue series
var mainStartColor = '#F6FBFE';
var mainSecondColor = '#55ACEE';
var mainMiddleColor = '#053A6C'
var mainEndColor = '#00223E';

//pie chart color
var pieStartColor = '#CAD199';
var pieEndColor = '#5CABA4';

var pieFirstColor = '#CAD199';
var pieSecondColor = '#FD8D3C'; //
var pieFourthColor = '#65A3C5';
var pieThirdColor = '#E7BF4E'; //blue
var pieFifthColor = '#A2BD5E';

var dateRange = ['11/21','11/22','11/23','11/24','11/25','11/26','11/27','11/28','11/29','11/30','12/1','12/2','12/3','12/4','12/5','12/6'];

var selectedDate;
var selectedState;
var selectedTag;
var centered;


var hoveredState;
var hoveredDate;
var hoveredTag;

var stopWord = 'thanksgiving';
var defaultState = 'United State';
var defaultDate = '11/21 ~ 12/6';



$(document).ready(function(){

  $('#play').click(function(e){
    e.preventDefault();
    $('#cover').hide(1000,function(){
      $('body').css('overflow','auto');
      $('body').css('padding','30px 0');
    })

  })

  setTimeout(function(){
    $('#play').css('visibility','visible');
    $('#loading').css('opacity','0');
  },3000)

  jQuery.fn.d3Trigger = function (event) {
    this.each(function (i, e) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(event, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

      e.dispatchEvent(evt);
    });
  };
  generatePalette()

  //load data
  d3.json("javascripts/tweets.json", function(error, d) {
    d3.tsv("javascripts/us-state-names.tsv", function(error, infos){
      d3.json("javascripts/nodelink.json",function(error,graph){

        statesInfo = convertStateInfo(infos);
        mapData = dehydrate(d);
        tagsData = tagDehydrate(d);
        nodeData = graph;
        makeMap();
        makeBarChart();
        makePieChart();
        makeForceLayout(graph,1/6);
        // makeLineChart();
        // setTimeout(function(){
          // animationSerial();    
        // },1000) 

      })

 

    }) //tsv end
  }) //json end

  switchEvent('map','on');
  switchEvent('date','on');
  switchEvent('bar','on');
  //date
  $('.date').on('click',function(e){
    e.preventDefault();
    if ($(this).hasClass('selected')) {
      //remove select
      selectedDate = null;
      $(this).removeClass('selected');
      switchEvent('date','on');
      //remove disabled state;
      // $('[data-state].disabled').removeClass('disabled');
      d3.selectAll('[data-state].disabled').classed('disabled',false);

      if (selectedState) {
        makeForceLayout(changeForce(null,selectedState));
      } else {
        makeForceLayout(nodeData,1/6);
      }

    } else {
      //add select
      selectedDate = $(this).text();
      switchEvent('date','on');
      $(this).trigger('mouseover');
      $('.date.selected').removeClass('selected');
      d3.select('[data-state].sign').classed('selected',true).classed('sign',false);
      $(this).addClass('selected');
      switchEvent('date','off');

      //add disabled
      // $('[data-state].disabled').addClass('disabled');
      d3.selectAll('[data-state].disabled').classed('disabled',false);
      for(var stateId in mapData){
        if (mapData[stateId].stateName) {
          var tags = generateTags(selectedDate,stateId);
          if (tags.length < 10) {
            d3.selectAll('[data-state="'+stateId+'"]').classed('disabled',true);
          }
        }
      }
      makeForceLayout(changeForce(selectedDate,selectedState));
      $('#force-layout').css('opacity','1');
    }

  })

  //bar



  //bar click
  // $('#bar-chart').on('click','rect',function(){

  //   var tag = $(this).attr('name');

  //   if (d3.selectAll('#bar-chart rect[name="'+tag+'"].selected')[0].length > 0) {
  //     //remove
  //     d3.selectAll('#bar-chart rect[name="'+tag+'"]').classed('selected',false);
  //     switchEvent('bar','on');
  //     switchEvent('map','on');
  //     switchEvent('date','on');

  //   } else {
  //     $(this).trigger('mouseout');
  //     d3.selectAll('#bar-chart rect').classed('selected',false);
  //     d3.selectAll('#bar-chart rect[name="'+tag+'"]').classed('selected',true);
  //     $(this).trigger('mouseover');
  //     switchEvent('bar','off');
  //     switchEvent('map','off');
  //     switchEvent('date','off');
  //   }


  // })



})




function switchEvent(which,status){

  if (which == 'map') {
    if (status == 'on') {
      //activate map event
      $('#main-map').on('mouseover','[data-state]',function(e){
        e.preventDefault();
        var id = $(this).attr('data-state');
        // alert(id);
        // changeMap(selectedDate,selectedTag);
        if (d3.selectAll('[data-state="'+id+'"].disabled')[0].length == 0)
          changeBar(selectedDate,id);          
        changePie(selectedDate,id);
        $('#force-layout').css('opacity','.2');
      })

      $('#main-map').on('mouseout','[data-state]',function(e){
        e.preventDefault();
        var id = $(this).attr('data-state');
        // changeMap(selectedDate,selectedTag);
        if (d3.selectAll('[data-state="'+id+'"].disabled')[0].length == 0)
          changeBar(selectedDate,null);
        changePie(selectedDate,null);
        $('#force-layout').css('opacity','1');
      })      
    } else {
      $('#main-map').off('mouseover','[data-state]');
      $('#main-map').off('mouseout','[data-state]');
    }

  }

  if (which == 'date') {
    if (status == "on") {
      $('.date').on('mouseover',function(e){
        e.preventDefault();
        d3.select('[data-state].selected').classed('selected',false).classed('sign',true);
        var date = $(this).text();
        changeMap(date,selectedTag);
        changeBar(date,selectedState);
        changePie(date,selectedState);
        $('#force-layout').css('opacity','.2');

      })

      $('.date').on('mouseout',function(e){
        e.preventDefault();
        d3.select('[data-state].sign').classed('selected',true).classed('sign',false);
        changeMap(null,selectedTag);
        changeBar(null,selectedState);
        changePie(null,selectedState);
        $('#force-layout').css('opacity','1');
      }) 
    } else {
      $('.date').off('mouseout')
      $('.date').off('mouseover')
    }
   
  }

  if (which == 'bar') {
    if (status == 'on') {
      $('#bar-chart').on('mouseover','rect',function(){

        var tag = $(this).attr('name');
        d3.select('[data-state].selected').classed('selected',false).classed('sign',true);
        d3.selectAll('[data-state].disabled').classed('disabled',false).classed('dissign',true);
        changeMap(selectedDate,tag);
        //hide other
        $('.container').find('.row,#meta-info p,#color-info,#pie-chart').addClass('temp-transparent');

        $('#force-layout [data-node="'+tag+'"]').d3Trigger('mouseover');
      })
      $('#bar-chart').on('mouseout','rect',function(){
        var tag = $(this).attr('name');
        changeMap(selectedDate,null);
        d3.select('[data-state].sign').classed('sign',false).classed('selected',true);
        d3.selectAll('[data-state].dissign').classed('dissign',false).classed('disabled',true);
        $('.temp-transparent').removeClass('temp-transparent');

        $('#force-layout [data-node="'+tag+'"]').d3Trigger('mouseout');
      })      

    } else {
      $('#bar-chart').off('mouseout','rect')
      $('#bar-chart').off('mouseover','rect')      
    }


  }



}


function convertStateInfo(infos) {

  var obj = {};
  infos.forEach(function(info){
    obj[info.id] = {};
    obj[info.id].name = info.name;
    obj[info.id].code = info.code;
  })
  return obj;

}





function makeMap() {
  // var width = 960,
  //     height = 500;
  var width = 600;
  var height = 420;

  var projection = d3.geo.albersUsa()
      // .scale(1070)
      .scale(800)
      .translate([width / 2, height / 2]);

  window.path = d3.geo.path()
      .projection(projection);

  var convertArray = [];
  for(var key in mapData) {
    if (mapData[key].count) {
      convertArray.push(mapData[key].count)
    }
  }
  var max = d3.max(convertArray);

  var colors = generateColorFn(mainStartColor,mainEndColor,max);

  var svg = d3.select("#main-map").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", mapClicked);

  mapGraphic = svg.append("g");

  d3.json("javascripts/us.json", function(error, us) {
    mapGraphic.append("g")
        .attr("id", "states")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path)
        .attr("data-state", function(d){
          return d.id
        })
        .attr('fill',function(d){
          var count = mapData[d.id]['count'];
          return colors(count);
        })
        .on("click", mapClicked);

    // mapGraphic.selectAll("text")
    //   .data(topojson.feature(us, us.objects.states).features)
    //   .enter()
    //   .append("svg:text")
    //       .text(function(d){
    //         return mapData[d.id]['stateName'];
    //       })
    //       .attr("x", function(d){
    //         var x = path.centroid(d)[0]
    //         if (isNaN(x)) {
    //           return 99999;
    //         } else {
    //           return x;              
    //         }

    //       })
    //       .attr("y", function(d){
    //         var y = path.centroid(d)[1];
    //         if (isNaN(y)) {
    //           return 99999;
    //         } else {
    //           return y;              
    //         }
    //       })
    //       .attr()
    //       .attr("text-anchor","middle")
    //       .attr('font-size','8px')

    //us border
    mapGraphic.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);
  });
}



// function mapClicked(d) {
//   var x, y, k;
//   var width = 960,
//       height = 500;
//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = centroid[0];
//     y = centroid[1];
//     k = 4;
//     centered = d;
//   } else {
//     x = width / 2;
//     y = height / 2;
//     k = 1;
//     centered = null;
//   }

//   mapGraphic.selectAll("path")
//       .classed("active", centered && function(d) { return d === centered; });

//   mapGraphic.transition()
//       .duration(1000).ease('linear')
//       .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
//       .style("stroke-width", 1.5 / k + "px");

// }


function mapClicked(d) {

  if (d3.selectAll('[data-state="'+d.id+'"].disabled')[0].length == 0) {
    if (selectedState != d.id) {
      //selected
      switchEvent('map','on');
      $('[data-state="'+d.id+'"]').trigger('mouseover');
      selectedState = d.id;
      switchEvent('map','off');

      d3.selectAll('.date.date-disabled').classed('date-disabled',false);
      var target = mapData.total.dates;

      makeForceLayout(changeForce(selectedDate,d.id));

      for(var date in target){
        var tags = generateTags(date,d.id);
        if (tags.length < 10) {
          d3.selectAll('[data-date="'+date+'"]').classed('date-disabled',true);
        }
      }
      $('#force-layout').css('opacity','1');
    } else {
      //remove selected
      selectedState = null;
      switchEvent('map','on');
      d3.selectAll('.date.date-disabled').classed('date-disabled',false);
      if (selectedDate) {
        makeForceLayout(changeForce(selectedDate,null));
      } else {
        makeForceLayout(nodeData,1/6);
      }

    }
    mapGraphic.selectAll("path")
        .classed("selected", selectedState && function(d) { return d.id === selectedState; }); 



  }


}






function dehydrate(data) {

  var obj = {};
  obj.total = {};
  obj.total.dates = {};

  for(var i=0;i<data.length;i++){
    var tweet = data[i];
    obj[tweet.stateId] = obj[tweet.stateId] || {};

    obj[tweet.stateId].count = ++obj[tweet.stateId].count || 1;
    obj[tweet.stateId].stateName = tweet.actualLoc;
    obj[tweet.stateId].dates = obj[tweet.stateId].dates || {};
    var date = new Date(tweet.created_at);
    var formatDate = (date.getUTCMonth()+1)+'/'+date.getUTCDate();
    obj[tweet.stateId]['dates'][formatDate] = ++obj[tweet.stateId]['dates'][formatDate] || 1;   

    obj.total.dates[formatDate] = obj.total.dates[formatDate] || {};
    obj.total.dates[formatDate] = ++obj.total.dates[formatDate] || 1;
    obj.total.tags = obj.total.tags || {};
    obj.total.tags[formatDate] = obj.total.tags[formatDate] || {};

    //tags
    obj[tweet.stateId]['tags'] = obj[tweet.stateId]['tags'] || {};
    obj[tweet.stateId]['tags'][formatDate] = obj[tweet.stateId]['tags'][formatDate] || {};

    tweet.hashtags.forEach(function(d){
      var tag = d.toLowerCase();
      obj[tweet.stateId]['tags'][formatDate][tag] = ++obj[tweet.stateId]['tags'][formatDate][tag] || 1;
      obj.total.tags[formatDate][tag] = ++obj.total.tags[formatDate][tag] || 1;
    })


  }
  console.log(obj);
  return obj;
}


function tagDehydrate(data) {

  var obj = {};
  for(var i=0;i<data.length;i++){
    var tweet = data[i];
    obj[tweet.stateId] = obj[tweet.stateId] || {};

    obj[tweet.stateId] = obj[tweet.stateId] || {};
    var date = new Date(tweet.created_at);
    var formatDate = (date.getUTCMonth()+1)+'/'+date.getUTCDate();
    obj[tweet.stateId][formatDate] = obj[tweet.stateId][formatDate] || [];  
    var hashs =  tweet.hashtags.map(function(d){return d.toLowerCase()});
    obj[tweet.stateId][formatDate].push(hashs);

  }

  return obj;

}



function generateColorFn(start, end, max, type) {

  // console.log(max);

  var colors = d3.scale.linear()
    .domain([0,max*(1/3),max*(2/3),max]).range([start,mainSecondColor,mainMiddleColor,end]);

  return colors;


}

function generateColorFn2(domain, range) {
  var colors = d3.scale.linear()
    .domain(domain).range(range);

  return colors;  
}


function changeMap(date,tag) {
  if (date) {
    hoveredDate = date;
    if (!tag) {
      hoveredTag = null;
      //has date, no tag
      var arr = [];
      var total = 0;
      mapGraphic.selectAll('path')
        .classed('namespace',function(d){
          if (d.id) {
            var num = singleDayCount(date, d.id);
            arr.push(num); 
            total += num;    
          }
          return false;
        });
      var max = d3.max(arr);
      var colors = generateColorFn(mainStartColor,mainEndColor,max); 
      mapGraphic.selectAll('path')
        .transition().duration(500)
        .attr('fill',function(d){
            if (d.id) {
              // if (mapData[d.id]['dates'][date]) {
              //   var count = mapData[d.id]['dates'][date]; 
              // } else {
              //   var count = 0;
              // }
              var count = singleDayCount(date, d.id);
              return colors(count);
            }

        })
    } else {
      //has date, has tag
      hoveredTag = tag;

      var target = {};
      var arr = [];
      var stateArr = [];
      var total = 0;

      target = mapData.total.tags[date] || {};

      for(var key in target) {
        var num = target[key];
        if (key != stopWord) {
          arr.push(num);   
          total += num;        
        }    
      }
      var max = d3.max(arr);

      var actualMax;
      for(var k in mapData) {
        if (mapData[k].stateName) {
          var temp = mapData[k].tags[date] || {};
          var c = temp[tag] || 0;
          stateArr.push(c);
        }
      }
      var actualMax = d3.max(stateArr);
      // console.log('total',max);
      // console.log('max',actualMax);      
      var colors = generateColorFn2([0,actualMax*(2/3),actualMax,max],[mainStartColor,mainSecondColor,mainMiddleColor,mainEndColor]); 
      // var colors = generateColorFn(mainStartColor,mainEndColor,max);

      mapGraphic.selectAll('path')
        .transition().duration(500)
        .attr('fill',function(d){
            if (d.id) {
              var tags = mapData[d.id].tags[date] || {};
              var count = tags[tag] || 0;
              // console.log(d.id, count);
              return colors(count);
            }

        })
    }
    

  } else {
    hoveredDate = null;

    if (!tag) {
      //no date, no tag
      hoveredTag = null;
      var convertArray = [];
      for(var key in mapData) {
        if (mapData[key].count) {
          convertArray.push(mapData[key].count)
        }
      }
      var max = d3.max(convertArray);
      var colors = generateColorFn(mainStartColor,mainEndColor,max);

      mapGraphic.selectAll('path')
        .transition().duration(500).ease('linear')
        .attr('fill',function(d){
          if (d.id) {
            var count = mapData[d.id]['count'];
            return colors(count);
          }
        })

    } else {
      //no date, has tag
      hoveredTag = tag;

      var obj = {};
      var arr = [];
      var stateArr = [];
      var total = 0;

      var target = mapData.total.tags;

      for(var key in target) {
        var tags = target[key];
        total += tags[tag] || 0;           
      }
      // for(var k in obj){
      //   if (k != stopWord)
      //     arr.push(obj[k]);
      // }
      var max = total;

      var actualMax;
      for(var k in mapData) {
        if (mapData[k].stateName) {
          var temp = mapData[k].tags;
          var c = 0;
          for(var t in temp) {
            var num = temp[t][tag] || 0
            c +=num ;            
          }
          stateArr.push(c);
        }
      }
      var actualMax = d3.max(stateArr);
      // console.log('total',max);
      // console.log('max',actualMax); 


      var colors = generateColorFn2([0,actualMax*(2/3),actualMax,max],[mainStartColor,mainSecondColor,mainMiddleColor,mainEndColor]);
      // var colors = generateColorFn(mainStartColor,mainEndColor,max); 

      mapGraphic.selectAll('path')
        .transition().duration(500)
        .attr('fill',function(d){
            if (d.id) {
              var stateTags = {};
              var target = mapData[d.id].tags;
              var count = 0;
              for(var key in target) {
                var tags = target[key];
                // for(var k in tags){
                //   stateTags[k] = ++stateTags[k] || 1;
                // }
                count += tags[tag] || 0;
              }
              return colors(count);
            }

        })



    }
    
  }
}


function makeLineChart(){

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%m/%e").parse;
  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(parseDate(d)); })
      .y(function(d) { return y(mapData.total.dates[d].count); });

  lineChartGraphic = d3.select("#line-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(d3.extent(dateRange, function(d) { return parseDate(d); }));
    y.domain(d3.extent(dateRange, function(d) { return mapData.total.dates[d].count }));

    lineChartGraphic.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    lineChartGraphic.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    lineChartGraphic.append("path")
        .datum(dateRange)
        .attr("class", "line")
        .attr("d", line);


}


function generateTags(date,stateId){

  var filter = 10;
  var limit = 10;
  var tags = [];
  if (!stateId) {
    hoveredState = 'US';

    if (!date) {
      hoveredDate = null;

      var obj = {};
      var target = mapData.total.tags;
      for(var d in target) {
        for(var t in target[d]) {
          obj[t] = obj[t]+target[d][t] || target[d][t];
        }
      }
      // console.log(obj);
      for(var key in obj) {
        var o = {};
        o.name = key;
        o.value = obj[key];
        if (o.value > filter && o.name != stopWord) {
          tags.push(o);
        }
      }
    } else {
      hoveredDate = date;

      var obj = mapData.total.tags[date];      

      for(var key in obj) {
        var o = {};
        o.name = key;
        o.value = obj[key];
        if (o.name != stopWord) {
          tags.push(o);
        }
      }      
    }
  } else {
    hoveredState = mapData[stateId].stateName;

    //has state
    if (!date) {
      hoveredDate = null;

      var obj = {};
      var target = mapData[stateId].tags;
      for(var d in target) {
        for(var t in target[d]) {
          obj[t] = obj[t]+target[d][t] || target[d][t];
        }
      }
      // console.log(obj);
      for(var key in obj) {
        var o = {};
        o.name = key;
        o.value = obj[key];
        if (o.name != stopWord) {
          tags.push(o);
        }
      }      


    } else {
      //date and state
      hoveredDate = date;
      var obj = mapData[stateId].tags[date];
      for(var key in obj) {
        var o = {};
        o.name = key;
        o.value = obj[key];
        if (o.name != stopWord) {
          tags.push(o);
        }
      }   

    }

  }

  tags.sort(function(a,b){
    return b.value-a.value;
  })
  if (tags.length > limit)
    tags = tags.splice(0,limit);  
  return tags;
}


function changeBar(date,stateId) {
  var tags = generateTags(date,stateId);
  if (tags.length < 10) {
    //add tooltip;
    console.log(tags);
    return;
  }


  var width = 350,
      bar_height = 20,
      gap = 2,
      height = (bar_height + 2 * gap) * tags.length;
  var left_width = 150;


  var x = d3.scale.linear()
    .domain([0, d3.max(tags,function(d){return d.value;})])
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var y = d3.scale.ordinal()
    .domain(tags.map(function(d){return d.name}))
    .rangeBands([0, (bar_height + 2 * gap) * tags.length]);

  d3.select("#bar-chart svg")
    .attr('height', (bar_height + gap * 2) * tags.length + 30)

  barChartGraphic.selectAll("rect")
    .data(tags).enter();
  barChartGraphic.selectAll("rect")
    .transition().duration(1000)
    .attr("x", left_width)
    .attr("y", function(d) { return y(d.name) + gap; })
    .attr("name", function(d, i) {
      return d.name;
    })
    .attr("width", function(d, i) {
      return x(d.value);
    })
    .attr("height", bar_height)
    .style("fill", function(d) {
      return "#9ecae1";
    })

  barChartGraphic.selectAll("text.score")
    .data(tags).enter();
  barChartGraphic.selectAll("text.score")
    .transition().duration(1000)
    .attr("x", function(d) { return x(d.value) + left_width; })
    .attr("y", function(d, i){ return y(d.name) + y.rangeBand()/2; } )
    .attr("dx", -5)
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr('class', 'score')
    .text(function(d) {
      return d.value;
    });
 
  barChartGraphic.selectAll("text.name")
    .data(tags).enter()
  barChartGraphic.selectAll("text.name")
    .transition().duration(1000)
    .attr("x", left_width-20)
    .attr("y", function(d, i){
      return y(d.name) + y.rangeBand()/2; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .text(function(d) {
      // console.log(d)
      return '#'+d.name;
    }); 
  var showDate = date || defaultDate;

  barChartGraphic.select("g.axis>text")
    .attr("transform", "rotate(90) translate(10, " + (-width - 20) + ")")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text('Other Tags In '+hoveredState+ ' ('+showDate+')');


}




function makeBarChart(){


  var tags = generateTags();


  var width = 350,
      bar_height = 20,
      gap = 2,
      height = (bar_height + 2 * gap) * tags.length;

  var left_width = 150;

  var x = d3.scale.linear()
    .domain([0, d3.max(tags,function(d){return d.value;})])
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var y = d3.scale.ordinal()
    .domain(tags.map(function(d){return d.name}))
    .rangeBands([0, (bar_height + 2 * gap) * tags.length]);

  barChartGraphic = d3.select("#bar-chart")
    .append('svg')
    .attr('class', 'chart')
    .attr('width', left_width + width + 100)
    .attr('height', (bar_height + gap * 2) * tags.length + 30)
    .append("g")
    .attr("transform", "translate(10, 20)");

  barChartGraphic.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + left_width + ", 0)")
    .call(xAxis)
  .append("text")
    .attr("transform", "rotate(90) translate(10, " + (-width - 20) + ")")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text('Other Tags In '+hoveredState+ ' ('+defaultDate+')');


  barChartGraphic.selectAll(".tick").append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", (bar_height + gap * 2) * tags.length);

  barChartGraphic.selectAll("rect")
    .data(tags)
    .enter().append("rect")
    .attr("x", left_width)
    .attr("y", function(d) { return y(d.name) + gap; })
    .attr("name", function(d, i) {
      return d.name;
    })
    .attr("width", function(d, i) {
      return x(d.value);
    })
    .attr("height", bar_height)
    .style("fill", function(d) {
      return "#9ecae1";
    })
    // .attr("class", function(d) {
    //   if (d.name === MAIN_CATEGORY || d.name === AVG_CATEGORY) {
    //     return "main-category-bar";
    //   } else {
    //     return "category-bar";
    //   }
    // });

  barChartGraphic.selectAll("text.score")
    .data(tags)
    .enter().append("text")
    .attr("x", function(d) { return x(d.value) + left_width; })
    .attr("y", function(d, i){ return y(d.name) + y.rangeBand()/2; } )
    .attr("dx", -5)
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr('class', 'score')
    .text(function(d) {
      return d.value;
    });
 
  barChartGraphic.selectAll("text.name")
    .data(tags)
    .enter().append("text")
    .attr("x", left_width-20)
    .attr("y", function(d, i){
      return y(d.name) + y.rangeBand()/2; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr('class', 'name')
    // .attr('class', function(d) {
    //   if (d.name === MAIN_CATEGORY || d.name === AVG_CATEGORY) {
    //     return "main-category-text";
    //   } else {
    //     return "";
    //   }
    // })
    .text(function(d) {
      return '#'+d.name;
    });

}





function addUpCount(date, stateId) {
  var count = 0;
  if (stateId) {

    var targetIndex = dateRange.indexOf(date);
    for(var i=0;i<=targetIndex;i++){
      var singleDay = mapData[stateId]['dates'][dateRange[i]] || 0;
      count += singleDay;
    }

  }



  return count;
}

function singleDayCount(date,stateId) {
  if (stateId) {

    var singleDay = mapData[stateId]['dates'][date] || 0; 
    return singleDay;
  }  
}

function makePieChart(){

  pieChartGraphic = d3.select("#pie-chart")
    .append("svg")
    .append("g")

  pieChartGraphic.append("g")
    .attr("class", "slices");
  pieChartGraphic.append("g")
    .attr("class", "labels");
  pieChartGraphic.append("g")
    .attr("class", "lines");

  var width = 400,
      height = 250,
    radius = Math.min(width, height) / 2;

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });

  var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  pieChartGraphic.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var key = function(d){ return d.data.label; };

  changePie();  

}


function changePie(date,stateId) {
  var data = [];
  var limit = 10;
  if (!date) {
    if (!stateId) {
      //whole us
      for(var stateInfo in mapData) {
        if (mapData[stateInfo].stateName) {
          var obj = {};  
          obj.label = mapData[stateInfo].stateName;
          obj.value = mapData[stateInfo].count;
          data.push(obj);        
        }
      }
      //generate other
      var sortData = data.sort(function(a,b){
        return b.value-a.value;
      })
      var keepData = sortData.splice(0,limit);
      var otherData = sortData.splice(limit,sortData.length);
      var otherValue = 0;
      otherData.map(function(d){
        otherValue += d.value;
      })
      data = keepData.concat([{label:'OTHER',value:otherValue}]);


    } else {
      //has state
      var total = 0;
      for(var stateInfo in mapData) {
        if (mapData[stateInfo].stateName) {
          // console.log()
          total += mapData[stateInfo].count;
        }
      }
      // console.log('total',total);
      var targetCount = mapData[stateId].count;
      var otherCount = total-targetCount;
      var targetPercent = Math.round(targetCount/total * 10000) / 100 + '%';
      data = [
        {label: mapData[stateId].stateName +" "+targetPercent, value: targetCount},
        {label: 'OTHER', value: otherCount}
      ];

    }

  } else {
    if (!stateId) {
      for(var stateInfo in mapData) {
        if (mapData[stateInfo].stateName) {
          var obj = {};  
          obj.label = mapData[stateInfo].stateName;
          obj.value = mapData[stateInfo].dates[date] || 0;
          data.push(obj);        
        }
      }
      //generate other
      var sortData = data.sort(function(a,b){
        return b.value-a.value;
      })
      var keepData = sortData.splice(0,limit);
      var otherData = sortData.splice(limit,sortData.length);
      var otherValue = 0;
      otherData.map(function(d){
        otherValue += d.value;
      })
      data = keepData.concat([{label:'OTHER',value:otherValue}]);      

    } else {

      //has state
      var total = 0;
      for(var stateInfo in mapData) {
        if (mapData[stateInfo].stateName) {
          // console.log()
          total += mapData[stateInfo].dates[date] || 0;
        }
      }
      console.log('total',total);
      var targetCount = mapData[stateId].dates[date];
      var otherCount = total-targetCount;
      var targetPercent = Math.round(targetCount/total * 10000) / 100 + '%';
      data = [
        {label: mapData[stateId].stateName +" "+targetPercent, value: targetCount},
        {label: 'OTHER', value: otherCount}
      ];

    }

  }

  if (hoveredDate) {
    $('.date-indicate').text(hoveredDate);
  } else {
    $('.date-indicate').text(defaultDate);
  }

  if (stateId) {
    $('.state-indicate').text(statesInfo[stateId].name);
  } else {
    $('.state-indicate').text(defaultState);
  }


  var width = 400,
      height = 250,
      radius = Math.min(width, height) / 2;

  var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);
  var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });
  var key = function(d){ return d.data.label; };  

  var max = d3.max(data,function(d){return d.value});
  // var color = generateColorFn2([0,max],[pieStartColor,pieEndColor])
  var color = d3.scale.ordinal()
    .domain(data.map(function(d){return d.label}))
    .range([pieSecondColor,pieThirdColor,pieFourthColor,pieFifthColor]);



  /* ------- PIE SLICES -------*/
  var slice = pieChartGraphic.select(".slices").selectAll("path.slice")
    .data(pie(data), key);

  slice.enter()
    .insert("path")
    .style("fill", function(d) { return color(d.data.label); })
    // .style("fill", function(d) { return color(d.value); })
    .attr("class", "slice");

  slice   
    .transition().duration(1000)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    })

  slice.exit()
    .remove();

  /* ------- TEXT LABELS -------*/

  var text = pieChartGraphic.select(".labels").selectAll("text")
    .data(pie(data), key);

  text.enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function(d) {
      return d.data.label;
    });
  
  function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  text.transition().duration(1000)
    .attrTween("transform", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate("+ pos +")";
      };
    })
    .styleTween("text-anchor", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start":"end";
      };
    });

  text.exit()
    .remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = pieChartGraphic.select(".lines").selectAll("polyline")
    .data(pie(data), key);
  
  polyline.enter()
    .append("polyline");

  polyline.transition().duration(1000)
    .attrTween("points", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };      
    });
  
  polyline.exit()
    .remove();
};





function animationSerial(){
  for(var i=0;i<dateRange.length;i++){

    (function(i){

      setTimeout(function(){
        console.log(dateRange[i]);
        $('.date:contains("'+dateRange[i]+'")').trigger('click');

      },i*500);
    })(i);

  }
}

function makeForceLayout(graph,pow){

  pow = pow || (1/4);

  $('#force-layout').empty();

  var avgArr = [];
  var tmplinks = graph.links;
  tmplinks.map(function(d){
    avgArr.push(d.value);
  })

  var avgArr = avgArr.sort(function(a,b){return a-b});
  var index = Math.floor(avgArr.length/3);
  average = avgArr[index]
  // console.log(average)

  var width = 500,
      height = 300;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .charge(-300)
      .linkDistance(120)
      .size([width, height]);

  var svg = d3.select("#force-layout").append("svg")
      .attr("width", width)
      .attr("height", height);

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .attr('data-link-source', function(d,i) { 
        if (d.value > average)
          return d.source.index;
      })
      .attr('data-link-target', function(d,i) { 
        if (d.value > average)
          return d.target.index;
      })
      .style("stroke-width", function(d) { 
        if (d.value > average) {
          return Math.pow(d.value,pow);
        } else {
          return 0;
        }

      });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      // .attr('data-tag',function(d){return d.name})
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      // .attr("r", 5)
      .call(force.drag);

    node.append("circle")
        .attr("r", 5)
        .attr('data-node', function(d,i) { return d.name;})
        .style("fill", function(d) { 
          if (d.name == stopWord) {
            return 'red'; 
          }
          return color(1);
        })

    // node.append("text")
    //     .attr("x", 12)
    //     .attr("dy", ".35emd")
    //     .text(function(d) { return d.name; });


  // node.append("title")
  //     .text(function(d) { return d.name; });
  node.append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .style('font-size','12px')
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

  node
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });


  function mouseover(d) {
    d3.select(this).select("circle").transition()
        .duration(500)
        .attr("r", 10);
    d3.select(this).select("text").transition()
        .duration(500)
        .style('font-size','18px')
        .style('opacity',1)

    var hoverNodeIndex = d.index;

    nodeIndexs = [];
    $('[data-link-source="'+hoverNodeIndex+'"]').each(function(){
      nodeIndexs.push($(this).attr('data-link-target'));
    })
    $('[data-link-target="'+hoverNodeIndex+'"]').each(function(){
      nodeIndexs.push($(this).attr('data-link-source'));
    })
    d3.selectAll('.node [data-node]').classed('node-hide',true);
    nodeIndexs.forEach(function(i){
      // console.log(graph.nodes[i].name);
      d3.selectAll('.node [data-node="'+graph.nodes[i].name+'"]')
        .classed('node-hide',false).classed('node-highlight',true);
    })
    d3.selectAll('.node [data-node="'+graph.nodes[hoverNodeIndex].name+'"]')
      .classed('node-hide',false).classed('node-highlight',true);    

    // console.log(nodeIndexs);
    // d3.selectAll('[data-link-source],[data-link-target]').classed('link-hide',true);
    d3.selectAll('.link:not([data-link-source="'+hoverNodeIndex+'"]),.link:not([data-link-target="'+hoverNodeIndex+'"])').classed('link-hide',true);
    d3.selectAll('[data-link-source="'+hoverNodeIndex+'"],[data-link-target="'+hoverNodeIndex+'"]')
      .classed('link-hide',false).classed('link-highlight',true);

    //bar chart
    d3.selectAll('#bar-chart rect[name]').classed('bar-hide',true);
    d3.selectAll('#bar-chart rect[name="'+graph.nodes[hoverNodeIndex].name+'"]')
      .classed('bar-hide',false).classed('bar-highlight',true);

    $('#bar-chart rect[name="'+graph.nodes[hoverNodeIndex].name+'"]').trigger('mouseover');
  }

  function mouseout(d) {
    var hoverNodeIndex = d.index;
    d3.select(this).select("circle").transition()
        .duration(500)
        .attr("r", 5);
    d3.select(this).select("text").transition()
        .duration(500)
        .style('font-size','12px')
        .style('opacity',0.5)
    d3.selectAll('[data-link-source],[data-link-target]').classed('link-highlight',false);
    d3.selectAll('[data-link-source],[data-link-target]').classed('link-hide',false);
    d3.selectAll('.node [data-node]').classed('node-highlight',false);
    d3.selectAll('.node [data-node]').classed('node-hide',false);

    //bar chart
    d3.selectAll('#bar-chart rect[name]').classed('bar-hide',false);
    d3.selectAll('#bar-chart rect[name]').classed('bar-highlight',false);

    $('#bar-chart rect[name="'+graph.nodes[hoverNodeIndex].name+'"]').trigger('mouseout');
  }

  
}

function changeForce(date,stateId) {

  var limit = 30;
  var keepWords = [];
  var counter = {};
  var totalTags = [];
  //count
  if (!date) {

    if (!stateId) {
       //date no, state no
      for(var id in tagsData){
        for(var date in tagsData[id]) {

          var hashTags = tagsData[id][date];
          hashTags.forEach(function(tags){
            totalTags.push(tags);
          })    
        }
      }      
    } else {

      for(var eachDate in tagsData[stateId]){
        var hashTags = tagsData[stateId][eachDate];
        hashTags.forEach(function(tags){
          totalTags.push(tags);
        })
      }  


    } //date no, state yes

  } else {

    if (!stateId) {
      //date yes, state no
      for(var id in tagsData) {
        if (tagsData[id][date]) {
          var hashTags = tagsData[id][date];
          hashTags.forEach(function(tags){
            totalTags.push(tags);
          })
        }
      }

    } else {
      totalTags = tagsData[stateId][date] || [];
    } // date yes, state yes

  }



  //count
  totalTags.forEach(function(tags){
    tags.forEach(function(t){
      counter[t] = ++counter[t] || 1;      
    })
  })
  if (Object.keys(counter).length > limit) {

    var arr = [];
    for(var tag in counter){
      var o = {};
      o.name = tag;
      o.count = counter[tag];
      arr.push(o);
    }

    arr = arr.sort(function(a,b){return b.count-a.count}).splice(0,limit);
    arr.map(function(d){
      keepWords.push(d.name);
    })
  }
  // console.log(totalTags);
  console.log(keepWords);
  return convertDataToForce(totalTags,keepWords);


}



var tags = [['a','b','c'],['b','d'],['a','c'],['b','c','d'],['d']];

function convertDataToForce(totalHashTags,keepWords) {
  var results = {};
  var nodes = [];
  var links = [];

  results.nodes = nodes;
  results.links = links;

  var wordArray = [];
  var pair = {};
  totalHashTags.forEach(function(tagArray){
    var length = tagArray.length;
    if (length > 1) {
      for(var i=0;i<length;i++){
        var outterFlag = keepWords.indexOf(tagArray[i]);

        if (outterFlag != -1) {

          var j = length-i;
          for(var k=1;k<j;k++){
            var innerFlag = keepWords.indexOf(tagArray[i+k]);
            if (innerFlag != -1) {
              var source = tagArray[i];
              var target = tagArray[i+k];

              if (wordArray.indexOf(source) != -1) {
                var sourceId = wordArray.indexOf(source);
              } else {
                wordArray.push(source);
                var sourceId = wordArray.indexOf(source);
              }
              if (wordArray.indexOf(target) != -1) {
                var targetId = wordArray.indexOf(target);
              } else {
                wordArray.push(target);
                var targetId = wordArray.indexOf(target);
              }

              var keyId = sourceId + '_' + targetId;

              var count = 0;
              totalHashTags.forEach(function(tags){
                if (tags.indexOf(source)!= -1 && tags.indexOf(target)!= -1) {
                  count++;
                }
              })

              if (!pair[keyId]) {
                pair[keyId] = count;
              }
            }
        
          }
        }
      }

    }


  })//whole foreach
  

  for(var key in pair) {

    var split = key.split('_');
    var ss = parseInt(split[0],10);
    var tt = parseInt(split[1],10);

    var print = {};
    print.source = ss;
    print.target = tt;
    print.value = pair[key];
    links.push(print);
  }

  wordArray.forEach(function(word){
    nodes.push({name:word});
  })

  // console.log(JSON.stringify(results));
  return results;


}

function generatePalette(){
  max = 1;
  var data = [0,1/4,2/4,3/4,1];
  var colors = d3.scale.linear()
    .domain([0,max*(1/3),max*(2/3),max]).range([mainStartColor,mainSecondColor,mainMiddleColor,mainEndColor]);

    d3.select("#palette").selectAll('span')
      .data(data)
      .enter().append("span")
      .style('width','50px')
      .style('height','15px')
      .style('display','block')
      .style('float','left')
      .style('background',function(d){
        return colors(d);
      })

}


