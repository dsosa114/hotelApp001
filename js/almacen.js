var almacen = {
	db: null,
	tipoHabitacion: null,
	numPersonas: null,
	numHabitaciones: null,
	numDias: null,
	correo: null,
	password: null,

	conectarDB: function(){
		return window.openDatabase("hotelApp", "1.0", "Hotel App", 200000);
	},

	error: function(error){
		alert("Error: " + error.message);
	},

	exito: function(){
		alert("Exito");

	},

	comprobarExistenciaUsuario: function(mail, password){
		almacen.db				= almacen.conectarDB();
		almacen.correo			= mail;
		almacen.password		= password;

		almacen.db.transaction(almacen.leerUsuarios, almacen.error, almacen.exito);
	},

	guardarReservasHistorial: function(th, np, nh, nd){
		almacen.db				= almacen.conectarDB();
		almacen.tipoHabitacion  = th;
		almacen.numPersonas 	= np;
		almacen.numHabitaciones = nh;
		almacen.numDias 		= nd;

		almacen.db.transaction(almacen.tablaHistorial, almacen.error, almacen.exito);

	},

	guardarUsuarios: function(mail, password){
		almacen.db				= almacen.conectarDB();
		almacen.correo			= mail;
		almacen.password		= password;

		almacen.db.transaction(almacen.tablaUsuarios, almacen.error, almacen.exito);

	},

	guardarReservaLocal: function(th, np, nh, nd){
		almacen.db				= almacen.conectarDB();
		almacen.tipoHabitacion  = th;
		almacen.numPersonas 	= np;
		almacen.numHabitaciones = nh;
		almacen.numDias 		= nd;

		almacen.db.transaction(almacen.tablaReservasPendientes, almacen.error, almacen.exito);

	},

	tablaHistorial:function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS historial (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');
		//Insertar los datos de la nueva reservacion
		tx.executeSql('INSERT INTO historial (tipoh, nump, numh, numd) VALUES ("' + almacen.tipoHabitacion + '", ' + almacen.numPersonas + ', ' + almacen.numHabitaciones + ', ' + almacen.numDias + ')');
	},

	tablaUsuarios:function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, correo, password)');
		//Insertar los datos de la nueva reservacion
		tx.executeSql('INSERT INTO usuarios (correo, password) VALUES ("' + almacen.correo + '", "' + almacen.password + '")'); 
	},

	tablaReservasPendientes:function(tx){
		//Crear tabla de reservas_pendientes
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');
		//Insertar los datos de la nueva reservacion
		tx.executeSql('INSERT INTO reservas_pendientes (tipoh, nump, numh, numd) VALUES ("' + almacen.tipoHabitacion + '", ' + almacen.numPersonas + ', ' + almacen.numHabitaciones + ', ' + almacen.numDias + ')');
	},

	cargarDatosHistorial: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerHistorial,almacen.error);
	},

	cargarDatosReservasP: function(){
		almacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerReservasP,almacen.error);
	},

	leerHistorial: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS historial (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');
		//leer tabla historial
		tx.executeSql('SELECT * FROM historial', [], almacen.mostrarResultadosHistorial);
	},

	leerUsuarios: function(tx){
		//Crear tabla de historial
		tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, correo, password)');
		//leer tabla historial
		tx.executeSql('SELECT * FROM usuarios', [], almacen.validarUsuario);
	},

	leerReservasP: function(tx){
		//Crear tabla de reservas_pendientes
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');

		tx.executeSql('SELECT * FROM reservas_pendientes', [], almacen.mostrarResultadosReservasP);
	},

	mostrarResultadosHistorial: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay reservas en el historial</td></tr>';

		if(cantidad > 0){
			//si hay reservas en el historial
			var resultado='';
			for(var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				resultado += '<tr><td>' + th + '</td><td>' + np + '</td><td>' + nh + '</td><td>' + nd + '</td></tr>';

			}
		}

		$("#listaHistorial").html(resultado);
	},

	mostrarResultadosReservasP: function(tx, res){
		var cantidad = res.rows.length;
		var resultado = '<tr><td colspan="4">No hay reservas pendientes</td></tr>';

		if(cantidad > 0){
			//si hay reservas en el historial
			var resultado='';
			for(var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				resultado += '<tr><td>' + th + '</td><td>' + np + '</td><td>' + nh + '</td><td>' + nd + '</td></tr>';

			}
		}

		$("#listaReservasPendientes").html(resultado);
	},

	sincronizarPendientes: function(){
		alamacen.db = almacen.conectarDB();
		almacen.db.transaction(almacen.leerPendientes, almacen.error);
	},

	leerPendientes:function(tx){
		//Crear tabla de reservas_pendientes
		tx.executeSql('CREATE TABLE IF NOT EXISTS reservas_pendientes (id INTEGER PRIMARY KEY, tipoh, nump, numh, numd)');
		//leemos tabla de reservas_pendientes
		tx.executeSql('SELECT * FROM reservas_pendientes', [], almacen.procesarPendientes);
	},

	procesarPendientes: function(tx, res){
		var cantidad = res.rows.length;

		if(cantidad > 0){
			for(var i = 0; i < cantidad; i++){
				var th = res.rows.item(i).tipoh;
				var np = res.rows.item(i).nump;
				var nh = res.rows.item(i).numh;
				var nd = res.rows.item(i).numd;
				
				fn.enviarReserva(th, np, nh, nd);

				tx.executeSql('DELETE FROM reservas_pendientes WHERE id = "' + res.rows.item(i).id + '"');

			}
		}
	},

	validarUsuario:function(tx, res){
		var cantidad = res.rows.length;
		var coincidencias = 0;
		alert(cantidad);
		if(cantidad > 0){
			for(var i = 0; i < cantidad; i++){
				var mail = res.rows.item(i).correo;
				var pass = res.rows.item(i).password;
				alert(mail + ',' + almacen.correo + ',' + pass + ',' + almacen.password);
				if(mail == almacen.correo){
					if(pass == almacen.password){
						coincidencias = 1;
						break;
					}
				}
			}
			if(coincidencias > 0){
				navigator.notification.alert("Sesión iniciada correctamente", function(){
					navigator.vibrate(1000);
					navigator.notification.beep(1);
					window.localStorage.setItem("user", almacen.correo);
					window.location.href="#home";
				}, "Bienvenido", "Siguiente");
			} else {
				navigator.notification.alert("Usuario o contraseña no válidos", function(){
					
				}, "Error", "Aceptar");
			}
		} else {
			navigator.notification.alert("Usuario o contraseña no válidos", function(){
					
			}, "Error", "Aceptar");
		}
	}
};