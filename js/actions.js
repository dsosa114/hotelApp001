/*Los tres objetos mas importantes de JavaScript son:
--document
--window
--navigator
*/

var fn = {
	deviceready: function(){
		//Esto es necesario para PhoneGap para que pueda ejecutar la aplicación
		document.addEventListener("deviceready", fn.init, false);
	},

	init: function(){
		//Usuario registrado?
		if(!fn.estaRegistrado()){
			window.location.href="#registro"; //window: pantalla del navegador
		}
		$("#registro .ui-content a").tap(fn.tomarFoto);
		$("#registro div[data-role=footer] a").tap(fn.registrar); //jQuery es parecido a css
		$("#reserva1 ul[data-role=listview] a").tap(fn.SeleccionarTipoHabitación);
		$("#reserva1 div[data-role=navbar] .ui-btn-active").tap(fn.reserva1Siguiente);
		$("#reserva2 div[data-role=navbar] .ui-btn-active").tap(fn.hacerReserva);
		$("#boton-historial").tap(fn.mostrarHistorial);
		fn.ponerFecha();
	},

	mostrarHistorial: function(){
		almacen.cargarDatosHistorial();
	},

	SeleccionarTipoHabitación: function(){
		$("#reserva1 ul[data-role=listview] a").css("background-color", "");
		$(this).css("background-color", "#03080C");
		$("#reserva1").attr("th", $(this).text());
	},

	reserva1Siguiente: function(){
		if($("#reserva1").attr("th") != undefined){
			window.location.href = "#reserva2";
		}else{
			alert("Es necesario seleccionar un tipo de habitación");
		}
	},

	hacerReserva: function(){
		//Obtenre los datos de la reserva
		var tipoDeHabitacion = $("#reserva1").attr("th");
		var numPersonas = $("#numPersonas").val();
		var numDias = $("#numDias").val();
		var numHabitaciones = $("#numHabitaciones").val();

		//Enviar datos dependiendo si hay conexion
		if(ni.estaConectado()){
			//Enviar al servidor
			fn.enviarReserva(tipoDeHabitacion,numPersonas, numHabitaciones, numDias);
		}else{
			//Guardar localmente

		}
		//Resetear datos
		$("#reserva1 ul[data-role=listview] a").css("background-color", "");
		$("#reserva1").removeAttr("th");
		$("#reserva2 select").prop("selectedIndex", 0).selectmenu("refresh",true);

		alert("Tu reservación fue exitosa, puedes revisarla en tu historial")

		window.location.href = "#home";
	},

	enviarReserva: function(tipoDeHabitacion,numPersonas,numHabitaciones,numDias){
		$.ajax({
			method: "POST",
			url:"http://carlos.igitsoft.com/apps/test.php",
			data:{
				tipo:tipoDeHabitacion,
				habitaciones:numHabitaciones,
				personas:numPersonas,
				dias:numDias
			},
			error: function(e){
				alert("Error de conexión con AJAX");
				alert(e.response);
			}

		}).done(function(mensaje){
			if(mensaje == 1){
				//Coloca reserva en el historial
				almacen.guardarReservaHistorial(tipoDeHabitacion, numPersonas, numHabitaciones, numDias);
			}else{
				alert("Error al guardar reserva en el servidor,:" + mensaje);
			}
		});
	},

	estaRegistrado: function(){
		if(window.localStorage.getItem("user")){
			return true;
		}else{
			return false;
		}

	},

	registrar: function(){
		//Obtener datos del formulario
		var nombre = $("#regName").val();
		var email = $("#regEmail").val();
		var tel = $("#regTel").val();
		var foto = $("#fotoTomada").attr("rel");
		try{
			if(typeof nombre == ""){
				throw new Error("El nombre no es válido");
			}
			if(email == ""){
				throw new Error("Debe agregar email");
			}
			if(foto == undefined){
				throw new Error("El usuario debe tomar una foto")
			}
			if(Number.isNaN(Number(tel))){
				throw new Error("El teléfono no es válido");
			}
			if(tel.length != 10){
				throw new Error("El teléfono debe tener 10 digitos");
			}

			//Enviar el registro al servidor
			fn.enviarRegistro(nombre,email,tel,foto);

		}catch(error){
			alert(error);
		}
	},

	enviarRegistro: function(nom, email, tel, foto){
		//alert(nom+" "+email+" "+tel)
		$.ajax({
			method: "POST",
			url:"http://carlos.igitsoft.com/apps/test.php",
			data:{
				nom:nom,
				mail:email,
				tel:tel
			},
			error: function(e){
				alert("Error de conexión con AJAX");
				alert(e.response);
			}

		}).done(function(mensaje){
			if(mensaje == 1){
				//Enviar foto
				ft.transferir(foto);
			}else{
				alert("Error al enviar los datos al servidor, mensaje:" + mensaje);
			}
		});
	},

	ponerFecha: function(){
		var fecha = new Date();
		var dia = fecha.getDate();
		var mes = fecha.getMonth()+1; // Los meses empiezan desde 0
		var year = fecha.getFullYear();

		var hoy = dia + "/" + mes + "/" +year;

		$(".fecha").html(hoy);
	},

	tomarFoto: function(){
		mc.abrirCamara();
	}

};

//EJECUTAR EN PHONEGAP
//
$(fn.deviceready);

//EJECUTAR EN NAVEGADOR
//fn.init(); Ejecución por JS
//$(fn.init); //Ejecución por jQuery