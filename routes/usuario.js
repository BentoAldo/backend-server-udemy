// Requires

let express = require('express');
let bcrypt = require('bcryptjs');

const mdAutenticacion = require('../middlewares/autenticacion');

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
            }

            res.status(200).json({
                ok: true,
                usuarios
            })
    });
});

/**
 * Crear un nuevo usuario
 */

app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado  )=> {

        if( err ){
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario ',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

/**
 * Actualizar un usuario
 */

app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById( id, 'nombre email img role' , (err, usuario) => {

        if( err ){
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario ',
                errors: err
            });
        }

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el id' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario ',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});

/**
 * Borrar un usuario por id
 */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario ',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No exisste un usuario con ese id ',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;
