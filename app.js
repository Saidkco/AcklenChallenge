//console.log("agregado");
var firebaseConfig = {
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
    var identidad = document.getElementById("Identidad").value;
}

function Guardar() {
    var nombre = document.getElementById("Nombre").value;
    var apellido = document.getElementById("Apellido").value;
    var edad = document.getElementById("Edad").value;
    var identidad = document.getElementById("Identidad").value;
    var dia = document.getElementById("Dia").value;
    var bloque = document.getElementById("Bloque").value;
    var silla = document.getElementById("Silla").value;
    var telefono = document.getElementById("Telefono").value;
    var sintomas = document.getElementById("Sintomas").value;
    var banderaID = 0;

    db.collection("Reunion").get().then((querySnapshot) => {
        var id = 0;
        var idsOcupados = new Array();
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
                Bloque: bloque,
                Silla: silla,
                Telefono: telefono,
                Sintomas: sintomas
            })
                .then(function (docRef) {
                    //console.log("Documento escrito: ID: ", docRef.id);
                    document.getElementById("Nombre").value = '';
                    document.getElementById("Apellido").value = '';
                    document.getElementById("Edad").value = '';
                    document.getElementById("Identidad").value = '';
                    document.getElementById("Dia").value = '';
                    document.getElementById("Telefono").value = '';
                    location.reload();
                    alert("Registro ingresado exitosamente, no olvides llevar tu mascarilla \r¡Te esperamos...!");
                })

                .catch(function (error) {
                    console.error("Error al Añadir: ", error);
                });
        }
    });
}

//Carga de las sillas 
function CargarSillas() {
    var bloque = document.getElementById("Bloque").value;
    var dia = document.getElementById("Dia").value;
    var sillas = document.getElementById("Silla");
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
            //&& dia == doc.data().Dia
            if (bloque == doc.data().Bloque && dia == doc.data().Dia) {
                //console.log(dia);
                //console.log(doc.data().Dia);
                c = c + 1;
                sillasOcupadas[c] = doc.data().Silla;
                //console.log(c);
                //console.log(sillasOcupadas[c]);
            }
        });
        var bandera = 0;
        var banderaSilla = '';
        if (c == 15) {
            alert("Este bloque ya se encuentra lleno.\rFavor seleccione otro.");
        } else {

            switch (bloque) {
                case 'A':
                    EnumeradorSillas(sillas, 1, bloque, 15, c, sillasOcupadas);
                    break;

                case 'B':
                    EnumeradorSillas(sillas, 16, bloque, 30, c, sillasOcupadas);
                    break;

                case 'C':
                    EnumeradorSillas(sillas, 31, bloque, 45, c, sillasOcupadas);
                    break;

                case 'D':
                    EnumeradorSillas(sillas, 46, bloque, 60, c, sillasOcupadas);
                    break;

            }
        }

    });

}


