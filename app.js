var app = angular.module('app', []);

(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope'];

    /* @ngInject */
    function MainController($scope) {
        var vm = this;
        vm.title = 'MainController';
        vm.changeGraph = changeGraph;
        vm.reload = reload;
        vm.testDriver = testDriver;
        vm.selected = 'monthlyList';
        
        var label = "kWh";

        var listObj = {
            listAll,
            hourlyList,
            dailyList,
            dailyListCut,
            monthlyList
        }

        vm.date = {
            dateFrom : 1,
            dateTo : 11,
            dateDayFrom : 1,
            dateDayTo : 31
        }
        init();

        ////////////////

        function prepareMonthAvgData() {
            // cheating
            let tmpMonthlyAvgMatrix = angular.copy(monthlyAvgMatrix);
            let monthList = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep","Okt", "Nov", "Dez"];
            for(var key in tmpMonthlyAvgMatrix) {
                tmpMonthlyAvgMatrix[key].unshift(monthList[key]);
            }
            monthList.unshift("");
            tmpMonthlyAvgMatrix.unshift(monthList.slice(0));

            return tmpMonthlyAvgMatrix;
        }

        function init() {
            vm.monthlyAvg = prepareMonthAvgData();
            changeGraph(vm.selected, vm.date);
        }

        function reload() {
            location.reload(); 
        }

        function changeGraph(listStr, date=undefined) {
            if(date===undefined)
                date = vm.date;
            vm.selected = listStr;
            var timeFormat = "%d.%m.%Y";
            if(listStr === 'hourlyList' || listStr === 'listAll')
                timeFormat += " %H:%M";

            nv.addGraph(function () {
              var chart = nv.models.lineWithFocusChart()
                .useInteractiveGuideline(true)
                ;

              chart.xAxis
                .axisLabel('Datum')

                .showMaxMin(true)
                .staggerLabels(true)
                .tickFormat((d) => {
                  return d3.time.format(timeFormat)(new Date(d))
                });

              chart.x2Axis
                .axisLabel('Datum')
                .tickFormat((d) => {
                  return d3.time.format('%d.%m.%Y')(new Date(d))
                })


              chart.yAxis
                .axisLabel(label)
                .tickFormat(d3.format('.04f'))
                ;

              d3.select('#chart svg')
                .datum(data(listObj[listStr], date))
                .transition().duration(500)
                .call(chart)
                ;

              nv.utils.windowResize(chart.update);

              enableZoom(chart);
              return chart;
            });

        }

        function testDriver(month = undefined) {
            if(month===undefined)
                month = Math.floor((Math.random() * 11) + 0)

            var keys = Object.keys(monthlyList);
            var pre = {};
            for (let key of keys)
                pre[key] = monthlyList[key][month].value;

            console.log("Starting...")
            setTimeout( () => {
                deleteMonth(month);
                console.log("deleted month:", month)
                changeGraph("monthlyList", vm.date);

            }, 2500)
            setTimeout( () => {
                var val = calculateMonth(month);
                addMonth(month, val);
                console.log("calculated month:", month)
                changeGraph("monthlyList", vm.date);

                for (let key of keys)
                    pre[key] = (1 - pre[key] / monthlyList[key][month].value) * 100;

                console.log("Abweichung 2016: " + pre['2016 ohne WP'].toFixed(3) + "%, Abweichung 2017: " + pre['2017 ohne WP'].toFixed(3) + "%");
            }, 5000)


        }

        function deleteMonth(month) {
            // var monthToDelete = new Date(2016, month);
            var month;


            for(var key_s in monthlyList)
                // monthlyList[key_s] = monthlyList[key_s].filter(o => new Date(o.time).getMonth() !== month);
               monthlyList[key_s].find(o => new Date(o.time).getMonth() === month).value = 0;
            changeGraph("monthlyList", vm.date);
        }

        function addMonth(month, value) {
            for(var key_s in monthlyList)
                monthlyList[key_s].find(o => new Date(o.time).getMonth() === month).value = value[key_s];
        }

        function calculateMonth(month) {
            var sum = 0;

            var keys = Object.keys(monthlyList);
            var sums = {};
            for (let key of keys)
                sums[key] = 0;

            // var key_s = Object.keys(monthlyList)[1];
            for(var key_s in monthlyList)
                // for(var i = 0; i < 12; i++) {
                //     if(i==month)
                //         continue;
                //     else {
                        sums[key_s] += monthlyAvgMatrix[month][month+1] * monthlyList[key_s][month+1].value + monthlyAvgMatrix[month][month-1] * monthlyList[key_s][month-1].value
                    // }
                // }

            for (let key of keys)
                sums[key] = sums[key] / 2;

            return sums;

        }

        // function deleteMonth(month) {
        //     // var monthToDelete = new Date(2016, month);
        //     var month;

        //     for(var key_s in monthlyList)
        //         monthlyList[key_s] = monthlyList[key_s].filter(o => new Date(o.time).getMonth() !== month);

        //     changeGraph("monthlyList", vm.date);
        // }

        function data(list, date) {
          var {dateFrom, dateTo, dateDayFrom, dateDayTo} = date;
          dateTo = dateTo - 1;
          dateFrom = dateFrom - 1;
          // Bei Benutzung von Monatstagbegrenzung im Folgenden, ratsamer Weise Datum vom Monat auf 1 limitieren, d.h. dateFrom = dateTo = 1     o.ä.
          var dateSkip = new Date("2017-12-31T23:00:00.000Z"); //hotfix

          var listAll = list;
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
              color: 'orange'
            },
            {
              values: year[keys[1]],
              key: 'Jahr 2017',
              color: 'lightblue'
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
    }
})();

