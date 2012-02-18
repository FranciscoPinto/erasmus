var jsonPath = "students.php"
var map;
var geocoder;
var queryTries = 50;
var queryTimeout = 150;
var totalMarkers = 0;
var numberStudents = 0;
var univNames   = new Object();
var univArray   = new Object();
var markersContent = new Object();

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
            console.log('Data extracted: \n' + data);
            console.log('\n ' + data.length + ' students ');
            numberStudents = data.length - 1;

            $.each(data, function (index, student) {

                var university = univNames[student[3]];
                if (university == null) {
                    console.log('null univ\n');
                    var timeout = queryTimeout;
                    setTimeout( function() { addMarker(student, timeout); }, timeout);
                }
                else                              				 // Name exists, marker exists
                    addStudent(university, student);			 // Almost always this is skipped                        
            });
        },
        error: function (data) {
            console.log('Error loading markers' + data);
        }
    });
}


function addStudent(universityName, student) {
    markersContent[universityName] += '<p> ' + student[0] + ' - ' + student[1] + '</p>';
	console.log('(' + totalMarkers + '/' + numberStudents + ')' + ' Adding ' + student[0] + ' to ' + student[3] + ', ' + student[2] +  ' ...');
	totalMarkers++;
}

function addMarker( student , timeout) {

	var university = univNames[student[3]];												// In the meantime, maybe we have the univ information?
    if (university != null) {
		addStudent(university, student);
		return;
	}
	
    geocoder.geocode({ 'address': student[3] }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            var universityName = results[0].address_components[0].long_name;
            univNames[student[3]] = universityName;
            if (!univArray.hasOwnProperty(universityName)) {							// Do we have a marker already?

                univArray[universityName] = '';
                console.log('(--/--) Adding University ' + universityName + ' to ' + student[2] + ' ...');

                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: universityName + ', ' + student[2],
                    animation: google.maps.DROP
                });


                
                var infowindow = new google.maps.InfoWindow({ content: '' });
                markersContent[universityName] = '';

                google.maps.event.addListener(marker, "click", function () {             // Click event, dynamically create content, open window
                    var contentString0 = '<div class="university" id="' + universityName + '">' +
				    '<div id="siteNotice">' +
				    '</div>' +
				    '<h2 id="firstHeading" class="firstHeading">' + universityName + ', ' + student[2] + '</h2>' +
				    '<div id="bodyContent">'
                    var contentString1 = '</div>' +
				    '</div>';
                    infowindow.setContent(contentString0 + markersContent[universityName] + contentString1);

                    map.panTo(results[0].geometry.location);
                    infowindow.open(map, marker);
                });
            }
            addStudent(univNames[student[3]], student);
        }
        else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            console.log('(--/--) Error adding ' + student[0]);
            totalMarkers++;
        }
        else {
            setTimeout(function () { addMarker(student, queryTimeout); }, queryTimeout);
        }
    });
}