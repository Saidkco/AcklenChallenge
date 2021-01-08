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
            <td>${doc.data().Silla}</td>
            <td>${doc.data().Telefono}</td>
            <td><button class="btn btn-danger" onclick="Eliminar('${doc.id}')">Eliminar</button></td>
          </tr>`
        tcont = tcont + 1;
    });
});

function Evaluar() {
    if (sessionStorage.getItem("usuario") == null) {
        alert("No tienes permiso de entrar");
        location.href = 'login.html';
    }
}

function Validar() {
    let email = document.getElementById("usuario").value;
    let password = document.getElementById("pass").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
 
            location.href = 'Tabla.html';
        })
        .catch(function (error) {
            console.error("Error al Autenticar: ", error);
            location.href = 'login.html';
        });

}

function LogOut(){
    firebase.auth().signOut().then(() => {
        sessionStorage.clear(); 
        location.href='login.html';
    });
}

function Reiniciar() {
    var datos = new Array();
    var c = 0;
    db.collection("Reunion").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            c = c + 1;
            datos[c] = doc.id;
        });

        for (i = 1; i <= c; i++) {
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
}
