const firebaseConfig = {
    apiKey: "AIzaSyBaJ3a2Ndf67f6_57em9Yn8lS3Ci4tpzzw",
    authDomain: "acklen-project.firebaseapp.com",
    projectId: "acklen-project",
    storageBucket: "acklen-project.appspot.com",
    messagingSenderId: "101798925872",
    appId: "1:101798925872:web:23059ce8875fd2ad35bff5",
    measurementId: "G-3TV543F9XT"
  };

var contador=0;
// Initialize Firebase
var fire = firebase.initializeApp(firebaseConfig);
var db = fire.firestore();

function buscarID() {
    let identidad = document.getElementById("Identidad").value;
}

function Guardar() {
    let nombre = document.getElementById("Nombre").value;
    let apellido = document.getElementById("Apellido").value;
    let edad = document.getElementById("Edad").value;
    let identidad = document.getElementById("Identidad").value;
    let dia = document.getElementById("Dia").value;
    let silla = document.getElementById("Silla").value;
    let telefono = document.getElementById("Telefono").value;
    let banderaID = 0;

    db.collection("Reunion").get().then((querySnapshot) => {
        let id = 0;
        let idsOcupados = new Array();
        //var idsOcupados = new Array();
        //Vamos a recorrer para asignar al arreglo
        querySnapshot.forEach((doc) => {
            //console.log(identidad);
            //console.log(doc.data().Identidad);
            id = id + 1;
            idsOcupados[id] = doc.data().Identidad;
            //console.log(idsOcupados[id]);
        });

        for (i = 1; i <= id; i++) {
            //console.log(idsOcupados[i]);
            if (identidad == idsOcupados[i]) {
                banderaID = banderaID + 2;
            }
        }
        
        if (banderaID > 0) {
            location.reload();
            alert("Usted ya fue registrado para esta Reunion");
        } else if (banderaID == 0) {
            db.collection("Reunion").add({
                Nombre: nombre,
                Apellido: apellido,
                Edad: edad,
                Identidad: identidad,
                Dia: dia,
                Silla: silla,
                Telefono: telefono,
            })
                .then(function (docRef) {
                    //console.log("Documento escrito: ID: ", docRef.id);
                    document.getElementById("Nombre").value = '';
                    document.getElementById("Apellido").value = '';
                    document.getElementById("Edad").value = '';
                    document.getElementById("Identidad").value = '';
                    document.getElementById("Dia").value = '';
                    document.getElementById("Telefono").value = '';
                    EvaluarReunion();
                    mensaje("Se ingreso un nuevo miembro");
                    location.reload();                  
                    alert("Registro ingresado exitosamente, no olvides llevar tu mascarilla \r¡Te esperamos...!");
                })

                .catch(function (error) {
                    console.error("Error al Añadir: ", error);
                });
        }
    });
}

const mensaje = (tmensaje) => {
    $.ajax({
        url:"/whatsapp_msg",
        method: "POST",
        data:"mensaje="+ tmensaje,
        datatype: 'json',
        success:function(respuesta){
            console.log(respuesta);
        }
    });
}

//Carga de las sillas se ejecutara al cambiar el dia 
function CargarSillas() {
    let dia = document.getElementById("Dia").value;
    let sillas = document.getElementById("Silla");
    sillas.options[0].selected = true;
    //limpiamos las sillas del bloque anterior para volverlo a llenar con las del nuevo bloque seleccionado
    for (i = sillas.options.length - 1; i > 0; i--) {
        sillas.options[i] = null;
    }

    db.collection("Reunion").onSnapshot((querySnapshot) => {
        //Vamos a recorrer para asignar al arreglo
        var sillasOcupadas = new Array();
        var c = 0;
        querySnapshot.forEach((doc) => {
            if (dia == doc.data().Dia) {
                c = c + 1;
                sillasOcupadas[c] = doc.data().Silla;
            }
        });

        if (c == 60) {
            alert("Este dia ya se encuentra lleno.\rFavor seleccione otro.");
        } else {
            let bandera = 0;
            let banderaSilla = '';
        
            for (i = 0; i <= 60; i++) {
                //recorremos el arreglo para encontrar si la silla en la que estamos esta ocupada
                //Bandera igual a 1 nos dira que la silla esta ocupada
                bandera = 0;
                for (j = 1; j <= c; j++) {
                    banderaSilla = i.toString();
                    if (banderaSilla == sillasOcupadas[j]) {
                        bandera = 1;
                    }
                }
                //si bandera se mantiene en 0 significa que la silla esta desocupada
                if (bandera == 0) {
                    option = document.createElement("option");
                    option.value = i.toString();
                    option.text = "Silla " + i.toString();
                    sillas.appendChild(option);
                }
            }
            sillas.options[0].selected = true;
            
        }

    });

}

