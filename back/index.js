const {conn} = require('./src/db')
const server = require('./src/app')
const tablaGenero = require('./src/routes/cargaGenero.js')
const tablaPeriodo = require('./src/routes/cargaPeriodo')
const tablaFilo = require('./src/routes/filo')
const tablaPartes = require('./src/routes/cargaPartes')
const tablaCuenca = require('./src/routes/cargaCuenca')

conn.sync({force: false}).then(()=> {

    tablaGenero();
    tablaPeriodo();  
    tablaFilo();
    tablaPartes();
    tablaCuenca();
  
    server.listen(3001, ()=> {
        console.log('funcionando')
    })
})
