var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {	
	//set action bar
	Alloy.Globals.setActionBar( self, false, false );
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
	
	//abort ajax call
	if ( xhr )
		xhr.abort();
	
	setTimeout(function(){
		//close view
		view.close();
		
		alert(L('finish_sent'));
	},3000);	
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