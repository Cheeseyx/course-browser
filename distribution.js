var distributionData = [
	["NATURAL", "Natural Sciences"],
	["SOCIAL", "Social Sciences"],
	["HUMANITY", "Humanities"]
];

$(document).ready(function(){
	var distBox=$("#distribution");
	for(i=0; i<distributionData.length; i++){
		var button="<td>";
		button+="<div class=check-button><label";
		button+=' title="Coming soon!"';
		button+='><input type="checkbox" id="distButton'+distributionData[i][0]+'" onchange="distributionToggle(this.value)" value='+distributionData[i][0]+'"';

		button+=' disabled';
		button+='> ';
		button+="<span>"+distributionData[i][1] +"</span></label></div></td>";
		distBox.append(button);
	}

});

var distributionFilter="";


function distributionToggle(filter){
	if(distributionFilter === filter){
		//Current filter reselected, being turned off
		distributionFilter="";

	}else{
		if(distributionFilter === ""){
			//No filter, being turned on
			//Nothing else to be done here, currently
		}else{
			//Overwrite current filter
			$("#distButton"+distributionFilter).prop('checked', false);
		}
		distributionFilter=filter
	}
}