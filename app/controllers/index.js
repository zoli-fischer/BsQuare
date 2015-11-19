var args = arguments[0] || {};
	self = this,
	view = this.getView();
	
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
};

//continue with cpr valid or not
function cprValidated( valid ) {
	
	//check if valid
	if ( valid ) {
		
		Alloy.Globals.user.cpr( $.cpr_number.value );
		
		//show start
		Alloy.Globals.showMain( { parent: self } );
		
		//hide activity indicator
		Alloy.Globals.activityIndicatorWnd.hide();
	
	} else {
		//hide activity indicator
		Alloy.Globals.activityIndicatorWnd.hide();
	
		$.cpr_number.focus();
		alert(L('insert_valid_cpr'));
	};
	
};

//ajax request client
var xhr = null;

//on submit form
function doSubmit() {
	//check if cpr format is valid
	if ( isValidCPR( $.cpr_number.value ) ) {
		
		//validate cpr with ajax call from cprvalidering.apiary.io if internet access available	    
		if ( Titanium.Network.online ) {
			
			//show activity indicator
			Alloy.Globals.activityIndicatorWnd.show({ 
				message: L('app_loading'),
				onBack: function() {		
					//abort ajax call
					xhr.abort();
					
					//hide activity indicator
					this.hide();
				}
			});
			
			//abort ajax call
			if ( xhr )
				xhr.abort();
			
			//create ajax call
			xhr = Ti.Network.createHTTPClient({
				onload: function(e) {
					var cpr_valid = false;
					try {
						var json = JSON.parse(this.responseText);	
						cpr_valid = json.person && json.person.valid && json.person.valid === true;			
					} catch(error) {}
					
					//set cpr valid/!
					cprValidated( cpr_valid );
				},
				onerror: function(e) {
					//if no internet we assume the cpr is valid if the format is valid
					cprValidated( true );
				}
			});
			
			//http://zoltan.web2it.net/cpr-validate.php?cpr=#CPR# -> http://cpr-validering.dk/api/api/validate
			xhr.open('GET',Alloy.CFG.cprApiUrl+"&cpr="+$.cpr_number.value, true );
			xhr.send();	
		} else {
			
			//if no internet we assume the cpr is valid if the format is valid
			cprValidated( true );
		}
		
	} else {
		cprValidated( false );	
	}
};

//show help
function showHelp() {
	Alloy.Globals.showHelp( { parent: self } );
};

//on window open
view.addEventListener("open", function(evt) { 
	//set action bar
	Alloy.Globals.setActionBar( self );
	
	//close opener
	if ( self.parent )
		self.parent.getView().close();
});

//check if user logged
if ( Alloy.Globals.user.is() ) {
	//show start
	Alloy.Globals.showMain();
} else {
	view.open();
}
