var fn = {
	deviceready: function(){
		//Esto es necesario para PhoneGap para que pueda ejecutar la aplicación
		document.addEventListener("deviceready", fn.init, false);
	},

	init: function(){
		//Usuario registrado?
		if(true){
			window.location.href="#registro"; //window: pantalla del navegador
		}
		$("#registro div[data-role=footer] a").tap(fn.registrar); //jQuery es parecido a css
	},

	registrar: function(){
		//Obtener datos del formulario
		var nombre = $("#regName").val();
		var email = $("regEmail").val();
		var tel = $("regTel").val();
		try{
			if(typeof nombre !== "string"){
				throw new error("El nombre no es válido");
			}
			if(email != ""){
				throw new error("Debe agregar email");
			}
			if(Number.isNaN(Number(tel))){
				throw new error("El teléfono no es válido");
			}
			if(tel.length == 10){
				throw new error("El teléfono debe tener 10 digitos");
			}

			//Enviar el registro al servidor
			fn.enviarRegistro(nombre,email,tel);

		}catch(error){
			alert(error);
		}
	},

	enviarRegistro: function(nom, email, tel){
		$.ajax({
			method: "POST",
			url:"http://carlos.igitsoft.com/apps/test.php",
			data:{
				nom:nombre,
				mail:email,
				tel:tel
			},
			error: function(){
				alert("Error de conexión con AJAX");
			}
		}).done(function(mensaje){
			if(mensaje == 1){
				//Enviar foto
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
	}

};

//EJECUTAR EN PHONEGAP
//
$(fn.deviceready);

//EJECUTAR EN NAVEGADOR
//fn.init(); Ejecución por JS
//$(fn.init); //Ejecución por jQuery