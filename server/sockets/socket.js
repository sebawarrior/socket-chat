const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');
const usuarios = new Usuarios()
const {crearMensaje} = require('./../utilidades/utilidades')


io.on('connection', (client) => {
    // Cada client tiene un id único

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            })
        }

        client.join('data.sala');

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(data.sala));

        callback(usuarios.getPersonasPorSalas(data.sala))
    })

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
        
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió del chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(personaBorrada.sala));
        
    })

    //Mensajes privados

    client.on('mensajePrivado', data => {
        //Persona que emite mensaje
        let persona = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })



});