// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//show activity indicator
Alloy.Globals.activityIndicatorWnd = (function() {
	var self = this;
	
	//hide indicator
	self.hide = function() {
		//close wnd
		if ( self.activityIndicatorWin )
			self.activityIndicatorWin.close();
		
		//release memory
		self.delete();
	};
	
	//show indicator
	self.show = function( obj ) {
		
		//set defaults
		obj.message = typeof obj.message === 'undefined' ? 'Loading...' : obj.message;
		obj.onBack = typeof obj.onBack === 'undefined' ? null : obj.onBack;
		
		//set up activity indicator wnd
		self.activityIndicatorWin = Ti.UI.createWindow({
	 		backgroundColor: 'white',
	 		fullscreen: false,
		    modal: false
		});
	
		//set up activity indicator
		self.activityIndicator = Ti.UI.createActivityIndicator({
		  color: 'black',
		  indicatorColor: 'black',
		  font: { fontFamily:'Helvetica Neue', fontSize: 18, fontWeight: 'normal' },
		  message: obj.message,
		  style: Ti.Platform.name === 'iPhone OS' ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK,	  
		  height: Ti.UI.SIZE,
		  width: Ti.UI.SIZE
		});
		
		//
		if ( self.activityIndicatorWin && self.activityIndicator )
			self.activityIndicatorWin.add(self.activityIndicator);
			
		//on open wnd show indicator
		if ( self.activityIndicatorWin )
			self.activityIndicatorWin.addEventListener('open', function (e) {
			 	//show activity indicator
			 	if ( self.activityIndicator )
					self.activityIndicator.show();	  
			 	
			 	//set title 
			 	if ( Ti.Platform.name === "android" && this && this.activity )			 		
			 		this.activity.actionBar.title = L('app_title');
				
			});
		
		//on android back cancel activity
		if ( self.activityIndicatorWin )
			self.activityIndicatorWin.addEventListener('android:back',function(e) {
				
				//run cancel callback
				if ( typeof obj.onBack == 'function' ) {
					var r = obj.onBack.call( self );
					if ( typeof r != 'undefined' )
						return r;
				}	
				
			});
		
		//open wnd
		if ( self.activityIndicatorWin ) 
			self.activityIndicatorWin.open();
	};
	
	//delete object
	self.delete = function() {
		//remove child from wnd
		if ( self.activityIndicatorWin && self.activityIndicator )
			self.activityIndicatorWin.remove(self.activityIndicator);
		
		//release memory
		if ( self.activityIndicator )
			delete self.activityIndicator;	
		if ( self.activityIndicatorWin )
			delete self.activityIndicatorWin;			
	};
	
	return self;
})();

//set up window action bar
Alloy.Globals.setActionBar = function( view, showBack ) {	
	if ( Ti.Platform.name === "android" && view && view.activity ) {
		var actionBar = view.activity.actionBar;
		
		//get showBack value
		showBack = typeof showBack === 'undefined' ? false : showBack;
		
		if ( showBack ) {
			//show back button
			actionBar.setDisplayHomeAsUp(true);
			
			//go back
			actionBar.onHomeIconItemSelected = function() {
			    Ti.Android.currentActivity.finish();
			};
		};
		
		//show activity bar
		actionBar.show();
		
		//set title
		actionBar.title = L('app_title');
		
		//create activity bar menu
		view.activity.onCreateOptionsMenu = function(e) { 
			var menuItemHelp = e.menu.add({ 
				title : L('menu_help'), 
				icon : "", 
				showAsAction : Ti.Android.SHOW_AS_ACTION_WITH_TEXT 
			});
			menuItemHelp.addEventListener("click", function(e) { 
				alert(L('menu_help')); 
			}); 
			
			var menuItemAbout = e.menu.add({ 
				title : L('menu_about'), 
				icon : "", 
				showAsAction : Ti.Android.SHOW_AS_ACTION_WITH_TEXT 
			});
			menuItemAbout.addEventListener("click", function(e) { 
				alert(L('menu_about')); 
			}); 
		};
	
	};
};