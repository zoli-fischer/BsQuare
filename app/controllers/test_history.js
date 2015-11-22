var args = arguments[0] || {};
	self = this,
	view = self.getView();

//ajax request client
var xhr = null;

//on window open
view.addEventListener("open",function(event) {
	//set action bar
	Alloy.Globals.setActionBar( self, true, false );
	
	//abort ajax call
	if ( xhr )
		xhr.abort();
	
	//create ajax call
	xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			Ti.API.info("Status: "+this.status);
			Ti.API.info("Text: "+this.responseText);
			try {
				json = JSON.parse(this.responseText);
				Ti.API.info('Parsed');	
			} catch(error) {
				Ti.API.info('Not parsed');
				//show error msg	
				xhrError();
				return;
			}
			
			var items = [];
			for ( i in json ) {	
				var title = json[i].created+' - '+( json[i].score > 0 ? L('finish_result_'+json[i].score) : '' );
				items.push( { properties : { 
						title: title,
						accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE,
						font: {
					        fontSize: "16dp"
					    },
					    color: "#000",
					    bottom: "10dp",
						width: Ti.UI.FILL  
					} });
			};
			self.list.sections[0].setItems(items);
			Ti.API.info(self.list.sections[0].getItems().length);
		},
		onerror: function(e) {
			//show error msg
			xhrError();
		}
	});

	xhr.open('GET',Alloy.CFG.getResultsApiUrl+"&cpr="+Alloy.Globals.user.cpr(), true );
	xhr.send();
	
});

function xhrError() {
	alert(L('test_history_load_error'));
	
	//close view
	view.close();
}