function EnumeradorSillas(sillas, cont, bloque, n, c, sillasOcupadas) {
    var bandera = 0;
    var banderaSilla = '';

    for (i = cont; i <= n; i++) {
        //recorremos el arreglo para encontrar si la silla en la que estamos esta ocupada
        //Bandera igual a 1 nos dira que la silla esta ocupada
        bandera = 0;
        for (j = 1; j <= c; j++) {
            //console.log(i);
            banderaSilla = bloque + i.toString();
            if (banderaSilla == sillasOcupadas[j]) {
                bandera = 1;
            }
        }
        //si bandera se mantiene en 0 significa que la silla esta desocupada
        //console.log(bloque);
        if (bandera == 0) {
            //bloqletra = doc.data().Bloque;
            option = document.createElement("option");
            option.value = bloque + i.toString();
            option.text = "Silla " + bloque + i.toString();
            sillas.appendChild(option);
        }
    }
    sillas.options[0].selected = true;
}


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
        //console.log(diaSactual);
        //console.lo();
        //Evaluamos el dia de la semana 
        switch (diaSactual) {
            case 0:
                domingoactual = diaActual;
                // console.log(domingoactual);
                break;
            case 1:
                domingoactual = diaActual + 6;
                //console.log(domingoactual);
                break;
            case 2:
                domingoactual = diaActual + 5;
                //console.log(domingoactual);
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
                // console.log(domingoactual);
                break;
            case 8:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                // console.log(domingoactual);
                break;
            case 10:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                // console.log(domingoactual);
                break;
            case 5:
                if (domingoactual > 30) {
                    domingoactual = domingoactual - 30;
                }
                // console.log(domingoactual);
                break;

            //meses con 31 dias 
            case 0:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 2:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 4:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 6:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 7:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 9:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;
            case 11:
                //console.log("Deberia pasar por aqui");
                if (domingoactual > 31) {
                    domingoactual = domingoactual - 31;
                }
                break;

        }

        //obtenemos el domingo actual para luego hacer el domingo siguiente

        domingosiguiente = domingoactual + 7;

        //evaluamos el mes para saber que mes es y asi saber cuales tienen 30 o 31 dias 
        // console.log("Antes de evaluar los meses");

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
                // console.log(domingoactual);
                break;
            case 8:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                // console.log(domingoactual);
                break;
            case 10:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                // console.log(domingoactual);
                break;
            case 5:
                if (domingosiguiente > 30) {
                    domingosiguiente = domingosiguiente - 30;
                }
                // console.log(domingoactual);
                break;

            //meses con 31 dias 
            case 0:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 2:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 4:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 6:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 7:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 9:
                //console.log("Deberia pasar por aqui");
                if (domingosiguiente > 31) {
                    domingosiguiente = domingosiguiente - 31;
                }
                break;
            case 11:
                //console.log("Deberia pasar por aqui");
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

        //totalsillas = 60;
        //console.log("Imprimiento las sillas ocupadas = " + totalsillas);
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

    //console.log("Hola");
    //si reunion es 1 significa que esta vacia
    //console.log(total);
    let dias = document.getElementById("Dia");
    for (i = dias.options.length - 1; i > 0; i--) {
        dias.options[i] = null;
    }

    //console.log(domingosiguiente);

    for (i = 1; i <= 2; i++) {
        if (i == 1) {
            //console.log("Hola");
            option = document.createElement("option");
            option.value = 'D' + domingoactual.toString();
            option.text = 'Domingo ' + domingoactual.toString();
            //console.log(option.text);
            // console.log(option.value);
            dias.appendChild(option);
        } else if (i == 2) {
            // console.log("Hola");
            option = document.createElement("option");
            option.value = 'D' + domingosiguiente.toString();
            option.text = 'Domingo ' + domingosiguiente.toString();
            //console.log(option.text);
            //console.log(option.value);
            dias.appendChild(option);
        }
    }
    // dias.options[0].selected = true;

    if (total == "1") {
        dias.options[0].selected = true;
        dias.options[2].disabled = true;
    } else if (total == "0") {
        dias.options[0].selected = true;
        dias.options[1].disabled = true;
    }

}

function Bloques(total) {
    //console.log("Hola");
    //si reunion es 1 significa que esta vacia
    //console.log(total);
    if (total == "1") {
        var bloque = document.getElementById("Bloque");
        for (i = bloque.options.length - 1; i > 0; i--) {
            bloque.options[i] = null;
        }

        for (i = 1; i <= 4; i++) {
            if (i == 1) {
                //console.log("Hola");
                option = document.createElement("option");
                option.value = 'A';
                option.text = 'Bloque A';
                //console.log(option.text);
                bloque.appendChild(option);
            } else if (i == 2) {
                // console.log("Hola");
                option = document.createElement("option");
                option.value = 'B';
                option.text = 'Bloque B';
                //console.log(option.text);
                bloque.appendChild(option);
            } else if (i == 3) {
                //console.log("Hola");
                option = document.createElement("option");
                option.value = 'C';
                option.text = 'Bloque C';
                //console.log(option.text);
                bloque.appendChild(option);
            } else {
                option = document.createElement("option");
                option.value = 'D';
                option.text = 'Bloque D';
                //console.log(option.text);
                bloque.appendChild(option);
            }
        }
        bloque.options[0].selected = true;
    }

}

//evaluamos si la reunion esta llena o vacias
function EvaluarReunion() {

var dia = document.getElementById("Dia").value;
    db.collection("Reunion").onSnapshot((querySnapshot) => {
        //Vamos a recorrer para asignar al arreglo
        var totalsillas = 0;
        querySnapshot.forEach((doc) => {
            if(dia == doc.data().Dia){
            totalsillas = totalsillas + 1;
            }
        });
        //totalsillas = 60;
        if (totalsillas == 60) {
            alert("La reunion se encuentra llena");
            Bloques("0");
        } else {
            Bloques("1");
        }

    });
}

//Borrar Datos 

function Eliminar(id) {
    db.collection("Datos").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

/*Actualizar

function Actualizar(id, n, a, t) {

    document.getElementById("Nombre").value = n;
    document.getElementById("Apellido").value = a;
    document.getElementById("Telefono").value = t;

    var boton = document.getElementById('boton');
    boton.innerHTML = "Editar";

    boton.onclick = function () {
        var Ref = db.collection("Datos").doc(id);

        var nombre = document.getElementById("Nombre").value;
        var apellido = document.getElementById("Apellido").value;
        var telefono = document.getElementById("Telefono").value;


        return Ref.update({
            first: nombre,
            last: apellido,
            phone: telefono
        })
            .then(function () {
                console.log("Document successfully updated!");
                boton.innerHTML = "Guardar";
                document.getElementById("Nombre").value = '';
                document.getElementById("Apellido").value = '';
                document.getElementById("Telefono").value = '';
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}*/