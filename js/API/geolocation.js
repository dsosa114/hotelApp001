var gl = {
	latitud = null;
	longitud = null;

	error: function(error){
		alert("Error: " + error.message);
	},
	exito: function(posicion){
		gl.latitud = posicion.coords.latitud;
		gl.longitud = posicion.coords.longitude;

		var hotel = {
			lat: 19.046583,
			lng: -98.207966
		}

		var options = {
			zoom: 13,
			center: {
				lat: gl.latitud,
				lng: gl.longitud
			},
			mapTypeId:google.mapas.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById("canvas"), options);

		var directionsDisplay = new google.maps.DirectionsRenderer({
			map: map
		});

		var request = {
			destination: hotel,
			origin:{
				lat: gl.latitud,
				lng: gl.longitud
			},
			travelMode: google.maps.TravelMode.DRIVING
		};

		var directionsService = new google.maps.DirectionsService();

		directionsService.route(request, function(response, status){
			if(status == google.maps.DirectionsStatus.OK){
				directionsDisplay.setDirections(response);
			}
			else{
				alert("Error: " + status);
			}
		});
	},

	ponerMapa: function(){
		navigator.geolocation.getCurrentPosition(gl.exito, gl.error);
	}
}