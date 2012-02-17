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
				
				var error;
				var timeout = 0;
				do {
					error = false;
					geocoder.geocode( { 'address': student[3] }, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location,
							title: student[0] + ' , ' + student[1]
					});
					} else {
						console.log("Geocode was not successful for the following reason: " + status);
						error = true; 
						if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
							timeout++;
							console.log('timeout: ' + timeout);
							sleep(queryTimeout);		
							}
						}
					});
					
				}
				while (error == true && timeout < queryTries);
			
			});
        },
        error: function (data) {
            console.log('Error loading markers' + data);
        }
    });
	console.log('finish');
}
