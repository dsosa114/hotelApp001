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

		fn.ponerFecha();
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
			if(typeof nombre !== "string"){
				throw new error("El nombre no es válido");
			}
			if(email == ""){
				throw new error("Debe agregar email");
			}
			if(foto == undefined){
				throw new error("El usuario debe tomar una foto")
			}
			if(Number.isNaN(Number(tel))){
				throw new error("El teléfono no es válido");
			}
			if(tel.length == 10){
				throw new error("El teléfono debe tener 10 digitos");
			}

			//Enviar el registro al servidor
			fn.enviarRegistro(nombre,email,tel,foto);

		}catch(error){
			alert(error);
		}
	},

	enviarRegistro: function(nom, email, tel, foto){
		$.ajax({
			method: "POST",
			url:"http://carlos.igitsoft.com/apps/test.php",
			data:{
				nombre:nom,
				mail:email,
				tel:tel
			},
			error: function(){
				alert("Error de conexión con AJAX");
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