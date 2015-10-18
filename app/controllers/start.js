var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {
	//set action bar
	Alloy.Globals.setActionBar( self, true, false );		
});

//on window open
view.addEventListener("close",function(event) {
	if ( self ) {
		self.destroy();
		self = null;
	}
});

//on back
view.addEventListener('android:back',function(e) {
	view.close();
	return false;
});