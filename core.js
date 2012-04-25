// tweet function via: http://adoholic.com/web-design/how-to-make-a-custom-tweet-button/
function tweetpopup(txt) 
{
	// Woo%20I%20just%20used%20Where%20I%20go%20to%20save%20my%20location.%20/via%20%4012devsofxmas
	window.open( "http://twitter.com/share?url=http://12devsofxmas.co.uk&text="+txt+"&count=none/", "tweet", "height=450,width=550,resizable=1" ) 
}

/***********************************************************************************
									GEOLOCATION
***********************************************************************************/

// the callback function for the getCurrentPosition function
function userLocation(position)
{
	var lat = position.coords.latitude,
		lng = position.coords.longitude;
		
	show_address(lat,lng);	
}

// A function to catch any errors and display them to the user.
function handleError(error) {
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}

// Using the Yahoo YQL to get the address from the latitude and longitude position
// displays the result in the web page.
function show_address(lat, lng)
{
   	// Yahoo API 
	// http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%20%3D%20%22"+ll+"%22%20and%20gflags%3D%22R%22&format=json&callback=?
	var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%20%3D%20%22"+lat+","+lng+"%22%20and%20gflags%3D%22R%22&format=json";
	
	$.getJSON( url , function(data) {
		
		var loc_data = data.query.results.Result,
			locale = loc_data.street + ", " + loc_data.city + ", " + loc_data.country;
			
		$("article h3 em").html( locale );		
	});	

}

// Checking for geolocation support and then performing the function
if( navigator.geolocation )
{
	// setting a decent timeout value
	var timeoutVal = 10 * 1000 * 1000;
	// the geolocation call
  	navigator.geolocation.getCurrentPosition(
    	userLocation, 
    	handleError,
    	{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
  	);	
}
else 
{
  alert("Sorry, Geolocation is not supported by this browser");
}


/***********************************************************************************
									WEB STORAGE
***********************************************************************************/

// The storage event handler, this will fire if there is data stored to the browser but in another window!
function storageEvent(e) {
  	e = event || window.event; // give IE8 some love
  
	alert("key " + e.key);
    alert("newValue " + e.newValue);
}

// On storage events.
if (window.attachEvent) { // ::sigh:: IE8 support
   window.attachEvent('onstorage', storageEvent);
} else {
    window.addEventListener('storage', storageEvent, false);
}

// get the previously stored data from localStorage
// note: if there is no data stored the variables will just return as NULL not throw an error
var sName = localStorage.name,
	sLocArr = localStorage.locations;
	
// Check if there have been previously stored locations then either set up new array or parse the stored array using JSON
if( !sLocArr )
	sLoc = new Array();
else
	sLoc = JSON.parse( localStorage.locations );

/***********************************************************************************
									DRAG & DROP
***********************************************************************************/

// Set up the drag elements with dragstart
var dragItems = document.querySelectorAll('[draggable=true]');

for (var i = 0; i < dragItems.length; i++) {
  addEvent(dragItems[i], 'dragstart', function (event) {
    // store the ID of the element, and collect it on the drop later on
    event.dataTransfer.setData('Text', this.id);
  });
}

// Drop functionality
var drop = document.querySelectorAll('#twitter');

// Tells the browser that we *can* drop on this target
addEvent(drop, 'dragover', cancel);
addEvent(drop, 'dragenter', cancel);

addEvent(drop, 'drop', function (e) 
{
   	e.preventDefault();
  	
  	var elem = e.dataTransfer.getData('Text');
  	
	tweetpopup( $("#"+elem).text() );
	
	return false;
});

function cancel(e) 
{
  	e.preventDefault();

 	return false;
}


/***********************************************************************************
							PUTTING IT ALL TOGETHER
***********************************************************************************/

// Functions that act on the DOM.
$(document).ready( function () {
	// Clear the storage
	$("a[href=#clearStorage]").click( function () {
		e.preventDefault();
		localStorage.clear();
	});

	if( sName )
		$("#store-name").hide();
	else
		$("#welcome").hide();
	
	// Update the last visit text
	$("h2#welcome em").text( sName );
	//	sLoc
	var i = 0,
		output = "";
	for (i=0;i<=sLoc.length-1;i++)
	{
		output += "<li>" + sLoc[i] + "</li>";
	}
	$("aside ul").html( output );

	$("a[href=#saveLocation]").click( function (e) {
		e.preventDefault();
		
		// if name is not already set
		if( !sName )
		{
			// Store the username that is in the input box
			var username = $("input#username").val();
			localStorage.name = username;
		}
		
		// get the time and date and store it in an array with the location...
		var d = new Date(),
			h = d.getHours(),
			m = d.getMinutes(),
			day = d.getDate(),
			mth = d.getMonth() + 1,
			where = $("article h3 em").text(),
			locNew = where+" at "+h+":"+m+" "+day+"/"+mth;
			
		// Store the location based on what's been stored from this visit in the article header
		sLoc.push( locNew );
		localStorage.locations = JSON.stringify( sLoc );
		// tell the user their details have been stored
		alert( "Thanks, your location has been stored...");
		
	});
	
});
