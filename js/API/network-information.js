var ni = {

	estaConectado: function() {
		var networkState = navigator.connection.type;
		if(networkState != Connection.NONE){
			return true;
		}else{
			alert("El dispositivo no esta conectado a Internet");
			return false;
		}
	}
}