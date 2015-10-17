var view = this.getView();

//on window open
view.addEventListener("open",function(event) {
	//set action bar
	Alloy.Globals.setActionBar( view, true, false );
});

//on back
view.addEventListener('android:back',function(e) {
	view.close();
	/*
	this.destroy();
	this = null;
	*/
});