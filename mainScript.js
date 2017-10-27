let table;

//Load a table by default
$(document).ready(function(){
    loadTable(courses2018spring);
    selectTable("2018spring");
    addDetails();
});


//Load a table
//Called by functions auto-generated for each data table
function loadTable(data){

    for(let i = 0; i<data.length; i++){
        let row = data[i];
        let crnVal = row[11];
        data[i][12] = '';
        if(!(distData[crnVal] === undefined))
            data[i][12] = distData[crnVal];
    }

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
            { title: "CRN" , "visible": false},
            { title: "Dist" , "visible": true}
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


// Load misc buttons
$(document).ready(function(){
    let miscRow = $("#miscOptions");

    // Hide/show labs
    let row = "<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="labsToggle()"> ';
    row+="<span>";
    row+="Hide labs</span></label></div></td>";
    miscRow.append(row);

    // Hide full sections
    row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="spaceToggle()"> ';
    row+="<span>";
    row+="Hide full sections</span></label></div></td>";
    miscRow.append(row);

    // Hide extra sections
    row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="duplicateToggle()"> ';
    row+="<span>";
    row+="Hide extra sections</span></label></div></td>";
    miscRow.append(row);

    // Hide morning classes
    row="<td>";
    row+="<div class=check-button><label>";
    row+='<input type="checkbox" onchange="morningToggle()"> ';
    row+="<span>";
    row+="Hide morning classes</span></label></div></td>";
    miscRow.append(row);



    const scroller = $("#side-scroller");
    row="<div class=press-button><label>";
    row+='<input type="button" onclick="returnToTop()"> ';
    row+="<span>";
    row+="Return to top</span></label></div></td>";
    scroller.append(row);


    // scroller.hide();
    // Hide scroller by default disabled along with fade in/out (see note below)

});

function returnToTop(){ 
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

// Hide morning classes
let hideMorning=false;
function morningToggle(){
    hideMorning = !hideMorning;
    timeSearch();
}
function timeSearch(){
    if(hideMorning){
        table.column(4).search("pm").draw();
    } else{
        table.column(4).search("").draw();
    }
}

// Hide full sections
let hideFull = false;
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

// Hide labs and extra section listings
let hideAlts = false;
function duplicateToggle(){
    hideAlts=!hideAlts;
    duplicateSearch();
}
let labs = true;
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
    console.log(text);
}

function expandDetails(eleID){
    // If opened, close it
    let target = $("#div"+eleID);
    if(target.length){
        target.on("hidden.bs.collapse", function(){
            $("#row"+eleID).remove();
        });
        target.collapse("hide");
        return;
    }


    const shortened = eleID.slice(0, -3);

    let description = "No description found.";
    if(shortened in descriptions){
        description=descriptions[shortened];
    }


    const CRN = $("#" + eleID).attr("crn");
    //debug(CRN);

    if(descCRN[CRN] != null){
        //const url = "https://webapps.macalester.edu/utilities/scheduledetail/coursedetail.cfm?CRN=" + CRN;
        //description="<iframe width=100% src="+url+"></iframe>";
        description=descCRN[CRN];
        //debug("sending ajax");
    }


    const parentRow = $("#" + eleID).parents().eq(1);



    const leftPad = 2;
    const descWidth = 4;
    const rightPad = 10 - leftPad - descWidth;
    parentRow.after("<tr id=row"+eleID+" role=row> <td colspan="+leftPad+"></td><td colspan="+descWidth+"><div id=div"+eleID
        +" class=collapse>"+description+"</div></td><td colspan="+rightPad+"></td> </tr></div>");
    $("#row"+eleID).attr("class", "details");
    $("#div"+eleID).collapse("show");

}

function addDetails(){
    const allRows = table.rows().nodes().to$();
    allRows.click(function(row){
        const id = $(this).children().eq(0).children().eq(0).attr("id");
        expandDetails(id);
    });

}

function selectTable(name){
    $(".button-selected").removeClass("button-selected");
    $("#button"+name).addClass("button-selected");
}

/*

// Fade in/out disabled due to issue where scrolling could produce a visual bug
// (The appearance of a second Return To Top button, which wasn't in a fixed position and couldn't be interacted with)

var scrollShown=false;

$(window).scroll(function(){


    var scroll= $(window).scrollTop();
    if(scroll > 40){
        if(scrollShown==false){
            $("#side-scroller").fadeIn();
            scrollShown = true;
        }
    } else {
        $("#side-scroller").fadeOut();
        scrollShown = false;
    }

}); // */