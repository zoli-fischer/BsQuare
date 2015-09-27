//include helper functions
Ti.include('helper.js');

//on submit form
function onSubmit() {
	if ( isValidCPR( $.cpr_number.value ) ) {
		alert('Valid CPR number.');
	} else {
		$.cpr_number.focus();
		alert('Please insert a valid CPR number.');
	}
};

$.index.open();
