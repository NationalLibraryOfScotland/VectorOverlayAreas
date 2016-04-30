
	// necessary for use of Bing layers - generate your own at: https://msdn.microsoft.com/en-us/library/ff428642.aspx

	var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";
	

	// a generic attribution variable for NLS historic map tilesets
	
	var NLS_attribution = new ol.Attribution({html: 'Historic Map Layer courtesy of the <a href="http://maps.nls.uk/">National Library of Scotland</a>'});
	
	// the Web Tile Map Service layers from NLS - view full list at: http://maps.nls.uk/geo/explore/scripts/explore.js

	var edin1804 = new ol.layer.Tile({
		title: "Ainslie, 1804",
        	visible: false,
		source: new ol.source.XYZ({
					attributions: [NLS_attribution],
					url: "http://geo.nls.uk/urbhist/74400072/{z}/{x}/{-y}.png",
					minZoom: 8,
					maxZoom: 18
			  })
	});


	var edin1817 = new ol.layer.Tile({
		title: "Kirkwood, 1817",
        	visible: false,
		source: new ol.source.XYZ({
					attributions: [NLS_attribution],
					url: "http://geo.nls.uk/urbhist/74400073-4/{z}/{x}/{-y}.png",
					minZoom: 8,
					maxZoom: 18
			  })
	});


	var edin1890s = new ol.layer.Tile({
		title: "Ordnance Survey, 1890s",
        	visible: false,
		source: new ol.source.XYZ({
					attributions: [NLS_attribution],
					url: "http://geo.nls.uk/maps/towns/edinburgh1893/{z}/{x}/{-y}.png",
					minZoom: 8,
					maxZoom: 20
			  })
	});

	var OS1920s =  	new ol.layer.Tile({
	        title: 'Ordnance Survey 1920s',
        	visible: false,
		source: new ol.source.XYZ({
					attributions: [NLS_attribution],
					url: 'http://geo.nls.uk/maps/api/nls/{z}/{x}/{y}.jpg',
					maxZoom: 15
		})
          });


	// OpenStreetMap

	var osm = new ol.layer.Tile({
	  	title: 'OpenStreetMap',
        	visible: false,
	  	source: new ol.source.OSM({
			attributions: [new ol.Attribution({html:'&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors'})],
	    		url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  	})
	});

	// Bing layers
	
	var BingSatellite =   new ol.layer.Tile({
		title: 'Bing Satellite',
        	visible: false,
	        source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'Aerial'
		    })
	});

	var BingRoad = new ol.layer.Tile({
	        title: 'Bing Road',
        	visible: false,
	        source: new ol.source.BingMaps({
		      key: BingapiKey,
		      imagerySet: 'Road'
		    })
	});

	var BingAerialWithLabels = new ol.layer.Tile({
	        title: 'Bing Hybrid',
        	visible: false,
	        source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels'
		})
	});

	// an array of the base layers listed above

	var baseLayers = [edin1804, edin1817, edin1890s, OS1920s, BingRoad, BingSatellite, osm ];

	// makes the Edinburgh 1817 layer visible

	edin1817.setVisible(true);


	// sets up the base layers as a set of radio buttons

	var baselayerSelect = document.getElementById('baselayerSelect');
	    for (var x = 0; x < baseLayers.length; x++) {
	            var checked = (baseLayers[x].getVisible()) ? "checked" : "";
	            baselayerSelect.innerHTML += '<p><input type="radio" name="base" id="baseRadio'+ baseLayers[x].get('title') + 
			'" value="' + x + '" onClick="switchbaseLayer(this.value)" ' + checked + '><span>' + baseLayers[x].get('title') + '</span></p>';
	}


	// the style for the 1804 landownership vector overlay

		var style = new ol.style.Style({
		    fill: new ol.style.Fill({
		    color: 'rgba(255, 0, 0, 0.1)'
		    }),
		  stroke: new ol.style.Stroke({
		    color: '#c41959',
		    width: 1
		  }),
		  text: new ol.style.Text({
		    font: '16px helvetica,sans-serif',
		    fill: new ol.style.Fill({
		      color: '#000'
		    }),
		    stroke: new ol.style.Stroke({
		      color: '#000099',
		      width: 1
		    })
		  })
		});
		var styles = [style];

	// the layer definition for the 1804 landownership vector overlay

		var vector_ownership_1804 = new ol.layer.Vector({
		  source: new ol.source.Vector({
		    url: 'http://geo.nls.uk/maps/dev/digitalideas/ainslie_1804.js',
    		    format: new ol.format.GeoJSON()
		  }),
		    style: function(feature, resolution) {
		    style.getText().setText(resolution < 1 ? feature.get('PROPERTY') : '');
		    return styles;
		  }
		});



	// the main ol map class

		var map = new ol.Map({
		  target: 'map',
		  renderer: 'canvas',
		  controls: ol.control.defaults().extend([ new ol.control.ScaleLine({ units:'metric' }) ]),
		  layers: [edin1817, vector_ownership_1804],
		  logo: false,
		  view: new ol.View({
		    center: ol.proj.transform([-3.188, 55.961], 'EPSG:4326', 'EPSG:3857'),
		    zoom: 13
		  })
		});




	// the featureOverlay for the selected vector features

	var highlightStyleCache = {};
	
	var featureOverlay = new ol.FeatureOverlay({
	  map: map,
	  style: function(feature, resolution) {
	    var text = resolution < 10 ? feature.get('PROPERTY') : '';
	    if (!highlightStyleCache[text]) {
	      highlightStyleCache[text] = [new ol.style.Style({
	        stroke: new ol.style.Stroke({
	          color: '#000099',
	          width: 3
	        }),
	         fill: new ol.style.Fill({
	          color: 'rgba(255,0,0,0.1)'
	         }),
	        text: new ol.style.Text({
	          font: '16px helvetica,sans-serif',
	          text: text,
	          fill: new ol.style.Fill({
	            color: '#000099'
	          }),
	          stroke: new ol.style.Stroke({
	            color: '#000099',
	            width: 0.1
	          })
	        })
	      })];
	    }
	    return highlightStyleCache[text];
	  }
	});
	
	var highlight;
	var displayFeatureInfo = function(pixel) {
	
	  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
	    return feature;
	  });
	
	  var info = document.getElementById('info');
	  if (feature) {
	    info.innerHTML = feature.get('PROPERTY');
	  } else {
	    info.innerHTML = '&nbsp;';
	  }
	
	  if (feature !== highlight) {
	    if (highlight) {
	      featureOverlay.removeFeature(highlight);
	    }
	    if (feature) {
	      featureOverlay.addFeature(feature);
	    }
	    highlight = feature;
	  }
	
	};
	
	map.on('pointermove', function(evt) {
	  if (evt.dragging) {
	    return;
	  }
	  var pixel = map.getEventPixel(evt.originalEvent);
	  displayFeatureInfo(pixel);
	});


       // var scaleline = new ol.control.ScaleLine();
       // map.addControl(scaleline);

       var zoomslider = new ol.control.ZoomSlider();
       map.addControl(zoomslider);


	// function to change the baseLayer

       function switchbaseLayer(index) {
	
		map.getLayers().getArray()[0].setVisible(false);
		map.getLayers().removeAt(0);
		map.getLayers().insertAt(0,baseLayers[index]);
		baselayerSelected = baseLayers[index];
	    	baselayerSelected.setVisible(true);
	}


