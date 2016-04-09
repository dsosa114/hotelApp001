var gl = {
	latitud = null;
	longitud = null;

	error: function(error){
		alert("Error: " + error.message);
	},
	exito: function(posicion){
		gl.latitud = posicion.coords.latitud;
		gl.longitud = posicion.coords.longitude;

		var options = {
			zoom: 13,
			center: {
				lat: gl.latitud,
				lng: gl.longitud
			}.
			mapTypeId:google.mapas.mapTypeId.RADMAP;
		};

		var map = new google.maps.Map(document.getElementById("canvas"), options);
	},

	ponerMapa: function(){
		navigator.geolocation.getCurrentPosition(gl.exito, gl.error);
	}
}