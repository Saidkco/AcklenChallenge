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
            sessionStorage.setItem("usuario", email);
            location.href = 'Tabla.html';
        })
        .catch(function (error) {
            console.error("Error al Autenticar: ", error);
            alert("Correo o Contraseña incorrectos.");
            location.href = 'login.html';
        });

}