//Evalua 

function EvaluarReunion2() {
    //Tomamos las fecha del sistema 
    let fechaactual = new Date();
    // tomamos que dia de la semana es Domingo es 0, y ahi se comienza 
    let diaSactual = fechaactual.getDay();
    // tomamos el dia del mes del 1 a 31
    let diaActual = fechaactual.getDate();
    // tomamos el mes que va 0 a 11 
    let mesActual = fechaactual.getMonth();
    //Domingo actual, domingo de la semana en curso 
    var domingoactual = 0;
    let domingosiguiente = 0;
    //Evaluamos la Reunion
    db.collection("Reunion").onSnapshot((querySnapshot) => {
        //Vamos a recorrer para asignar al arreglo
        let totalsillas = 0;
        //Evaluamos el dia de la semana 
        switch (diaSactual) {
            case 0:
                domingoactual = diaActual;
                break;
            case 1:
                domingoactual = diaActual + 6;
                break;
            case 2:
                domingoactual = diaActual + 5;
                break;
            case 3:
                domingoactual = diaActual + 4;
                break;
            case 4:
                domingoactual = diaActual + 3;
                break;
            case 5:
                domingoactual = diaActual + 2;
                break;
            case 6:
                domingoactual = diaActual + 1;
                break;
        }

        //Evaluamos el domingo Actual
        switch (mesActual) {
            //febrero con 28 dias 
            case 1:
                if (domingoactual > 28) {
                    domingoactual = domingoactual - 28;
                }
                break;
            //meses con 30 dias 
            case 3:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                break;
            case 8:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                break;
            case 10:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                break;
            case 5:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                break;

            //meses con 31 dias 
            case 0:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 2:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 4:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 6:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 7:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 9:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 11:
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
        }
        //obtenemos el domingo actual para luego hacer el domingo siguiente

        domingosiguiente = domingoactual + 7;

        //evaluamos el mes para saber que mes es y asi saber cuales tienen 30 o 31 dias 
        switch (mesActual) {
            //febrero con 28 dias 
            case 1:
                if (domingosiguiente > 28) {
                    domingosiguiente = domingosiguiente - 28;
                }
                break;
            //meses con 30 dias 
            case 3:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                break;
            case 8:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                break;
            case 10:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                break;
            case 5:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                break;

            //meses con 31 dias 
            case 0:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 2:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 4:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 6:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 7:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 9:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 11:
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;

        }

        let dia = 'D' + domingoactual.toString();
        //Evaluamos las sillas de la reunion en curso 
        querySnapshot.forEach((doc) => {
            if (dia = doc.data().Dia) {
                totalsillas = totalsillas + 1;
            }
        });

        if (totalsillas == 60) {
            if(contador == 0){
            alert("La Reunion del Domingo " + domingoactual + " esta llena. \rSeleccionar la siguiente Reunion");
        contador = contador+1;
        }
            Dias("0", domingosiguiente, domingoactual);
        } else {
            Dias("1", domingosiguiente, domingoactual);
        }

    });
}

function Dias(total, domingosiguiente, domingoactual) {

    //si total es 1 significa que esta vacia
    let dias = document.getElementById("Dia");
    for (i = dias.options.length - 1; i > 0; i--) {
        dias.options[i] = null;
    }

    for (i = 1; i <= 2; i++) {
        if (i == 1) {
            option = document.createElement("option");
            option.value = 'D' + domingoactual.toString();
            option.text = 'Domingo ' + domingoactual.toString();
            dias.appendChild(option);
        } else if (i == 2) {
            option = document.createElement("option");
            option.value = 'D' + domingosiguiente.toString();
            option.text = 'Domingo ' + domingosiguiente.toString();
            dias.appendChild(option);
        }
    }

    if (total == "1") {
        dias.options[0].selected = true;
        dias.options[2].disabled = true;
    } else if (total == "0") {
        dias.options[0].selected = true;
        dias.options[1].disabled = true;
    }

}


//evaluamos si la reunion esta llena o vacias
function EvaluarReunion() {

let dia = document.getElementById("Dia").value;
    db.collection("Reunion").onSnapshot((querySnapshot) => {
        //Vamos a recorrer para asignar al arreglo
        var totalsillas = 0;
        querySnapshot.forEach((doc) => {
            if(dia == doc.data().Dia){
            totalsillas = totalsillas + 1;
            }
        });
        //totalsillas = 60 means that the reunion is full
        if (totalsillas == 60) {
            mensaje("La reunion esta llena");
        }
    });
}
