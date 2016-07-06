var table;

//Load a table by default
$(document).ready(function(){
    loadTable(courses2016fall);
    selectTable("2016fall");
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
            { title: "Dept."},
            { title: "Number" },
            { title: "Title" },
            { title: "Days" },
            { title: "Time" , "width": "60px"},
            { title: "Location" },
            { title: "Professor" },
            { title: "Space" , "width": "1px"},
            { title: "Gen. Ed.", "width": "1px"}, //Column will auto-expand to minimum size needed to fit smallest word
            { title: "Qs" , "visible": false },
            { title: "GenEdTags" , "visible": false },
            { title: "CRN" , "visible": false}
        ]
    });

    //Re-search to preserve old search parameters
    search();
}

function search(){
    deptSearch();
    genEdSearch();
    labsSearch();
    spaceSearch();
    duplicateSearch();

}


// Load musc buttons
$(document).ready(function(){
    var miscRow=$("#miscOptions");
    var row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="labsToggle()"> ';
    row+="<span>";
    row+="Hide labs</span></label></div></td>";
    miscRow.append(row);

    row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="spaceToggle()"> ';
    row+="<span>";
    row+="Hide full classes</span></label></div></td>";
    miscRow.append(row);

    
    row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="duplicateToggle()"> ';
    row+="<span>";
    row+="Hide extra sections</span></label></div></td>";
    miscRow.append(row);

    var scroller=$("#side-scroller");
    row="<div class=press-button><label>";
    row+='<input type="button" onclick="returnToTop()"> ';
    row+="<span>";
    row+="Return to top</span></label></div></td>";
    scroller.append(row);

});

function returnToTop(){ 
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

var hideFull=false;
function spaceToggle(){
    hideFull=!hideFull;
    spaceSearch();
}

function spaceSearch(){
    if(hideFull){
        table.column(7).search("([1-9]0/|[1-9]/)", true, false).draw();
    } else{
        table.column(7).search("").draw();
    }
}

var hideAlts=false;
function duplicateToggle(){
    hideAlts=!hideAlts;
    duplicateSearch();
}

function duplicateSearch(){
    if(hideAlts){
        table.column(1).search("(-01|94-)", true, false).draw();
        //Search for first section, or a topics-course number (meaning 294-01 and 294-02 are different)
    } else{
        if(!labs){
            labsSearch();
        } else{
            table.column(1).search("").draw();
        }
    }

}

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

    if(descCRN[CRN] != null){
        var url="https://webapps.macalester.edu/utilities/scheduledetail/coursedetail.cfm?CRN="+CRN;
        //description="<iframe width=100% src="+url+"></iframe>";
        description=descCRN[CRN];
        //debug("sending ajax");
    }


    var parentRow=$("#"+eleID).parents().eq(1);



    var leftPad=2;
    var descWidth=4;
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

function selectTable(name){
    $(".button-selected").removeClass("button-selected");
    $("#button"+name).addClass("button-selected");
}
