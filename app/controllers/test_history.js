var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {
	//set action bar
	Alloy.Globals.setActionBar( self, true, false );
});