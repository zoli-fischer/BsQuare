var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {	
	//set action bar
	Alloy.Globals.setActionBar( self, false, false );
});

function doDone() {
	//close view
	view.close();
};

function doRestart() {
	//close view
	view.close();
	
	//open test
	Alloy.Globals.showTest();
};