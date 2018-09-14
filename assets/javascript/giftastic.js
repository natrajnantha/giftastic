var titlestr = "GifTastic";
var time = 0;
var colorList = ["text-primary", "text-danger", "text-success", "text-warning", "text-info", "text-secondary"];
var totalGif = 0;
var gifUrlList = [];
var firstTime = true;
var pageLimit = 84;
var currentPage = 1;
var totalPages = 0;

// This routine adds a new button based on the search string that the user entered. If the user clicks without entering a string, the code alerts the user to add a string
// if the user entry is mixed case or lower case, the code automatically converts to upper case to ensure consistency in user entry.
$("#btnAdd").on("click", function (e) {
    e.preventDefault();
    var userStr = $("#userText").val().trim();
    if (userStr != "") {
        if (firstTime) {
            $("#helpwrapper").remove();
            firstTime = false;
        }
        $("#userList").append("<li data-gifget='" + userStr.toUpperCase() + "' class='btn btn-info btn-outline-primary userBtnClass'>" + userStr.toUpperCase() + "</li>");
        $("#userText").val("");
    } else {
        alert("Input a Gif search string and click add !!!")
    }
});

// This routine executes when the user clicks the giphy button. The routine makes API call to giphy api. The user can limit the number of images thru the dropdown selection or by entering a valid number
// The maximum images is 25 and if the user keys in a value thats greater than 25, the routine alerts the user accordingly and resets the value back to 25. If no value is entered, then the default is 10.
$("#userList").on("click", 'li', function () {

    var gifSearchStr = $(this).attr("data-gifget");
    var gifLimit = $("#vl").val();

    if (isNaN(gifLimit)) {
        gifLimit = 10;
    }

    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        gifSearchStr + "&api_key=S8kkSnNe3LWY83lmsPDm91bBuOfL6Dnj&limit=" + gifLimit;

    console.log(queryURL);

    // Performing an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                // Dynamically create a div tag and attach all the images
                var gifDiv = $("<div class='col-lg-1'>");

                // Creating and storing an image tag. Store the still images in the img element. On mouseover the gif images will be animated further down in the logic.
                var gifImg = $('<img>');
                gifImg.attr("src", results[i].images.fixed_height_still.url);
                gifImg.addClass("imgstyle");
                gifImg.attr("data-index", totalGif);
                gifImg.attr("id", "imgid" + totalGif);
                gifImg.attr("data-toggle", "tooltip");
                gifImg.attr("title", "Rating : " + results[i].rating);


                //Store the still image, the animated gif and the rating in a 3 dimentional array.
                var templist = new Array();
                templist[0] = results[i].images.fixed_height_still.url;
                templist[1] = results[i].images.fixed_height.url;
                templist[2] = results[i].rating;
                gifUrlList.push(templist);
                totalGif++;

                // Appending the paragraph and image tag to the gifDiv
                gifDiv.append(gifImg);

                $(gifDiv).appendTo("#gifArea");
            }

            // Check if the total image element reached the page limit size if so then hide the next page images and increment boothstrap patination
            var totalItems = $("#gifArea .imgstyle").length;
            console.log("Number of items : " + totalItems);
            console.log("Page limit : " + pageLimit);

            $("#gifArea .imgstyle:gt(" + (pageLimit - 1) + ")").hide();
            totalPages = Math.ceil(totalItems / pageLimit);
            console.log("Total pages : " + totalPages);
            if (totalPages === 0) {
                totalPages = 1;
            }

            var grandTotal = pageLimit * currentPage; // Get the total number of items up to the page that was selected
            for (var i = grandTotal - pageLimit; i < grandTotal; i++) {
                $("#gifArea .imgstyle:eq(" + i + ")").show(); // Show items from the new page that was selected
            }

            $(".pagination").empty();
            $(".pagination").append('<li id="prev-page" class="page-item"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
            for (let i = 1; i <= totalPages; i++) {
                $(".pagination").append('<li class="page-item nbr-page"><a class="page-link" href="#">' + i + '</a></li>');
            }
            $(".pagination").append('<li id="next-page" class="page-item"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
            $(".pagination li:eq(" + currentPage + ")").addClass('active'); // Make new page number the 'active' page
        });
});


