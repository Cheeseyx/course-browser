var distributionData = [
	["Natural science and mathematics", "Natural Sciences"],
	["Social science", "Social Sciences"],
	["Humanities", "Humanities"],
	["Fine arts", "Fine Arts"]
];

$(document).ready(function(){
	var distBox=$("#distribution");
	for(i=0; i<distributionData.length; i++){
		var button="<td>";
		button+="<div class=check-button><label";
		button+=' title="Coming soon!"';
		button+='><input type="checkbox" id="distButton'+distributionData[i][0]+'" onchange="distributionToggle(this.value)" value='+distributionData[i][0]+'"';

		//button+=' disabled';
		button+='> ';
		button+="<span>"+distributionData[i][1] +"</span></label></div></td>";
		distBox.append(button);
	}

});

var distributionFilter="";


function distributionToggle(filter){

	if(distributionFilter.includes(filter)){
		distributionFilter= distributionFilter.replace(filter+"|", "");
	} else{
		distributionFilter+=filter+"|";
	}
	distributionSearch();
}

function distributionSearch(filter){
	var search="("+distributionFilter.slice(0,-1)+")";
	table.column(12).search(search, true).draw();
}