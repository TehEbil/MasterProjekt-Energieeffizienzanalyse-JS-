'use strict';
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

const CONVERT_DATA = false;		// set to true to generate Data from ExcelFile if not exists

/*
	Berechne kWh pro Stunde, Durchschnitt
	kWh pro Tag
	Woche?
	kWh pro Monat
	prozentuale Unterschied zw. Monaten & Unterschiedsmatrix ermitteln
*/

if(CONVERT_DATA) {
	convertData();
}

init();

function init() {
	fs.readFile("data/data.json", function( err, data ) {
		if(err)
			return console.log("FEHLER bei init: backup datei konnte nicht gelesen werden!")
		
		var tmpData = JSON.parse(data);
		
		// delete unnecessary excel line:
		var keys = Object.keys(tmpData);
		for(let key of keys) {
			tmpData[key].splice(0, 1);
			tmpData[key].splice(tmpData[key].length-1, 1);
		}

		createListAll(tmpData);
		createMergedData(tmpData);
		createHourlyList(tmpData);
		createDailyList(tmpData);

		var monthlyList = createMonthlyList(tmpData);
		createMonthlyMatrix(monthlyList);
	});
}

function createListAll(tmpData) {
	var listAll = {};
	var keys = Object.keys(tmpData);
	for(let key of keys)
		listAll[key] = [];

	for(let key in tmpData)
		for(let data of tmpData[key]) {
			//listAll[key].push({time: new Date(generateDate(data.Datum, data.Uhrzeit)), value: parseFloat(data['Wert [kWh]'].replace(/,/, '.'))})  Für CSV, String Dates
			listAll[key].push({time: new Date(generateDate2(data.Datum, data.Uhrzeit)), value: data['Wert [kWh]']})
		}
	fs.writeFile("data/listAll.js", "var listAll = " + JSON.stringify(listAll, null, 2), () => {});
}

function createMergedData(tmpData) {
	// prepare data structure
	var mergedDays = {};
	for (let key in tmpData) {
		if (!(key in mergedDays))
			mergedDays[key] = {};

		for (let data of tmpData[key])
			if (!(data.Datum in mergedDays))
				mergedDays[key][data.Datum] = [];
	}

	// push data to our structure
	for (let key in tmpData)
		for (let data of tmpData[key])
			mergedDays[key][data.Datum].push({ time: data.Uhrzeit, value: data['Wert [kWh]'] })

	// save it in a file
	fs.writeFile("data/mergedData.json", JSON.stringify(mergedDays, null, 2), () => {});
}

function createHourlyList(tmpData) {
	var hourlyList = {};
	var keys = Object.keys(tmpData);
	for(let key of keys)
		hourlyList[key] = [];

	var lastDate = undefined;
	var val = 0;

	for(let key in tmpData)
		for(var i = 0; i < tmpData[key].length - 1; i++) {
			
			let datax = { time: new Date(generateDate2(tmpData[key][i].Datum, tmpData[key][i].Uhrzeit)).setMinutes(0)};


			val = 0;
			// hotfix first Loop
			while(i%4 != 0 || i== 0) {

				let data = tmpData[key][i];

				val += data['Wert [kWh]'];
				i++;
			}

			datax.value = val/4;
			hourlyList[key].push(datax)
		}

	fs.writeFile("data/hourlyList.js", "var hourlyList = " + JSON.stringify(hourlyList, null, 2), () => {});
}

function createDailyList(tmpData) {
	var dailyList = {};
	var keys = Object.keys(tmpData);
	for(let key of keys)
		dailyList[key] = [];

	var lastDate = undefined;
	var val = 0;

	for(let key in tmpData)
		for(var i = 0; i < tmpData[key].length - 1; i++) {

			var date = new Date(generateDate2(tmpData[key][i].Datum, tmpData[key][i].Uhrzeit));
				date.setMinutes(0);
				date.setHours(0);
			
			let datax = { time: date};

			val = 0;
			// hotfix first Loop
			while(i%96 != 0 || i== 0) {

				let data = tmpData[key][i];
				
				val += data['Wert [kWh]'];
				i++;
			}

			datax.value = val/4/24;
			dailyList[key].push(datax)
		}


	fs.writeFile("data/dailyList.js", "var dailyList = " + JSON.stringify(dailyList, null, 2), () => {});
}

