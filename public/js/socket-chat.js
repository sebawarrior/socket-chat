var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}


socket.on('connect', function() {
    console.log('Conectado al servidor');

    //Debo avisar al server que YO estoy entrando
    //Para enviar un usuario hacemos:
    // localhost:3000/chat.html?nombre=Sebastian
    // Si el servidor me acepta hacemos un callback
    socket.emit('entrarChat', usuario, function(resp){
        console.log('Usuarios conectados', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('crearMensaje', function(data) {
    console.log(data)
})

//Escuchar cambios de usuarios cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
    console.log(personas)
})

// Mensajes privados
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje privado:', mensaje)
})