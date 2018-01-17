//Global map variable
var map;

//Places array
var places = [
	{
		name: "Agra Chaat",
		unique : "59b8f0d56bdee65947c75470",
		show: true,
		position : {
			lat: 29.927320,
			lng: 73.871987
		}
	},
	{
		name: "Balaji Dham",
		unique : "4f23d92fe4b01b0c5ed10a0a",
		show: true,
		position : {
			lat: 29.898842,
			lng: 73.893452
		}
	},
	{
		name: "CGR Mall",
		unique : "5121ff83e4b016a0801b8636",
		show: true,
		position : {
			lat: 29.909181,
			lng: 73.881238
		}
	},
	{
		name: "Indira Vatika",
		show: true,
		unique : "51ce3807498e6594a9484263",
		position : {
			lat: 29.912779,
			lng: 73.883086
		}
	},
	{
		name: "Nosegay Public School",
		show: true,
		unique : "54952e95498ebf02cffd6957",
		position : {
			lat: 29.895270,
			lng: 73.891457
		}
	}
];

//Array of markers on map
var markers = [];

//Initialise map
function initMap() {
	//Defines position of map and zoom level
	map = new google.maps.Map($('#map')[0], {
		center: {lat: 29.904952, lng: 73.882942},
		zoom: 15,
		//Night-mode style from 'https://developers.google.com/maps/documentation/javascript/styling'
		styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
        ]
	});
	//Variable for infoWindow of markers
	var largeInfoWindow = new google.maps.InfoWindow();
	//Variable to store boundary of map on screen
	var bounds = new google.maps.LatLngBounds();
	//Default icon
	var defaultIcon = makeMarkerIcon('0091ff');
	//Highlighted icon
	var highlightedIcon = makeMarkerIcon('FFFF24');
	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21, 34));
		return markerImage;
	}
	//Loop to create an array of markers from our places array
	for(var i = 0 ; i < places.length ; i++ )
	{
		var position = places[i].position;
		var name = places[i].name;
		var id = places[i].unique;
		var show = places[i].show;
		var marker  = new google.maps.Marker({
			map : map,
			position : position,
			name : name,
			icon : defaultIcon,
			show : ko.observable(true),
			animation: google.maps.Animation.DROP,
			id : id
		});
		//Inserting each marker in markers array
		markers.push(marker);
		//Extending bounds variable to accommodate this marker
		bounds.extend(marker.position);
		//Addind an on click event listener on every marker
		marker.addListener('click', function(){
			populateInfoWindow(this, largeInfoWindow);
			bounce(this);
		});
		//Function to make a marker bounce on clicking on it
		function bounce(marker) {
			if (marker.getAnimation() !== null)
			{
				marker.setAnimation(null);
			}
			else
			{
				marker.setAnimation(google.maps.Animation.BOUNCE);
				window.setTimeout(function(){
					marker.setAnimation(null);
				},1450);
			}
		}
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function () {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function () {
			this.setIcon(defaultIcon);
		});
	}
	
	//Adjusting the map boundaries to accommodate all markers
	map.fitBounds(bounds);
	//Getting the url of image for every marker from foursquare api
	for(var i = 0 ; i < markers.length ; i++)
	{
		getImg(markers[i]);
	}
	//Function to fill the infoWindow on basis of clicked marker
	function populateInfoWindow(marker, infoWindow) {
		if(infoWindow.marker != marker)
		{
			infoWindow.marker = marker;	
			infoWindow.setContent('<div>' + marker.name +  '</div><br><img src="' + marker.url + '" alt="Unable to load image">');
			infoWindow.open(map, marker);
			infoWindow.addListener('closeclick', function(){
				infoWindow.close();
				infoWindow.marker = undefined;
			});
		}
	}
	//Knockout binding function
	var viewModel = function () {
		//Event listener on the list of places in sidebar
		//Makes the corresponding marker bounce and display its info upon clicking on the name of place in sidebar
		this.listClick = function() {
			var name = this.name;
			for(var i = 0 ; i < markers.length ; i++)
			{
				if(markers[i].name == name)
				{
					bounce(markers[i]);
					populateInfoWindow(markers[i], largeInfoWindow);
				}
			}
		}
		
		this.input = ko.observable('');
		var list = $('li');
		this.searchBar = function () {
			var filter = this.input();
			// Loop through all list items, and hide those who don't match the search query
			for (var i = 0; i < places.length; i++) {
				
				if (filter.length === 0) {
					for (i = 0; i < places.length; i++) {
						markers[i].show(true);
						markers[i].setVisible(true);
					}
				} 
				else {
					for (i = 0; i < places.length; i++) {
						if (markers[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
							markers[i].show(true);
							markers[i].setVisible(true);
						} 
						else {
							markers[i].show(false);
							markers[i].setVisible(false);
							largeInfoWindow.close();
						}
					}
				}
			}
		};
	};
	ko.applyBindings(new viewModel());
	
	//Foursquare API call
	function getImg(marker) {
		$.ajax({
			type: "GET",
			// Url with Unique Client Id and Unique Client Secret Id for this project
			url: "https://api.foursquare.com/v2/photos/" + marker.id + "?ll=40.7,-74&client_id=XQ2I0ONGSSVL1DYQYSK2Q0ERIM5ASTRANA5FRG41HTTXVKQB&client_secret=XIEY0CCAJUQ5U04C5XOLGDF3LGUXZ2GVWLEMCIWQ1FRZD4NQ&v=20170510",
			dataType: "json",
			// Success  method. Called if data fetching is successful
			success: function (data) {
				// stores url of image to be displayed
				var pr = data.response.photo.prefix;
				var su = data.response.photo.suffix;
				var img = pr + '150x150' + su;
				marker.url = img;
				
			},
			// Error method. Called if data fetching fails
			error: function (e) {
				marker.url = '';
			}
		});
	}
}

//If map is not initialised properly
function mapLoadError() {
	$('#map')[0].innerHTML = "Unable to load the map due to some error.";
}

//Sidebar hiding and showing
$('i').on('click', function() {
	var leftval=$('.sidebar').css('left');
	var sidebar_height=$('#map').css('height');
	$('.sidebar').css('height',sidebar_height);
	if(leftval=='-250px')
	{
		$('.sidebar').animate({
		left: 0
		});	
	}
	else if(leftval=='0px')
	{
		$('.sidebar').animate({
		left: -250
		});	
	}
});