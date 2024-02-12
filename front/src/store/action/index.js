import axios from "axios";
import { url } from "../../URL.js";
import Swal from "sweetalert2";

export function getDatos() {
  return function (dispatch) {
    axios.get(`${url}especimenRoute/especimen`).then((datos) => {
      dispatch({
        type: "GET_NOMBRES",
        payload: datos,
      });
    });
  };
}


export function getDatos2() {
  return function (dispatch) {
    axios.get(`${url}especimenRoute/especimenHome`).then((datos) => {
      dispatch({
        type: "GET_NOMBRES2",
        payload: datos,
      });
    });
  };
}
export function getDatos4() {
  return function (dispatch) {
    axios.get(`${url}especimenRoute/especimen4`).then((datos) => {
      dispatch({
        type: "GET_NOMBRES2",
        payload: datos,
      });
    });
  };
}

export function delEsp(e) {
  axios
    .delete(`${url}especimenRoute/especimen/` + e)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
}

export function delBochon(e) {
  axios
    .delete(`${url}bochonRoute/bochon/especimen/` + e)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
}

export function getBochones() {
  return function (dispatch) {
    axios.get(`${url}bochonRoute/bochonesHome`).then((datos) => {
      dispatch({
        type: "GET_BOCHONES",
        payload: datos,
      });
    });
  };
}
export function postDatos(payload) {
  axios.put(`${url}especimenRoute/modificar`, payload).then((response) => {
    return response;
  });
}
export function putBochon(payload) {
  axios.put(`${url}bochonRoute/bochon/modificar`, payload).then((response) => {
    return response;
  });
}
export function postEspecimen(payload) {
  axios.post(`${url}especimenRoute/especimen`, payload).then((response) => {
    return response;
  });
}

export function postBochon(payload) {
  axios.post(`${url}bochonRoute/bochon/especimen`, payload).then((response) => {
    return response;
  });
}

export function filtrarDatos(payload) {
  return function (dispatch) {
    dispatch({
      type: "FILTRAR_DATOS",
      payload: payload,
    });
  };
}

export function filtrarDatosBochon(payload) {
  return function (dispatch) {
    dispatch({
      type: "FILTRAR_DATOS_BOCHON",
      payload: payload,
    });
  };
}
export function crearUsuario(payload) {
  return function (dispatch) {
    axios
      .post(`${url}usuariosRoute/usuario`, payload)
      .then((response) => {
        dispatch({
          type: "USUARIO",
          payload: response.data,
        });
      })
      .catch((err) => {});
  };

  /*  axios.post('${url}usuario', payload)
     .then((response) => {
         return response;
       }) */
}
export function cleanFilter(payload) {
  return {
    type: "CLEAN",
    payload,
  };
}
export function usuarioup(payload) {
  return {
    type: "USUARIO_UP",
    payload,
  };
}

// ------get tablas ------------
export function getGeneroEspecie() {
  return function (dispatch) {
    axios.get(`${url}tablas/?parametro=genero`).then((datos) => {
      dispatch({
        type: "GET_GENEROESPECIE",
        payload: datos,
      });
    });
  };
}

export function getCuencaFormacion() {
  return function (dispatch) {
    axios.get(`${url}tablas/?parametro=formacion`).then((datos) => {
      dispatch({
        type: "GET_CUENCAFORMACION",
        payload: datos,
      });
    });
  };
}

export function getPeriodoEpoca() {
  return function (dispatch) {
    axios.get(`${url}tablas/?parametro=periodos`).then((datos) => {
      dispatch({
        type: "GET_PERIODOEPOCA",
        payload: datos,
      });
    });
  };
}
export function getFilo() {
  return function (dispatch) {
    axios.get(`${url}tablas/?parametro=filo`).then((datos) => {
      dispatch({
        type: "GET_FILO",
        payload: datos,
      });
    });
  };
}

export function getPartes() {
  return function (dispatch) {
    axios.get(`${url}tablas/?parametro=partes`).then((datos) => {
      var envio = [];
      datos?.data?.map((e) => {
        envio?.push(e.principal);
        if (e?.secundaria !== []) {
          e?.secundaria.map((el) => {
            envio?.push(el);
          });
        }
      });
      dispatch({
        type: "GET_PARTES",
        payload: envio,
      });
    });
  };
}
// -------------------------------------------------------------------//

