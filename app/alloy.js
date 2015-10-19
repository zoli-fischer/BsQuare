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

//logged user data
Alloy.Globals.user = (function() {
	var self = this;
	
	//set cpr
	self.cpr = function( cpr ) {
		if ( typeof cpr != 'undefined' ) {
			Ti.App.Properties.setString('userCPR', cpr);
		} else {
			return Ti.App.Properties.getString('userCPR');
		};
	};
	
	//check if user is
	self.is = function() {
		return self.cpr() != '';
	};
	
	//clear user
	self.clear = function() {
		self.cpr('');
	};
	
	//todo only for showcase
	self.test_index = 1;
	
	return self;

})();

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
		    modal: true
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
			 	
			 	//hide actionbar
			 	if ( Ti.Platform.name === "android" && this && this.activity ){		 		
			 		this.activity.actionBar.hide();
			 	};
				
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
Alloy.Globals.setActionBar = function( controller, showBack, showMenu ) {
	var view = controller.getView();	
	if ( Ti.Platform.name === "android" && view && view.activity ) {
		var actionBar = view.activity.actionBar;
		
		//get showBack value
		showBack = typeof showBack === 'undefined' ? false : showBack;
		
		//get showMenu value
		showMenu = typeof showMenu === 'undefined' ? true : showMenu;
		
		
		if ( showBack ) {
			//show back button
			actionBar.setDisplayHomeAsUp(true);
			
			//go back
			actionBar.onHomeIconItemSelected = function() {
				view.close();
				//view.fireEvent("android:back");		
			};
		};
		
		//show activity bar
		actionBar.show();
		
		//set title
		actionBar.title = view.title != ''  ? view.title : L('app_title');
		
		if ( showMenu ) {
			//create activity bar menu
			view.activity.onCreateOptionsMenu = function(e) { 
				var menuItemHelp = e.menu.add({ 
					title : L('menu_help'), 
					icon : "", 
					showAsAction : Ti.Android.SHOW_AS_ACTION_WITH_TEXT 
				});
				menuItemHelp.addEventListener("click", function(e) { 
					Alloy.Globals.showHelp(); 
				}); 
				
				var menuItemAbout = e.menu.add({ 
					title : L('menu_about'), 
					icon : "", 
					showAsAction : Ti.Android.SHOW_AS_ACTION_WITH_TEXT 
				});
				menuItemAbout.addEventListener("click", function(e) { 
					Alloy.Globals.showAbout();
				}); 
			};
		};
		
	};
};


/*
 * Parameter to open view
 * { parent: view }
 */

//create controller and open view
Alloy.Globals.openView = function( name, opts ) {
	return Alloy.createController( name, opts ).getView().open();
};

//show index window
Alloy.Globals.showIndex = function( opts ) {
	return Alloy.Globals.openView("index",opts );
};

//show main window
Alloy.Globals.showMain = function( opts ) {
	return Alloy.Globals.openView("main", opts);
};

//show test window
Alloy.Globals.showTest = function( opts ) {
	return Alloy.Globals.openView("test", opts);
};

//show finish window
Alloy.Globals.showFinish = function( opts ) {
	return Alloy.Globals.openView("finish", opts);
};

//show help window
Alloy.Globals.showAbout = function( opts ) {
	return Alloy.Globals.openView("about", opts);
};

//show help window
Alloy.Globals.showHelp = function( opts ) {
	return Alloy.Globals.openView( "help", opts);
};

//show test history window
Alloy.Globals.showTestHistory = function( opts ) {
	return Alloy.Globals.openView("test_history", opts);
};

//show instruction window
Alloy.Globals.showInstruction = function( opts ) {
	return Alloy.Globals.openView("instruction", opts);
};
