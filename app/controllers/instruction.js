var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {
	//set action bar
	Alloy.Globals.setActionBar( self, true, false ); 
});

//start test
function doStart() {
	//close
	view.close();
	
	//open test
	Alloy.Globals.showTest( { parent: args.parent } );
};