function createMonthlyList(tmpData) {
	var monthlyList = {};
	var keys = Object.keys(tmpData);
	for(let key of keys)
		monthlyList[key] = [];

	var lastDate = undefined;
	var val = 0;

	for(let key in tmpData)
		// for(let data of tmpData[key]) {
		for(var i = 0; i < tmpData[key].length - 1; i++) {

			var date = new Date(generateDate2(tmpData[key][i].Datum, tmpData[key][i].Uhrzeit));
				date.setMinutes(0);
				date.setHours(0);
			
			let datax = { time: date};

			var j, k;
			j = k = i;
			for(; j < tmpData[key].length - 1; j++) {
				var dateJ = new Date(generateDate2(tmpData[key][j].Datum, tmpData[key][j].Uhrzeit));
					date.setMinutes(0);
					date.setHours(0);

				if(date.getMonth() < dateJ.getMonth()) {
					break;
				}
			}
			val = 0;
			// hotfix first Loop
			while(i%j != 0 || i== 0) {

				let data = tmpData[key][i];
				
				val += data['Wert [kWh]'];
				i++;
			}

			datax.value = val/(j-k);
			monthlyList[key].push(datax)
		}


	fs.writeFile("data/monthlyList.js", "var monthlyList = " + JSON.stringify(monthlyList, null, 2), () => {});
	return monthlyList;
}

Number.prototype.toFixedNumber = function(x, base){
  var pow = Math.pow(base||10,x);
  return +( Math.round(this*pow) / pow );
}

function createMonthlyMatrix(monthlyList) {

	var monthlyMatrix = {};
	var keys = Object.keys(monthlyList);
	for(let key of keys)
		monthlyMatrix[key] = [];

	var lastDate = undefined;
	var val = 0;

	for(let key in monthlyList)
		for(var i = 0; i < monthlyList[key].length - 1; i++) {
			monthlyMatrix[key][i] = [];
			for(var j = 0; j < monthlyList[key].length - 1; j++) {
				monthlyMatrix[key][i][j] = (monthlyList[key][i].value / monthlyList[key][j].value).toFixedNumber(2);
			}
		}

	console.log(monthlyMatrix);
	fs.writeFile("data/monthlyMatrix.js", "var monthlyMatrix = " + JSON.stringify(monthlyMatrix, null, 2), () => {});
}

function convertData() {
	console.log("Converting 'Beispiellastgaenge.xlsx' excel to JSON data ...")
	const result = excelToJson({
		sourceFile: 'data/Beispiellastgaenge.xlsx',
		columnToKey: {
			A: 'Datum',
			B: 'Uhrzeit',
			C: 'Wert [kWh]'
		}
	});

	console.log("Writing Data to 'data.json ...'")
	fs.writeFile("data/data.json", JSON.stringify(result, null, 2), () => {});
}


function generateDate(dateStr, timeStr) {
	var parts = dateStr.split('.');
	var parts2 = timeStr.split(':');
	parts[2] = parseInt(parts[2]) + 2000;
	return parts[1]+'-'+parts[0]+'-'+parts[2]+" "+parts2[0]+":"+parts2[1];
}

function generateDate2(dateStr, timeStr) {
	var date = new Date(dateStr);
	
	var parts = timeStr.split(':');
	
	// fix für 00:00
	if(parts[0] == 0 && parts[1] == 0)
		parts[0] = 24;
	
	date.setHours(date.getHours() + parseInt(parts[0]));
	date.setMinutes(date.getMinutes() + parseInt(parts[1]));
	
	return date;
}