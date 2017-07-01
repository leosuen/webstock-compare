var stock1json,stock2json;
var stock1str=[],stock2str=[];
var stockresult = document.getElementById("result-area");

function convertTostring(json,number){
	var json = JSON.parse(json);
	var tempDate = json["Date"];
	var tempPrice = json["Adj Close"];
	for (var i = 0 ; i < tempPrice.length ; i++) {

		if (number === "1") {
			stock1str[i] = [];
		}
		else if (number === "2") {
			stock2str[i] = [];
		}
		for (var j = 0; j < 2; j++) {
			if (number === "1") {
				if (j === 0) {
					stock1str[i][j] = tempDate[i];
				}
				else{
					stock1str[i][j] = tempPrice[i];
				}
			}
			else if (number === "2") {
				if (j === 0) {
					stock2str[i][j] = tempDate[i];
				}
				else{
					stock2str[i][j] = tempPrice[i];
				}
			}
		}
	}
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

var curdate1 = null;
var curdate2 = null;
var judgeUsingDate = null;
var shortestLength = null;
var iLength=0;
var r1,r2,rpSum = 0,AvgPerMonth = [],TotalAvg = 0,AvgTime = [],rpArr = [],rpStd = [];
var std = 0;
var curMonth = null;
var AvgCount = 0;
var rpArrCount = 0;
function AllCalc(){
	if (stock1str.length > stock2str.length) {
		iLength = stock2str.length;
	}
	else if(stock1str.length < stock2str.length){
		iLength = stock1str.length;
	}
	else if(stock1str.length === stock2str.length){
		iLength = stock1str.length;
	}
	function rCalc(p10,p11,p20,p21){
		r1 = math.log(p10/p11);
		r2 = math.log(p20/p21);
		rpSum += 0.5*r1+0.5*r2;
		rpArr[rpArrCount] = 0.5*r1+0.5*r2;
		rpArrCount += 1;
	}

	for (var i = 0; i < iLength - 1; i++) {

		curdate1 = new Date(stock1str[i][0]);
		curdate2 = new Date(stock2str[i][0]);
		if (curMonth === null) {
			if (iLength === stock1str.length) {
				curMonth = curdate1.getMonth();
				curYear = curdate1.getFullYear();
			}
			else{
				curMonth = curdate2.getMonth();
				curYear = curdate2.getFullYear();
			}
		}
		if (iLength === stock1str.length) {
			judgeUsingDate = curdate1;
		}
		else{
			judgeUsingDate = curdate2;
		}
		if(curdate1.getTime() === curdate2.getTime() && curMonth != curdate1.getMonth() || (curdate1.getFullYear() === 2010 && curdate1.getMonth() === 0 && curdate1.getDate() === 5 || curdate2.getFullYear() === 2010 && curdate2.getMonth() === 0 && curdate2.getDate() === 5)){
			AvgPerMonth[AvgCount] = rpSum / (daysInMonth(curdate1.getFullYear(),curMonth));
			AvgTime[AvgCount] = curYear + "年" + (curMonth+1) + "月平均報酬(年化): ";
			rpStd[AvgCount] = math.std(rpArr) * math.sqrt(12);
			AvgCount += 1;
			rpSum = 0;
			rpArrCount = 0;
			curMonth = curdate1.getMonth();
			curYear = curdate1.getFullYear();
			rCalc(stock1str[i][1],stock1str[i+1][1],stock2str[i][1],stock2str[i+1][1]);
		}
		else if(curdate1.getTime() === curdate2.getTime() && curMonth === curdate1.getMonth()){
			rCalc(stock1str[i][1],stock1str[i+1][1],stock2str[i][1],stock2str[i+1][1]);
		}
		else{
			var stockTemp1,stockTemp2,funcParam;
			if (curdate1.getTime() > curdate2.getTime()) {
				funcParam = "1";
			}
			else{
				funcParam = "2";
			}
			for (var j = i; j < iLength-1; j++) {
				if (curdate1.getTime() > curdate2.getTime()) {
					curdate1 = new Date(stock1str[j][0]);
					stockTemp1 = stock1str[j][1];
					stockTemp2 = stock1str[j+1][1];
				}
				else if(curdate1.getTime() < curdate2.getTime()){
					curdate2 = new Date(stock2str[j][0]);
					stockTemp1 = stock2str[j][1];
					stockTemp2 = stock2str[j+1][1];
				}
				else{
					break;
				}
			}
			if (funcParam === "1") {
				rCalc(stockTemp1,stockTemp2,stock2str[i][1],stock2str[i+1][1]);
			}
			else if(funcParam === "2"){
				rCalc(stock1str[i][1],stock1str[i+1][1],stockTemp1,stockTemp2);
			}
		}
	}

	var AvgMOpt = "";
	var AvgToYear = [];
	for (var i = 0; i < AvgPerMonth.length; i++) {
		AvgToYear[i] = AvgPerMonth[i]*12;
		AvgMOpt += AvgTime[i] + "	" + (AvgPerMonth[i]*12*100).toFixed(4) + "%。	風險標準差為：" + (rpStd[i]*100).toFixed(4) + "%<br>";
	}
	std = math.std(AvgToYear)*math.sqrt(12)*100;
	document.getElementById("Avgmonth-opt").innerHTML = AvgMOpt ;
}

function loadphp(str1,str2){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			var type = this.getResponseHeader("Content-Type");
			var catchJSON = JSON.parse(this.responseText);
			var temp = null ;
			stock1json = catchJSON.obj1;
			stock2json = catchJSON.obj2;
			convertTostring(stock1json,"1");
			convertTostring(stock2json,"2");
			AllCalc();
		}
	};
	xhttp.open("GET", "csvdecrypt.php?s1="+str1+"&s2="+str2, true);
	xhttp.send();
}

function startCompare() {
	var stock1 = document.getElementById('stock1-input');
	var stock2 = document.getElementById('stock2-input');
	var s1Value = stock1.value;
	var s2Value = stock2.value;
	loadphp(s1Value,s2Value);
}
