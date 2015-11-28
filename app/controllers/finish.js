var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {	
	//set action bar
	Alloy.Globals.setActionBar( self, false, false );
	
	var result = Alloy.Globals.user.result();
	
	//set finish text
	self.finish_text.text = String.format(L('finish_text'),result.score > 0 ? L('finish_result_'+result.score) : '',result.score_left.toFixed(0).toString()+'%',result.threshold_left.toFixed(0).toString()+' hz',result.score_right.toFixed(0).toString()+'%',result.threshold_right.toFixed(0).toString()+' hz');
});

//ajax request client
var xhr = null;

function doSend() {
	
	//show activity indicator
	Alloy.Globals.activityIndicatorWnd.show({ 
		message: L('finish_sending'),
		onBack: function() {		
			//abort ajax call
			xhr.abort();
			
			//hide activity indicator
			this.hide();
		}
	});
	
	//close view
	view.close();
		
	//abort ajax call
	if ( xhr )
		xhr.abort();
		
	//create ajax call
	xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			
			Alloy.Globals.activityIndicatorWnd.hide();
			
			alert(L('finish_sent'));
		},
		onerror: function(e) {
			
			Alloy.Globals.activityIndicatorWnd.hide();
			
			alert(L('finish_sending_error'));
		}
	});
		
	Titanium.API.info( Alloy.Globals.user.result_json() );
	
	xhr.open('GET',Alloy.CFG.sendResultApiUrl+"&cpr="+Alloy.Globals.user.cpr()+'&result='+Alloy.Globals.user.result_json(), true );
	xhr.send();
	
};

function doRestart() {
	//close view
	view.close();
	
	//open test
	Alloy.Globals.showTest();
};

function doStop() {
	
	var dialog = Ti.UI.createAlertDialog({
    		cancel: 1,
    		buttonNames: [L('finish_confirmation_yes'), L('finish_confirmation_no')],
    		message: L('finish_confirmation_text'),
    		title: L('finish_confirmation_title')
  	});
  
	dialog.addEventListener('click', function(e){
		if  ( e.index === 0 ) {
			//close view
	  		view.close();
	 	} else {
	 		;
	 	}
	});
	
	//show dialog
	dialog.show();

};

view.addEventListener('android:back',function(e){
    //show confirmation
    doStop();
    
    return false;
});