// Requires
let express = require('express');

let mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let bodyParser = require('body-parser');

//Inicializar variables
let app = express();

//Body Parser

//parse application/x-www-form-urlencoded
//parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() );

//Importar rutas

let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');

//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', null,
    (err, res) => {
        if( err ) throw err;

        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    });

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () =>{
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});
