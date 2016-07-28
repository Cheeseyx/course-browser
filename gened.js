var genEdData = [
	["INTERNAT", "Internationalism"],
	["Q", "Quantitative Thinking"],
	["USID", "U.S. Identities and Differences"],
	["WA", "Writing A"],
	["WC", "Writing C"],
	["WP", "Writing P"]
];

$(document).ready(function(){
	var genEdBox=$("#gened");
	for(i=0; i<genEdData.length; i++){
		var button="<td>";
		button+="<div class=check-button><label>";
		button+='<input type="checkbox" onchange="genEdToggle(this.value)" value='+genEdData[i][0] +'> ';
		button+="<span>"+genEdData[i][1] +"</span></label></div></td>";
		genEdBox.append(button);
	}

	var type="<td>";
	type+="<div class=check-button><label>";
	type+='<input type="checkbox" onchange="typeToggle()"><span>';
	type+="Only classes meeting all selected Gen. Ed. Categories </span></label></div></td>";
	$("#miscOptions").append(type);

});

var genEdFilter="";
var searchAny=true;

function typeToggle(){
	searchAny=!searchAny;
	genEdSearch();
}

function genEdToggle(filter){
	if(genEdFilter.includes(filter)){
		genEdFilter= genEdFilter.replace(filter+"|", "");
	} else{
		genEdFilter+=filter+"|";
	}
	genEdSearch();
}

function genEdSearch(){
	if(searchAny){
		var search="("+genEdFilter.slice(0,-1)+")";
		table.column(10).search(search, true).draw();
	} else{
		var search = genEdFilter.split("|").join(" ");
		table.column(10).search(search, false, true).draw();
	}
}