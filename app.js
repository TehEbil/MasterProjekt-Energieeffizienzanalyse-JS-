var app = angular.module('app', ['ui.bootstrap']);

(function() {
    'use strict';

    angular
        .module('app')
        .component('monthlyAverage', {
            bindings: {
                data: '='
            },
            controller: MonthlyAverageController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              return `
              <br>
              <div>
                <p>Durschschnittliche Abhängigkeit der Monate von den Monaten: </p>
                <table class='myTable'>
                   <tr ng-repeat="(key1, row) in vm.monthlyAvg track by $index">
                      <td ng-repeat="(key2, col) in row track by $index">
                        <span ng-if="key1 == 0 || key2 == 0">{{col}}</span>
                        <span ng-if="key1 != 0 && key2 != 0">{{col | number : 2}}</span>
                      </td>
                   </tr>
                </table>
              </div>
                `
            }

        });

    MonthlyAverageController.$inject = [];

    /* @ngInject */
    function MonthlyAverageController() {
      var vm = this;

      vm.$onInit = function() {

        vm.monthlyAvg = prepareMonthAvgData();
      }

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

    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('stromCalculator', {
            bindings: {
                data: '='
            },
            controller: StromCalculatorController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              return `
              <br>
              <uib-tabset active="active">

                  <uib-tab index="1" heading="Einfach">
                    <easy-profile></easy-profile>
                  </uib-tab>

                  <uib-tab index="2" heading="Erweitert">
                      <profile></profile>
                 </uib-tab>

               </uib-tabset>
                `
            }

        });

    StromCalculatorController.$inject = [];

    /* @ngInject */
    function StromCalculatorController() {
      var vm = this;

      vm.$onInit = function() {
      }
    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('easyProfile', {
            bindings: {
                data: '='
            },
            controller: EasyProfileController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              return `
              <br>
              <form>
                <div class="form-row">
                  <div class="form-group col-md-4">
                    <label>Anzahl Personen</label>
                    <input type="number" ng-model="vm.personsNumber" min="1" max="6" class="form-control">
                  </div>
                </div>
                <fieldset class="form-group col-md-4">
                  <div class="row">
                    <label class="col-md-4">Durchlauferhitzer</label>
                    <div class="col-md-8">
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="1" ng-model="vm.durchlauferhitzer">
                        <label class="form-check-label" for="gridRadios1">
                          Ja
                        </label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="2" ng-model="vm.durchlauferhitzer">
                        <label class="form-check-label" for="gridRadios2">
                          Nein
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>

              </form>
            <p ng-if="vm.personsNumber && vm.durchlauferhitzer"> Der Verbrauch liegt bei ca. {{vm.stromverbrauche[vm.personsNumber][vm.durchlauferhitzer]}} kWh </p>
            <p ng-if="!vm.personsNumber || !vm.durchlauferhitzer"> Um den Verbrauch zu ermitteln, bitte beide Felder angeben. </p>
                `
            }

        });

    EasyProfileController.$inject = [];

    /* @ngInject */
    function EasyProfileController() {
      var vm = this;

      vm.stromverbrauche = {
        1: { "1": 1800, "2": 2500},
        2: { "1": 2700, "2": 3800},
        3: { "1": 3400, "2": 4900},
        4: { "1": 4000, "2": 5800},
        5: { "1": 4600, "2": 6700},
        6: { "1": 5200, "2": 7600}
      }

      vm.$onInit = function() {
      }
    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('profile', {
            bindings: {
                data: '='
            },
            controller: ProfileController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              return `

              <br>
              <form>
                <!--div class="form-row">
                    <div class="form-group col-md-4">
                      <label>Anzahl Personen</label>
                      <input type="number" ng-model="vm.personsNumber" min="1" max="6" class="form-control">
                    </div>
                    <div class="form-group col-md-4">
                      <label>Anzahl Personen</label>
                      <input type="number" ng-model="vm.personsNumber" min="1" max="6" class="form-control">
                    </div>
                </div-->

                <div class="form-row">
                    <div class="form-group col-md-3">
                      <label>Gerät</label>
                    </div>
                    <div class="form-group col-md-3">
                      <label>Verbrauch</label>
                    </div>
                    <div class="form-group col-md-3">
                      <label>Anzahl</label>
                    </div>
                    <div class="form-group col-md-3">
                      <label>Stunden pro Tag</label>
                    </div>

                    <div class="clearfix"></div>
                </div>

                <div ng-repeat="(key, value) in vm.config" class="form-row">
                    <div class="form-group col-md-3">
                      <input type="text" readonly ng-model="key" min="1" max="6" class="form-control" style="background-color: white">
                    </div>
                    <div class="form-group col-md-3">
                      <input type="number" ng-model="value.verbrauch"class="form-control">
                    </div>
                    <div class="form-group col-md-3">
                      <input type="number" ng-model="value.number" min="1" max="20" class="form-control">
                    </div>
                    <div class="form-group col-md-3">
                      <input type="number" ng-model="value.hours" min="0" max="24" class="form-control">
                    </div>

                    <div class="clearfix"></div>
                </div>
              </form>

              Jährlicher Verbrauch: <strong>{{vm.sum() | currency:'€'}}</strong>
              Jährliche Kosten: <strong>{{vm.sum() * 0.3 | currency:'€'}}</strong>
              Monatliche Kosten: <strong>{{vm.sum() * 0.3 / 12 | currency:'€'}}</strong>
                `
            }

        });

    ProfileController.$inject = [];

    /* @ngInject */
    function ProfileController() {
      var vm = this;

      vm.sum = () => {
        var sum = 0;
        for(let el in vm.config)
            sum += vm.config[el].number * vm.config[el].hours * vm.config[el].verbrauch;
        return sum / 1000 * 365; 
      }

      vm.config = {
        "Lampen": { "number": 5, "hours": 6, "verbrauch": 15},
        "Laptop": { "number": 1, "hours": 2, "verbrauch": 80},
        "Kühlschrank": { "number": 1, "hours": 24, "verbrauch": 120},
        "Gefrierschrank": { "number": 1, "hours": 24, "verbrauch": 150},
        "TV Flachbildschirm": { "number": 1, "hours": 4, "verbrauch": 150},
        "PC": { "number": 2, "hours": 2, "verbrauch": 200},
        "Abzugshaube": { "number": 1, "hours": 0.5, "verbrauch": 400},
        "Mikrowelle": { "number": 1, "hours": 0.1, "verbrauch": 800},
        "Fön": { "number": 1, "hours": 0.05, "verbrauch": 2000},
        "Wasserkocher": { "number": 1, "hours": 0.025, "verbrauch": 2200},
        "Waschmaschine": { "number": 1, "hours": 0.5, "verbrauch": 2000},
        "Staubsauger": { "number": 1, "hours": 0.5, "verbrauch": 2000},
        "Wäschetrockner": { "number": 1, "hours": 0.5, "verbrauch": 3000},
        "Geschirrspülmaschine": { "number": 1, "hours": 0.75, "verbrauch": 2300},
        "Herd": { "number": 1, "hours": 1, "verbrauch": 3000}
      }

      vm.$onInit = function() {
      }
    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .component('chartTable', {
            bindings: {
                date: "=?"
                // listObj: "="
            },
            controller: ChartTableController,
            controllerAs: 'vm',
            template: function ($element, $attrs) {
              return `
              <br>
              <div id="chart">
                  <!--label class="btn btn-success btn-sm" ng-model="checkModel.right" uib-btn-checkbox>Right</label-->
                <div class="btn-group">

                    <button ng-repeat="item in [
                        {'key': 'listAll', 'value': 'gesamt'},
                        {'key': 'hourlyList', 'value': 'stündlich'},
                        {'key': 'dailyList', 'value': 'täglich'},
                        {'key': 'dailyListCut', 'value': 'täglich (round)'},
                        {'key': 'monthlyList', 'value': 'monatlich'}
                    ]" ng-click="vm.changeGraph(item.key)" ng-style="item.key == vm.selected && {'font-weight': 'bold'}" class="btn btn-primary">{{item.value}}</button>
                </div>

                <strong>Monat:</strong> von [1-12] <input ng-model="vm.date.dateFrom" style="width: 35px"> 
                bis [1-12] <input ng-model="vm.date.dateTo" style="width: 35px"> 
                <strong>Tag:</strong> von [1-31] <input ng-model="vm.date.dateDayFrom" style="width: 35px"> 
                bis [1-31] <input ng-model="vm.date.dateDayTo" style="width: 35px"> 
                <button class="btn btn-primary btn-md" ng-click="vm.changeGraph(vm.selected)">Aktualisieren</button>
                <div class="btn-toolbar pull-right">
                    <button class="btn btn-success btn-md" ng-click="vm.testDriver()">testRandom</button>
                    <button class="btn btn-success btn-md" ng-click="vm.testDriver(1)">testFebruar</button>
                </div>
                <svg style="height: 600px"></svg>
              </div>
                `
            }

        });

    ChartTableController.$inject = [];

    /* @ngInject */
    function ChartTableController() {
      var vm = this;

      vm.$onInit = function() {

        vm.date = vm.date || {
            dateFrom : 1,
            dateTo : 11,
            dateDayFrom : 1,
            dateDayTo : 31
        }

        vm.listObj = {
              listAll,
              hourlyList,
              dailyList,
              dailyListCut,
              monthlyList
        }

        init();
      }

          vm.changeGraph = changeGraph;
          vm.testDriver = testDriver;
          vm.selected = 'monthlyList';
          
          var label = "kWh";

          ////////////////

          function init() {
              changeGraph(vm.selected, vm.date);
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
                  .datum(data(vm.listObj[listStr], date))
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
        vm.reload = reload;

        init();

        function init() {
        }

        function reload() {
            location.reload(); 
        }
    }
})();