//Based on user selection in dropdown populate the text box
$(".dropdown-menu a").on("click", function () {
    var selText = $(this).text();
    $("#vl").val(selText);
});

// This routine checks if the user enty is more than the maximum limit and will reset with an alert if the limit exeeds
$("#vl").on("change", function () {
    if ($("#vl").val() > 25) {
        alert("Maximum limit is 25. You entered " + $("#vl").val() + " which is above the limit. Resetting to 25");
        $("#vl").val(25);
    }
})

//Below mouse over events will display the gif image with animation effect. The gif image is retreived from the local array and displayed in the img element
$("#gifArea").on("mouseenter", 'img', function () {
    var selGifIndex = $(this).attr("data-index");
    var selImg = $(this).attr("id");
    $("#" + selImg).attr("src", gifUrlList[selGifIndex][1]);
});

$("#gifArea").on("mouseleave", 'img', function () {
    var selGifIndex = $(this).attr("data-index");
    var selImg = $(this).attr("id");
    $("#" + selImg).attr("src", gifUrlList[selGifIndex][0]);
});

//This routine will start the timer interval to animate the Giftastic page header with random bootstrap colors.
window.onload = function () {
    intervalId = setInterval(count, 100);
};

// The below routine gets called every 100 millisecond to assign random colors to the page heading to provide an animation effect
function count() {
    var $titleHtm = "";
    $("#animTitle").empty();

    for (let i = 0; i < titlestr.length; i++) {
        var rndColor = Math.floor(Math.random() * colorList.length);
        $titleHtm = $('<h1 style="display:inline" class="' + colorList[rndColor] + '">' + titlestr[i] + '</h1>');
        $titleHtm.appendTo("#animTitle");
    }
    time++;
    if (time === titlestr.length) {
        time = 0;
    }
};

// The below code will provide the gif image rating as a tool tip when the mouse hovers over the image
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});


// The below 3 routines controls the pagination based on the page number click or the next /prev navigation clicks. The logic stores the page number of current page in focus as a global variable 
// and drives the bootstrap pagination element.
$(document).on("click", ".pagination li.nbr-page a", function (e) {
    e.preventDefault();
    var tag = $(this);
    if ($(this).hasClass('active')) {
        return false;
    } else {
        currentPage = tag.text(); // Get the current page number
        $(".pagination li").removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
        $(this).parent().addClass('active'); // Add the 'active' class status to the page that was clicked on
        $("#gifArea .imgstyle").hide(); // Hide all items in loop, this case, all the list groups
        var grandTotal = pageLimit * currentPage; // Get the total number of items up to the page number that was clicked on

        // Loop through total items, selecting a new set of items based on page number
        for (var i = grandTotal - pageLimit; i < grandTotal; i++) {
            $("#gifArea .imgstyle:eq(" + i + ")").show(); // Show items from the new page that was selected
        }
    }
});

$(document).on("click", "#next-page", function () {
    if (currentPage === totalPages) {
        return false;
    } else {
        currentPage++;
        console.log("Current page after increment " + currentPage);
        $(".pagination li").removeClass('active');
        $("#gifArea .imgstyle").hide();
        var grandTotal = pageLimit * currentPage;

        for (var i = grandTotal - pageLimit; i < grandTotal; i++) {
            $("#gifArea .imgstyle:eq(" + i + ")").show();
        }
        $(".pagination li:eq(" + currentPage + ")").addClass('active');
    }
});

$(document).on("click", "#prev-page", function () {
    console.log("Current page identified is " + currentPage);
    if (currentPage === 1) {
        return false;
    } else {
        currentPage--;
        console.log("Current page after decrement " + currentPage);
        $(".pagination li").removeClass('active');
        $("#gifArea .imgstyle").hide();
        var grandTotal = pageLimit * currentPage;

        for (var i = grandTotal - pageLimit; i < grandTotal; i++) {
            $("#gifArea .imgstyle:eq(" + i + ")").show();
        }
        $(".pagination li:eq(" + currentPage + ")").addClass('active');
    }
});