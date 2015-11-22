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

//shuffle array
Alloy.Globals.shuffle = function(array) {
  var currentIndex = array.length, 
  	  temporaryValue, 
  	  randomIndex;

  // While there remain elements to shuffle...
  while ( 0 !== currentIndex ) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  };

  return array;
};

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
		return self.cpr() && self.cpr() != '';
	};
	
	//clear user
	self.clear = function() {
		self.cpr('');
	};
	
	//list of available test sounds
	self.test_sounds = [
		'',
		'500L',
		'1000L',
		'2000L',
		'4000L',
		'500R',
		'1000R',
		'2000R',
		'4000R'
	];
	
	//randomze test sound array
	self.test_sounds_result = function(){
		var arr = [],
			sounds = self.test_sounds.length;
		for ( i in self.test_sounds ) {
			arr.push({
				hz: self.test_sounds[i],
				answer: ''
			});
		}
		return Alloy.Globals.shuffle(arr);
	};
	
	//list of last/current test sounds
	self.last_test_sounds = null;
	
	//set current test sound
	self.set_last_test_sounds = function(){
		self.last_test_sounds = self.test_sounds_result();
	};
	
	//generate result data
	self.result = function(){
		var result = {
			score_left: 0,
			score_right: 0,
			score: 0,
			result: self.last_test_sounds
		},
		score_left = 0,
		score_right = 0,
		total_left = 0,
		total_right = 0,
		score = 0;
		
		for ( i in self.last_test_sounds ) {
			var hz = self.last_test_sounds[i].hz,
				answer = self.last_test_sounds[i].answer,
				is_left = hz.indexOf('L') > -1,
				is_right = hz.indexOf('R') > -1,
				is_none = !is_left && !is_right, 
				is_answer_left = answer == 'L',
				is_answer_right = answer == 'R',
				is_answer_none = !is_answer_left && !is_answer_right,
				is_correct = ( is_left && is_answer_left ) || ( is_right && is_answer_right ) || ( is_none && is_answer_none );				
			
			Titanium.API.info( 'hz:'+hz );
			Titanium.API.info( 'answer:'+answer );
			Titanium.API.info( 'is left:'+is_left );
			Titanium.API.info( 'is right:'+is_right );
			Titanium.API.info( 'is answ left:'+is_answer_left );
			Titanium.API.info( 'is answ right:'+is_answer_right );
			Titanium.API.info( 'is correct:'+is_correct );
			
			if ( is_correct ) {
				if ( is_left || is_none ) {
					total_left++,
					score_left += 1;
				}
				if ( is_right || is_none ) {
					total_right++,
					score_right += 1;
				}
			} else {
				if ( is_left || is_none ) {
					total_left++,
					score_left -= 1;
				}
				if ( is_right || is_none ) {
					total_right++,
					score_right -= 1; 
				}
			}	
		}
		
		Titanium.API.info( 'Score left:'+score_left );
		Titanium.API.info( 'Total left:'+total_left );
		Titanium.API.info( 'Score right:'+score_right );
		Titanium.API.info( 'Total right:'+total_right );
			
		//set left/right scores
		result.score_left = score_left * 100 / total_left;
		result.score_left = result.score_left < 0 ? 0 : result.score_left;
		result.score_right = score_right * 100 / total_right;
		result.score_right = result.score_right < 0 ? 0 : result.score_right;
		
		//set total score
		score = ( result.score_left + result.score_right ) / 2;
		if ( score > 90 ) {
			result.score = 4;
		} else if ( score > 50 && score <= 90 ) {
			result.score = 3;
		} else if ( score > 30 && score <= 50 ) {
			result.score = 2;
		} else {
			result.score = 1;
		}
		
		return result;
	};
	
	//generate result data json
	self.result_json = function(){
		return JSON.stringify(self.result());
	};
	
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
		  color: '#000',
		  indicatorColor: '#0B74D6',
		  font: { fontSize: "16dp" },
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
