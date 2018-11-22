var label = "kWh";

// Eine von folgenden 4 Listen darf nicht auskommentiert sein, sonst Fehlermeldung & keine Daten:
// var listAll = listAll; // Alle Daten im 15 Minuten Takt
// var listAll = hourlyList; // Alle Daten im 1 Stunden Takt
var listAll = dailyList;  // Alle Daten im 1 Tag Takt
// var listAll = monthlyList;  // Alle Daten im Monatstakt


function data() {

  var dateFrom = 0; //3 -> Januar      // Zeige ab Monat
  var dateTo = 11; //3 -> Dezember     // Zeige bis Monat

  // Bei Benutzung von Monatstagbegrenzung im Folgenden, ratsamer Weise Datum vom Monat auf 1 limitieren, d.h. dateFrom = dateTo = 1     o.ä.

  var dateDayFrom = 0;      // Zeige ab Monatstag
  var dateDayTo = 31;       // Zeige bis Monatstag


  var dateSkip = new Date("2017-12-31T23:00:00.000Z"); //hotfix

  var keys = Object.keys(listAll);
  var year = {};
  for (let key of keys)
    year[key] = [];

  for (let key in listAll)
    for (let entry of listAll[key]) {
      var dateObj = new Date(entry.time);
      if (dateObj >= dateSkip)
        continue;

      // set year of 2017 to 2016, damit die überlappen zum Vergleichen
      if (key.indexOf('2017') >= 0)
        dateObj.setYear("2016");

      if (dateObj.getMonth() >= dateFrom && dateObj.getMonth() <= dateTo
        && dateObj.getDate() >= dateDayFrom && dateObj.getDate() <= dateDayTo)
        year[key].push({ x: dateObj, y: entry.value });
    }

  return [
    {
      values: year[keys[0]],
      key: 'Jahr 2016',
      color: '#ff7f0e'
    },
    {
      values: year[keys[1]],
      key: 'Jahr 2017',
      color: '#ffff5e'
    }
  ];
}

var enableZoom = function (chart) {
  var scope = {
    chart: chart,
    svg: d3.select(chart.container)
  };

  var fixDomain, zoomed, unzoomed;

  var xScale = scope.chart.xAxis.scale();
  var yScale = scope.chart.yAxis.scale();
  var xDomain = scope.chart.xDomain || xScale.domain;
  var yDomain = scope.chart.yDomain || yScale.domain;
  var x_boundary = xScale.domain().slice();
  var y_boundary = yScale.domain().slice();
  var scaleExtent = [1, 10];

  var scale = 1;

  // create d3 zoom handler
  var d3zoom = d3.behavior.zoom();

  // ensure nice axis
  xScale.nice();
  yScale.nice();

  // fix domain
  fixDomain = function (domain, boundary) {
    domain[0] = Math.min(Math.max(domain[0], boundary[0]), boundary[1] - boundary[1] / scaleExtent[1]);
    domain[1] = Math.max(boundary[0] + boundary[1] / scaleExtent[1], Math.min(domain[1], boundary[1]));
    return domain;
  };
  // zoom event handler
  zoomed = function () {
    //xDomain(fixDomain(xScale.domain(), x_boundary));
    yDomain(fixDomain(yScale.domain(), y_boundary));
    scope.chart.update();
  };

  // unzoomed event handler
  unzoomed = function () {
    xDomain(x_boundary);
    yDomain(y_boundary);
    d3zoom.scale(1);
    d3zoom.translate([0, 0]);
    scope.chart.update();
  };

  // initialize
  d3zoom.x(xScale)
    .y(yScale)
    .scaleExtent(scaleExtent)
    .on('zoom', zoomed);
  scope.svg.call(d3zoom);
}

nv.addGraph(function () {
  var chart = nv.models.lineWithFocusChart()
    .useInteractiveGuideline(true)
    ;

  chart.xAxis
    .axisLabel('Datum')

    .showMaxMin(true)
    .staggerLabels(true)
    .tickFormat((d) => {
      return d3.time.format('%d.%m.%Y %H:%M')(new Date(d))
    });

  chart.x2Axis
    .axisLabel('Datum')
    .tickFormat((d) => {
      return d3.time.format('%d.%m.%Y')(new Date(d))
    })


  chart.yAxis
    .axisLabel(label)
    .tickFormat(d3.format('.02f'))
    ;

  d3.select('#chart svg')
    .datum(data())
    .transition().duration(500)
    .call(chart)
    ;

  nv.utils.windowResize(chart.update);

  enableZoom(chart);
  return chart;
});
