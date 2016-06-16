var departments = [
 ['AMST', 'American Studies'],
 ['ANTH', 'Anthropology'],
 ['ART', 'Art and Art History'],
 ['ASIA', 'Asian Languages and Cultures'],
 ['BIOL', 'Biology'],
 ['CHEM', 'Chemistry'],
 ['CHIN', 'Chinese'],
 ['CLAS', 'Classics'],
 ['COMP', 'Computer Science'],
 ['ECON', 'Economics'],
 ['EDUC', 'Educational Studies'],
 ['ENGL', 'English'],
 ['ENVI', 'Environmental Studies'],
 ['FREN', 'French and Francophone Studies'],
 ['GEOG', 'Geography'],
 ['GEOL', 'Geology'],
 ['GERM', 'German Studies'],
 ['HISP', 'Hispanic and Latin American Studies'],
 ['HIST', 'History'],
 ['INTD', 'Interdisciplinary Studies'],
 ['INTL', 'International Studies'],
 ['JAPA', 'Japanese'],
 ['LATI', 'Latin American Studies'],
 ['LING', 'Linguistics'],
 ['MATH', 'Mathematics'],
 ['MCST', 'Media and Cultural Studies'],
 ['MUSI', 'Music'],
 ['NEUR', 'Neuroscience Studies'],
 ['PHIL', 'Philosophy'],
 ['PE', 'Physical Education'],
 ['PHYS', 'Physics and Astronomy'],
 ['POLI', 'Political Science'],
 ['PSYC', 'Psychology'],
 ['RELI', 'Religious Studies'],
 ['RUSS', 'Russian'],
 ['SOCI', 'Sociology'],
 ['THDA', 'Theatre and Dance'],
 ['WGSS', "Women's, Gender, and Sexuality Studies"]
];

$(document).ready(function(){
	var perRow=5;
	var rows=Math.floor(departments.length/perRow);
	var deptTable=$("#departments");
	for(i=0; i<departments.length+perRow; i+=perRow){
		var row="<tr>";
		for(j=0; j<perRow && i+j<departments.length; j++){
			var dept=departments[i+j];
			row+="<td>";
			row+='<input type="checkbox" onchange="deptToggle(this.value)" value='+dept[0] +'> ';
			row+=dept[1]+"</td>";
		}
		row+="</tr>"
		deptTable.append(row);
	}
});


var deptFilter=""

function deptToggle(dept){
	if(deptFilter.includes(dept)){
		deptFilter= deptFilter.replace(dept+"|", "");
	} else{
		deptFilter+=dept+"|";
	}
	deptSearch();
}

function deptSearch(){
	var search="("+deptFilter.slice(0,-1)+")";
	table.column(0).search(search, true).draw();
}