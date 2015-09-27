
//Check if string is valid cpr number
function isValidCPR( cpr ) {
	if ( typeof cpr != 'string' )
		return false;
	
	//trim string	
	cpr = cpr.trim();
	 
	//should have the dash
	if ( cpr.length == 11 )
		if ( cpr.indexOf('-') == 6 ) {
			cpr = cpr.replace('-','');
		} else {
			return false;
		}
	
	if ( cpr.length != 10 )
		return false;
	
	//is only numbers
	if ( !cpr.match(/^[0-9]+$/) )
		return false;
	
	var day = parseInt(cpr.substr(0, 2), 10),
    	month = parseInt(cpr.substr(2, 2), 10) - 1,
    	year = parseInt(cpr.substr(4, 2), 10),
    	date = new Date(year, month, day);
    	
	//validate date
    if ( date.getYear() !== year || date.getMonth() !== month || date.getDate() !== day )
        return false;
    
    return true;
}
