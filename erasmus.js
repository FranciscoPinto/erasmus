var jsonPath = "students.php"
var map;
var geocoder;
var queryTries = 50;
var queryTimeout = 50;
var totalMarkers = 0;
var numberStudents = 0;

function initialize() {
    var myOptions = {
        center: new google.maps.LatLng(41.1782, -8.5956), // FEUP
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
			console.log('\n ' + data.length + ' students ');
			numberStudents = data.length - 1;

			$.each(data, function(index, student) {
				var timeout = queryTimeout * index;
				setTimeout( function(){addMarker(student, timeout);}, timeout);
			});
        },
        error: function (data) {
            console.log('Error loading markers' + data);
        }
    });
}

function addMarker( student , timeout) {

	geocoder.geocode( { 'address': student[3] }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var delta = Math.pow(10, -3);
			var lat = results[0].geometry.location.lat() + (Math.random() * (2 * delta)) - delta;
			var lng = results[0].geometry.location.lng() + (Math.random() * (2 * delta)) - delta;
			var randPosition = new google.maps.LatLng(lat, lng);
			
			console.log('(' + totalMarkers + '/' + numberStudents + ')' + ' Adding ' + student[0] + ' to ' + student[3] + ', ' + student[2] +  ' ...');
			
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
			'<h2 id="firstHeading" class="firstHeading">' + student[0] + ', ' + student[1] + '</h2>'+
			'<div id="bodyContent">'+
			'<p>' + results[0].address_components[0].long_name +  '</p>' +
			'</div>'+
			'</div>';
			var infowindow = new google.maps.InfoWindow({ content: contentString });
			
		 google.maps.event.addListener(marker, "click", function() {
			map.panTo(results[0].geometry.location);
			infowindow.open(map,marker);
		});
		
		totalMarkers++;
		}
	else if (status == google.maps.GeocoderStatus.ZERO_RESULTS)
		totalMarkers++;
	else
		setTimeout( function(){addMarker(student, timeout);}, timeout);
	});
}
