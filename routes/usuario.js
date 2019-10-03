// Requires

let express = require('express');

let app = express();

let Usuario = require('../models/usuario');

/**
 * Obtener todos los usuarios
 */
app.get('/', ( req, res, next ) => {

    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    errors: err
                })
            }º

            res.status(200).json({
                ok: true,
                usuarios
            })
    });
});

/**
 * Crear un nuevo usuario
 */

app.post('/', ( req, res ) => {

    let body = req.body;

    console.log("Request: " + JSON.stringify(req.body));

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado  )=> {
        console.log("Entró a save");

        if( err ){
            console.log("Hubo un error");
            return res.status(500).json({
                ok: false,
                message: 'Error al crear usuario ',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        })
    });

    res.status(200).json({
        ok: true,
        body
    })
});

module.exports = app;
