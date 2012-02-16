<pre>
<?php
	$K_CSV_SOURCE = 'YOUR_GOOGLE_SPREADSHEET_URL_HERE';
	$K_NAME_INDEX = 0;
	$K_PROGRAM_INDEX = 1;
	$K_COUNTRY_INDEX = 4;
	$K_UNIVERSITY_INDEX = 5;
	$K_FIELDS_TO_KEEP = array($K_NAME_INDEX, $K_PROGRAM_INDEX, $K_COUNTRY_INDEX, $K_UNIVERSITY_INDEX);

	$raw_csv = file_get_contents($K_CSV_SOURCE);
	$student_data_array = explode("\n", $raw_csv);
	foreach ($student_data_array as &$student_data) {
		$student_data = str_getcsv($student_data);	
	}
	array_shift($student_data_array);	// get rid of table headers
	
	foreach ($student_data_array as &$student_data) {
		$useful_student_data = array();
		foreach ($K_FIELDS_TO_KEEP as $field_to_keep) {
			if(isset($student_data[$field_to_keep])) {
				array_push($useful_student_data, $student_data[$field_to_keep]);
			}
		}	
		$student_data = $useful_student_data;
	}
	
	print_r($student_data_array);
?>
</pre>