// --------------FILTRADO TABLAS --------------------------------////

export function selectEspecie(payload) {
  return {
    type: "SELECT_ESPECIE",
    payload,
  };
}

export function selectCuenca(payload) {
  return {
    type: "SELECT_CUENCA",
    payload,
  };
}

export function selectEpoca(payload) {
  return {
    type: "SELECT_EPOCA",
    payload,
  };
}

export function postGeneroEspecie(modelo, gen, esp) {
  axios
    .post(
      axios.post(
        `${url}tablas?modelo=${modelo}&primario=${gen}&secundario=${esp}`
      )
    )
    .then((response) => {
      return response;
    });
}

export function postCuencaFormacion(modelo, cuenca, forma) {
  axios
    .post(
      axios.post(
        `${url}tablas?modelo=${modelo}&primario=${cuenca}&secundario=${forma}`
      )
    )
    .then((response) => {
      return response;
    });
}
export function postFilo(modelo, filoNew) {
  axios
    .post(axios.post(`${url}tablas?modelo=${modelo}&primario=${filoNew}`))
    .then((response) => {
      return response;
    });
}
//`${url}postpartes?parte=${parteNew}`
export function postParte(parte) {
  axios.post(`${url}postpartes?parte=${parte}`).then((response) => {
    return response;
  });
}
export function agregarQR(payload) {
  return {
    type: "AGREGAR_QR",
    payload,
  };
}

export function gradoAdecimal(lat, long) {
  var latitud = lat.gra + lat.min / 60 + lat.seg / 3600;

  if (lat.coord === "S") latitud = latitud * -1;

  var longitud = long.gra + long.min / 60 + long.seg / 3600;
  if (long.coord === "W") longitud = longitud * -1;

  return { latitud: latitud, longitud: longitud };
}

export function decimalAGrado(lat, lng) {
  var latn =
    Math.abs(
      lat
    ); /* Devuelve el valor absoluto de un número, sea positivo o negativo */
  var latgr = Math.floor(
    latn * 1
  ); /* Redondea un número hacia abajo a su entero más cercano */
  var latmin = Math.floor(
    (latn - latgr) * 60
  ); /* Vamos restando el número entero para transformarlo en minutos */
  var latseg =
    ((latn - latgr) * 60 - latmin) *
    60; /* Restamos el entero  anterior ahora para segundos */
  var latc =
    latgr +
    "º " +
    latmin +
    "' " +
    latseg.toFixed(2) +
    '"'; /* Prolongamos a centésimas de segundo */
  var corlat;
  var x;
  var y;

  if (lat > 0) {
    x = "N " + latc; /* Si el número original era positivo, es Norte */
    corlat = "N";
  } else {
    x = "S " + latc; /* Si el número original era negativo, es Sur */
    corlat = "S";
  } /* Repetimos el proceso para la longitud (Este, -W-Oeste) */

  var lngn = Math.abs(lng);
  var lnggr = Math.floor(lngn * 1);
  var lngmin = Math.floor((lngn - lnggr) * 60);
  var lngseg = ((lngn - lnggr) * 60 - lngmin) * 60;
  var lngc = lnggr + "º " + lngmin + "' " + lngseg.toFixed(2) + '"';
  var corlong;

  if (lng > 0) {
    y = "E " + lngc;
    corlong = "E";
  } else {
    y = "W " + lngc;
    corlong = "W";
  }

  var result = {
    latitud: {
      completa: x,
      gra: latgr,
      min: latmin,
      seg: latseg,
      coord: corlat,
    },
    longitud: {
      completa: y,
      gra: lnggr,
      min: lngmin,
      seg: lngseg,
      coord: corlong,
    },
  };

  return result;
}

export function fechaActual() {
  const date = new Date();
  const [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear(),
  ];
  var fecha = day + "/" + (month + 1) + "/" + year;
  return fecha;
}

export function subespecimen(id) {
  var nro = id.slice(0, id.length - 3);
  var sub = id.slice(id.length - 3);

  var result = "";

  if (sub == "000") {
    result = nro;
  } else {
    result = nro + "-" + sub;
  }

  return result;
}
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

/* 
      Toast.fire({      icon: 'success',
                        title: 'Cambio de PIN exitoso'
                      }) 
                      */

//FUNCIONES buscar.jsx
