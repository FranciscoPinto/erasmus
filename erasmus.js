var jsonPath = "students.php"
var map;
var geocoder;

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

			$.each(data, function(name, course, country, university) {
				geocoder.geocode( { 'address': university + ' , ' + country}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					title: name + ' , ' + course
				});
				} else {
				alert("Geocode was not successful for the following reason: " + status);
				}
				});
			
			});
        },
        error: function (data) {
            console.log('Error loading markers' + data);
        }
    });
	console.log('finish');
}
