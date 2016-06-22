var table;

//Load a table by default
$(document).ready(function(){
    loadTable(courses2016fall);
    addDetails();
});


//Load a table
//Called by functions auto-generated for each data table
function loadTable(data){
    table = $('#classTable').DataTable( {
        data: data,
        "paging": false,
        "dom": 'tipr',
        columns: [
            { title: "Department" },
            { title: "Number" },
            { title: "Title" },
            { title: "Days" },
            { title: "Time" },
            { title: "Location" },
            { title: "Professor" },
            { title: "Space" },
            { title: "Gen. Ed."},
            { title: "Qs" },
            { title: "GenEdTags" },
            { title: "CRN"}
        ]
    });
    table.columns([9,10,11]).visible(false);

    //Re-search to preserve old search parameters
    search();
}

function search(){
    deptSearch();
    genEdSearch();
    labsSearch();
}


// Load Labs button
$(document).ready(function(){
    var labsSpace=$("#miscOptions");
    var row="<td>";
    row+='<input type="checkbox" onchange="labsToggle()"> ';
    row+="Hide labs</td>";
    labsSpace.append(row);
});

var labs=true;
function labsToggle(){
    labs=!labs;
    labsSearch();
}

function labsSearch(){
    if(labs){
        table.column(1).search("").draw();
    } else{
        table.column(1).search("-[^L]", true).draw();
    }
}

function debug(text){
    $("#debug").append(text+" ");
}

function expandDetails(eleID){
    // If opened, close it
    if($("#div"+eleID).length){
        $("#div"+eleID).on("hidden.bs.collapse", function(){
            $("#row"+eleID).remove();
        });
        $("#div"+eleID).collapse("hide");
        return;
    }


    var shortened=eleID.slice(0,-3);

    var description="No description found.";
    if(shortened in descriptions){
        description=descriptions[shortened];
    }

    var CRN=$("#"+eleID).attr("crn");
    //debug(CRN);

    if(CRN != 0){
        var url="https://webapps.macalester.edu/utilities/scheduledetail/coursedetail.cfm?CRN="+CRN;
        //description="<iframe width=100% src="+url+"></iframe>";
        description=descCRN[CRN];
        //debug("sending ajax");
    }


    var parentRow=$("#"+eleID).parents().eq(1);



    var leftPad=2;
    var descWidth=1;
    var rightPad=9-leftPad-descWidth;
    parentRow.after("<tr id=row"+eleID+" role=row> <td colspan="+leftPad+"></td><td colspan="+descWidth+"><div id=div"+eleID
        +" class=collapse>"+description+"</div></td><td colspan="+rightPad+"></td> </tr></div>");
    $("#row"+eleID).attr("class", "details");
    $("#div"+eleID).collapse("show");

}

function addDetails(){
    var allRows = table.rows().nodes().to$();
    allRows.click(function(row){
        var id = $(this).children().eq(0).children().eq(0).attr("id");
        expandDetails(id);
    });

}