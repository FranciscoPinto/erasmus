var jsonPath = "students.php"
var map;
var geocoder;
var queryTries = 50;
var queryTimeout = 100;


function sleep(milliSeconds){
	var startTime = new Date().getTime();				     // get the current time
	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}

function initialize() {
    var myOptions = {
        center: new google.maps.LatLng(41.1782, -8.5956),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	geocoder = new google.maps.Geocoder();
}

function loadPoints() {

    $.ajax({
        url: jsonPath,
        dataType: 'json',
        data: '',
        success: function (data) {
            console.log('Data extracted:' + data);

			$.each(data, function(index, student) {
				console.log('address: ' + student[0] + ' , ' + student[1]);
				setTimeout( addMarker(student), queryTimeout * index);
			});
        },
        error: function (data) {
            console.log('Error loading markers' + data);
        }
    });
	console.log('finish');
}

function addMarker( student ) {

	geocoder.geocode( { 'address': student[3] }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
				var delta = Math.pow(10, -3);
				var lat = results[0].geometry.location.lat() + (Math.random() * (2 * delta)) - delta;
				var lng = results[0].geometry.location.lng() + (Math.random() * (2 * delta)) - delta;
				var randPosition = new google.maps.LatLng(lat, lng);
				
				var marker = new google.maps.Marker({
				map: map,
				position: randPosition,
				cursor: student[0] + ', ' + student[1], 
				title: student[0] + ', ' + student[1],
				animation: google.maps.DROP
			});
			
				var contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">' + student[3] + ', ' + student[2] + '</h2>'+
				'<div id="bodyContent">'+
				'<p>' + results[0].address_components[0].long_name +  '</p>' +
				'</div>'+
				'</div>';
				var infowindow = new google.maps.InfoWindow({ content: contentString });
				
			 google.maps.event.addListener(marker, "click", function() {
				map.panTo(results[0].geometry.location);
				infowindow.open(map,marker);
			});
			
			/*
			google.maps.event.addListener(marker, "mouseout", function() {
				marker.setTitle(student[0] + ', ' + student[1]);
			});
			*/

		}
	});
}
