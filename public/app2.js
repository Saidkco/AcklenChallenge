var firebaseConfig = {
    apiKey: "AIzaSyBaJ3a2Ndf67f6_57em9Yn8lS3Ci4tpzzw",
    authDomain: "acklen-project.firebaseapp.com",
    projectId: "acklen-project",
    storageBucket: "acklen-project.appspot.com",
    messagingSenderId: "101798925872",
    appId: "1:101798925872:web:23059ce8875fd2ad35bff5",
    measurementId: "G-3TV543F9XT"
  };

// Initialize Firebase
var fire = firebase.initializeApp(firebaseConfig);
var db = fire.firestore();
//leer documento 
var tabla = document.getElementById("tabla");
db.collection("Reunion").onSnapshot((querySnapshot) => {
    //inner para limpiar la tabla siempre que se recargue la pagina
    tabla.innerHTML = '';
    var tcont = 1;
    querySnapshot.forEach((doc) => {
        tabla.innerHTML += `<tr>
            <td>${tcont}</td>
            <td>${doc.data().Nombre}</td>
            <td>${doc.data().Apellido}</td>
            <td>${doc.data().Edad}</td>
            <td>${doc.data().Identidad}</td>
            <td>${doc.data().Dia}</td>
            <td>${doc.data().Bloque}</td>
            <td>${doc.data().Silla}</td>
            <td>${doc.data().Telefono}</td>
            <td>${doc.data().Sintomas}</td>
            <td><button class="btn btn-danger" onclick="Eliminar('${doc.id}')">Eliminar</button></td>
          </tr>`
        /*
        <th scope="row">${doc.id}</th>
        <td><button class="btn btn-warning" onclick="Actualizar('${doc.id}','${doc.data().first}','${doc.data().last}','${doc.data().phone}')">Editar</button></td>
            <td><button class="btn btn-danger" onclick="Eliminar('${doc.id}')">Eliminar</button></td>
        console.log(`${doc.id} => ${doc.data().first}`);*/
        tcont = tcont + 1;
    });
});

function Evaluar(){
    //console.log("Hola");
    if(sessionStorage.getItem("usuario") == null){
alert("No tienes permiso de entrar");
location.href='login.html';
    }
}

function Validar(){
    var us = document.getElementById("usuario").value;
    var pass = document.getElementById("pass").value;
    var bandera = 0; // cero es no coincidencias
    db.collection("Users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
if(us == doc.data().nick && pass == doc.data().password){
    bandera = 1;
}
        });
        // evaluamos si se encontro el usuario 
        if(bandera == 1){
            sessionStorage.setItem("usuario", us);
            location.href='Tabla.html';
        }else{
            alert("Usuario o contraseña incorrectos");
            document.getElementById("usuario").value = '';
            document.getElementById("pass").value = '';   
        }
    });
//Falta Validar que nadie mas pueda entra, que la unica forma de entrar sea pasando por el login - done
}

function Reiniciar(){
    var datos = new Array();
    var c = 0;
    db.collection("Reunion").onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        c = c+1;
        datos[c] = doc.id;
    });

    for(i=1; i<=c; i++){
        db.collection("Reunion").doc(datos[i]).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
           console.error("Error removing document: ", error);
        });

    }

});
}


function Eliminar(id) {
    db.collection("Reunion").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
    alert("Elemento eliminado correctamente");
    //location.reload();
}
