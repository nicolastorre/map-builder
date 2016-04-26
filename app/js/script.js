$(function(){
	const electron = require('electron');
	const fs = require('fs');
	const csv = require('csv-parser');
	const remote = require('remote');
	const dialog = electron.remote.dialog;
	const clipboard = electron.clipboard;
	const ipc = electron.ipcRenderer;

	var appController = function() {
		this.init();
	};
	
	appController.prototype = {
		init: function() {
				this.$el = $('body');
				
				this.geoData = null;

				this.events();
		},
		
		events: function() {
			var that = this;
			
			this.$el.on('click','#openFile', function() {
				that.openFile();
			});
			
			this.$el.on('click','#saveFile', function() {
				that.saveFile();
			});
			
			this.$el.on('click', '#clipboard-html-code', function() {
				clipboard.writeText($('#raw-html-code').val());
			});

			this.$el.on('click', '.close-main-window', function() {
				ipc.send('close-main-window')
			});
						
		},
		
		openFile: function() {
			var that = this;
			
			dialog.showOpenDialog(function (fileNames) {
				if (fileNames === undefined) return;
				var fileName = fileNames[0];
				// console.log(fileName);
				that.parseCSV(fileName);	
			});
		},
		
		saveFile: function() {
			var that = this;
			
			dialog.showSaveDialog(function (fileName) {
				if (fileName === undefined) return;
				console.log(fileName);
				fs.writeFile(fileName, 'Hello World!', function (err) {
					if (err) return console.log(err);
					console.log('Hello World > '+fileName);
				});
			});
		},
		
		parseCSV: function(fileName) {
			var that = this;
			
			this.geoData = new Array();
			
			var stream = csv({
				raw: false,     // do not decode to utf-8 strings 
				separator: ';', // specify optional cell separator 
				quote: '"',     // specify optional quote character 
				escape: '"',    // specify optional escape character (defaults to quote value) 
				newline: '\n',  // specify a newline character
			});

			fs.createReadStream(fileName)
				.pipe(stream)
				.on('data', function(data) {
					that.geoData.push(data);
				})
				.on('end', function() {
					// console.log("CSV parsed!");
					that.displayData();
				});
			
		},
		
		displayData: function() {
			var that = this;
			var marker;
			
			
			$('#geoData-table').empty();
			$('#geoData-table').append('<thead><tr><td>ID</td><td>NAME</td><td>LAT</td><td>LNG</td></tr></thead>');

			$.each(this.geoData, function(index, row) {
				$('#geoData-table').append('<tr><td>'+row.id+'</td>'+'<td>'+row.name+'</td>'+'<td>'+row.lat+'</td>'+'<td>'+row.lng+'</td></tr>');
			});
			
			var customMap = new map(this.geoData);
			
			$('#raw-html-code').append('<h2>HTML code</h2><br/>' +
				'&lt;script src="http://maps.googleapis.com/maps/api/js"&gt;&lt;/script&gt;'+
				'&lt;div id="googleMap" style="width:500px;height:380px;"&gt;&lt;/div&gt;'+
				'&lt;script&gt;var geoData = '+JSON.stringify(that.geoData)+';&lt;/script&gt;'+
				'&lt;script&gt;'+
				'function initialize(){for(var e,a,o={center:new google.maps.LatLng(51.508742,-.12085),zoom:5,mapTypeId:google.maps.MapTypeId.ROADMAP},g=new google.maps.Map(document.getElementById("googleMap"),o),n=0;n&lt;geoData.length;n++)a=new google.maps.LatLng(geoData[n].lat,geoData[n].lng),e=new google.maps.Marker({position:a,title:geoData[n].name,map:g})}google.maps.event.addDomListener(window,"load",initialize);' +
				'&lt;/script&gt;'
			);
			$('#result').show();
			
		}
		
	};
	
	var app = new appController();

});
