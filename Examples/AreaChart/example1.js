var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
        'label': ['Расходы на транспорт', 'Количество сотрудников', 'Количество клиентов', 'Активы компании'],
        'values': [
        {
          'label': '2007',
          'values': [20, 40, 15, 5]
        }, 
        {
          'label': '2008',
          'values': [30, 10, 45, 10]
        }, 
        {
          'label': '2009',
          'values': [38, 20, 35, 17]
        }, 
        {
          'label': '2010',
          'values': [58, 10, 35, 32]
        }, 
        {
          'label': '2011',
          'values': [55, 60, 34, 38]
        }, 
        {
          'label': '2012',
          'values': [60, 40, 25, 40]
        }]
        
    };
    var json2 = {
        'values': [
        {
          'label': '2007',
          'values': [10, 40, 15, 7]
        }, 
        {
          'label': '2008',
          'values': [30, 40, 45, 9]
        }, 
        {
          'label': '2011',
          'values': [55, 30, 34, 26]
        }, 
        {
          'label': '2012',
          'values': [26, 40, 85, 28]
        }]
        
    };
    //end
    var infovis = document.getElementById('infovis');
    //init AreaChart
    var areaChart = new $jit.AreaChart({
      //id of the visualization container
      injectInto: 'infovis',
      //add animations
      animate: true,
      //separation offsets
      Margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 5
      },
      labelOffset: 5,
      //whether to display sums
      showAggregates: true,
      //whether to display labels at all
      showLabels: true,
      //could also be 'stacked'
      type: useGradients? 'stacked:gradient' : 'stacked',
      //label styling
      Label: {
        type: labelType, //can be 'Native' or 'HTML'
        size: 13,
        family: 'Arial',
        color: 'white'
      },
      //enable tips
      Tips: {
        enable: true,
        onShow: function(tip, elem) {
          tip.innerHTML = "<b>" + elem.name + "</b>: " + elem.value;
        }
      },
      //add left and right click handlers
      filterOnClick: true,
      restoreOnRightClick:true
    });
    //load JSON data.
    areaChart.loadJSON(json);
    //end
    var list = $jit.id('id-list'),
        button = $jit.id('update'),
        restoreButton = $jit.id('restore');
    //update json on click
    $jit.util.addEvent(button, 'click', function() {
      var util = $jit.util;
      if(util.hasClass(button, 'gray')) return;
      util.removeClass(button, 'white');
      util.addClass(button, 'gray');
      areaChart.updateJSON(json2);
    });
    //restore graph on click
    $jit.util.addEvent(restoreButton, 'click', function() {
      areaChart.restore();
    });
    //dynamically add legend to list
    var legend = areaChart.getLegend(),
        listItems = [];
    for(var name in legend) {
      listItems.push('<div class=\'query-color\' style=\'background-color:'
          + legend[name] +'\'>&nbsp;</div>' + name);
    }
    list.innerHTML = '<li>' + listItems.join('</li><li>') + '</li>';
}
