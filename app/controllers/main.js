var args = arguments[0] || {};
	self = this,
	view = self.getView();

//on window open
view.addEventListener("open",function(event) {	
	//set action bar
	Alloy.Globals.setActionBar( self, false, true );		
	
	//set content text
	self.content.text = String.format(L('main_text'),Alloy.Globals.user.cpr());
	
	//close opener
	if ( self.parent )
		self.parent.getView().close();
	
});

//show instruction
function openInstruction() {
	Alloy.Globals.showInstruction( { parent: self } );
}

//show test history
function openTestHistory() {
	Alloy.Globals.showTestHistory( { parent: self } );
}

//do logout 
function doLogout(event) {
	//log out user
	Alloy.Globals.user.clear();

	//show index
	Alloy.Globals.showIndex( { parent: self } );
}
