var args = arguments[0] || {};
	self = this,
	view = self.getView();

function updateContent() {
	//set content text
	self.content.text = String.format(L('test_text'),Alloy.Globals.user.test_index);
};

//on window open
view.addEventListener("open",function(event) {
	
	//reset test index
	Alloy.Globals.user.test_index = 1;
	
	//update test text
	updateContent();
	
	//set action bar
	Alloy.Globals.setActionBar( self, false, false );
});

function doYes() {
	
	//increase test index
	Alloy.Globals.user.test_index++;
	
	//update
	updateContent();
	
	//show finish
	if ( Alloy.Globals.user.test_index == 4 ) {
		//close self
		view.close();
		
		Alloy.Globals.showFinish();		
	};
};
var doNo = doYes;

function doStop() {
	
	var dialog = Ti.UI.createAlertDialog({
    		cancel: 1,
    		buttonNames: [L('test_confirmation_yes'), L('test_confirmation_no')],
    		message: L('test_confirmation_text'),
    		title: L('test_confirmation_title')
  	});
  
	dialog.addEventListener('click', function(e){
		if  ( e.index === 0 ) {
	  		view.close();
	 	};
	});
	
	//show dialog
	dialog.show();

};

view.addEventListener('android:back',function(e){
    //show confirmation
    doStop();
    
    return false;
});