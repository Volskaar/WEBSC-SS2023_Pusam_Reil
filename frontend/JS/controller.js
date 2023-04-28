//Starting point for JQuery init
$(document).ready(function () {
    loadAppointmentList();
});

//on click of every list item show details
$(document).on('click','.list-group-item',function(click){
    showDetail(click.target);
});

//global list of appointments stored for working with data
let appointments = new Array();

function loadAppointmentList() {
    //create ajax object with servicehandler.php as url
    //execute querypersonbyname with the input value as a parameter
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "queryAppointments", param: null},
        dataType: "json",
        async: true,
        //on success create html element list with information on display
        success: function (data) {
                for(let j=0; j<data.length; j++){
                    var appointment = data[j];
                    appointments.push(appointment);

                    let a = $("<a href='#' id='"+ appointment[0] +"' class='list-group-item list-group-item-action border-0 w-100'> </a>");
                    let div = $("<div class='d-flex w-100 justify-content-between'> </div>");
                    let h = $("<h5 class='mb-1'> " + appointment[1] + " </h5>"); //title
                    let sm = $("<small>" + appointment[3] + "</small>"); //creation date
                    let p = $("<p class='mb-1'>" + appointment[5] + "</p>"); //descr.
                    let t; //active

                    if(appointment[7]){
                        t = $("<small class='text-success'> active </small>");
                    }
                    else{
                        t = $("<small class='text-danger'> inactive </small>");
                    }

                    div.append(h);
                    div.append(sm);
                    a.append(div);
                    a.append(p);
                    a.append(t);

                    $('#appointmentList').append(a);
                }

            //test console print
            for(let i=0; i<appointments.length; i++){
                console.log(appointments[i]);
            }
        }
    });
}


function loadOptionsForAppointment(appID){
    let options = [];

    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "queryOptions", param: appID},
        dataType: "json",
        async: false,
        //on success returns list of text elements containing information about options
        success: function (data) {
            for(let i=0; i<data.length; i++){
                options.push(data[i]);
            }
        }
    });

    console.log(options);
    
    return options;
}


function showDetail(target){
    if(target.matches('a')){
        targetID = target.id -1;
        $('#detailBox').empty();
    
        //basic detail content box
        let card = $("<div class='card w-100 p-3 bg-light'> </div>");
        let h2 = $("<h2> " + appointments[targetID][1] + " </h2>");
        let h5 = $("<h5> Open: " + appointments[targetID][3] + " -> " + appointments[targetID][4] + "</h5>");
        let p1 = $("<p> " + appointments[targetID][5] + " </p>");
        let p2 = $("<p> Duration: " + appointments[targetID][6] + "min </p>");

        //checkbox form
        let form = $("<form> </form>");
        let name = $("<div> <label for='nameInput' class='ms-2'> Your Name: </label> <input type='text' class='form-control m-2' id='nameInput' placeholder='your name' required> </div>")
        let optionBox = $("<div class='m-2'> </div>");

        let p3 = $("<p class='m-2'> Available Options: </p>");

        //display options

        console.log(target.id);
        var options = loadOptionsForAppointment(target.id);
        console.log(options);
        let table = $("<table class='table'> </table>");
        let thead = $("<thead><tr> </tr></thead>");

        for(let i=0; i<options.length; i++){
            thead.append("<th scope='col'> " + options[i][1] + "</th>");
        }

        table.append(thead);
        optionBox.append(table);

        optionBox.append(p3);

        //---------------

        let comment = $("<textarea class='form-control' id='exampleFormControlTextarea1' placeholder='leave a comment ...'></textarea>")

        let submit = $("<button class='btn btn-primary m-2' type='submit'>Submit your pick</button>")

        //put together form
        form.append(name);
        form.append(p3);
        form.append(optionBox);
        form.append(comment);
        form.append(submit);

        //put together card
        card.append(h2);
        card.append(h5);
        card.append(p1);
        card.append(p2);
        card.append(form);

        $('#detailBox').append(card);
    }
}