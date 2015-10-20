var args = arguments[0] || {};
	self = this,
	view = self.getView();

function updateContent() {
	//set content text
	self.content.text = String.format(L('test_title'),Alloy.Globals.user.test_index);
	
	//android update bar
	if ( Ti.Platform.name === "android" && view && view.activity ) {
		view.activity.actionBar.title = self.content.text;
	}
};

//
self.test_start_timer = null;

//
self.test_start = function( value ) {
	if ( value ) { 
		self.setSound(false);
		self.test_start_timer = setTimeout( self.test_start_real, 2000 );
	} else {
		clearTimeout(self.test_start_timer);
		self.setSound(false);
	}
};

self.test_start_real = function() {
	self.setSound(true);
};

//sound object
self.sound = null;

//sound play
self.sound_play = function( value ) {
	if ( self.sound )
		if ( value ) {
			// create the sound/media object
			self.sound = Titanium.Media.createSound({
				url: '/images/2000sine.wav',
				preload: true
			});	
			self.sound.setLooping(true);	
			self.sound.play();
		} else {
			self.sound.setLooping(false);	
			self.sound.stop();
		}
};

//
self.playing = false; 

//
self.soundAnimTimer = null;

//
self.soundAnimFrame = 0;

//
self.soundAnim = function() {
	if ( self.playing ) {
		if ( self.soundAnimFrame == 0 ) {	
			self.soundAnimFrame = 1;
			if ( self.soundon2 )
				self.soundon2.show();
			if ( self.soundon )
				self.soundon.hide();
		} else {
			self.soundAnimFrame = 0;
			if ( self.soundon2 )
				self.soundon2.hide();
			if ( self.soundon )
				self.soundon.show();
		}
	} else {
		if ( self.soundon2 )
			self.soundon2.hide();
		if ( self.soundon )
			self.soundon.hide();
	}
};

//set sound icon
self.setSound = function( value ) {
	self.playing = value;
	if ( value ) {
		if ( self.soundoff )	
			self.soundoff.hide();
		if ( self.soundon2 )
			self.soundon2.hide();
		if ( self.question )
			self.question.show();
		if ( self.soundon )
			self.soundon.show();
		
		if ( self.btn_yes )
			self.btn_yes.show();
		if ( self.btn_no )
			self.btn_no.show();
		
		self.soundAnimFrame = 0;
		self.soundAnimTimer = setInterval( self.soundAnim, 500 );
		
		//play sound
		self.sound_play( true );
		
	} else {
		clearInterval(self.soundAnimTimer);
		
		if ( self.soundoff )
			self.soundoff.show();
		if ( self.soundon2 )
			self.soundon2.hide();
		if ( self.soundon )
			self.soundon.hide();
		if ( self.question )
			self.question.hide();
			
		if ( self.btn_yes )
			self.btn_yes.hide();
		if ( self.btn_no )
			self.btn_no.hide();
		
		//play sound
		self.sound_play( false );
		
	};
};

//on window open
view.addEventListener("open",function(event) {
	
	// create the sound/media object
	self.sound = Titanium.Media.createSound({
		url: '/images/2000sine.wav',
		preload: true
	});

	//reset test index
	Alloy.Globals.user.test_index = 1;
	
	//set action bar
	Alloy.Globals.setActionBar( self, false, false );
	
	//update test text
	updateContent();
	
	//start test
	self.test_start( true );
});

//on window open
view.addEventListener("close",function(event) {
	//
	if ( self.test_start )
		self.test_start( false );
});

function doYes() {
	
	//increase test index
	Alloy.Globals.user.test_index++;	
	
	//show finish
	if ( Alloy.Globals.user.test_index == 5 ) {
		
		//stop test
		if ( self.test_start )
			self.test_start( false );
		
		//close self
		view.close();
		
		Alloy.Globals.showFinish();		
			
	} else { 
	
		//update
		updateContent();
		
		//start test
		if ( self.test_start )
			self.test_start( true );
		
	}
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
			//
			if ( self.test_start )
				self.test_start( false );
		
			//close view
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