import { Toast } from "../action/index.js";

const initialState = {
  especimenes: [],
  especimenes_filtrados: [],
  generoEspecie: [],
  periodoepoca: [],
  especie: [],
  cuencaformacion: [],
  formacion: [],
  epoca: [],
  filo: [],
  partes: [],
  usuario: [],
  qrs: [],
  bochones: [],
  bochones_filtrados: [],
  especimenesHome: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "USUARIO":
      return {
        ...state,
        usuario: action.payload,
      };
    case "USUARIO_UP":
      return {
        ...state,
        usuario: action.payload,
      };
    case "GET_BOCHONES":
      return {
        ...state,
        bochones: action.payload,
      };
    case "GET_NOMBRES":
      return {
        ...state,
        especimenes: action.payload,
      };
    case "GET_NOMBRES2":
      return {
        ...state,
        especimenes: action.payload.data[0],
      };
    case "AGREGAR_QR":
      let codigo = state.qrs;
      codigo.push(action.payload);
      return {
        ...state,
        qrs: codigo,
      };
    case "FILTRAR_DATOS":
      const { parametro, busqueda } = action.payload;
      var result;
      if (parametro === "limpiar") {
        result = [];
      } else if (parametro === "numero") {
        var especimenesNew = state.especimenes;
        result = especimenesNew.filter(
          (e) =>
            e.especimennumero.slice(0, e.especimennumero.length - 2) ===
            busqueda.slice(0, busqueda.length - 2)
        );
      } else if (parametro === "desde") {
        var especimenesNew = state.especimenes;
        result = especimenesNew.filter(
          (e) =>
            Number(e.especimennumero) >= Number(busqueda[0]) &&
            Number(e.especimennumero) <= Number(busqueda[1])
        );
      } else {
        if (state.especimenes_filtrados.length === 0) {
          var especimenesNew = state.especimenes;
        } else {
          var especimenesNew = state.especimenes_filtrados;
        }

        if (parametro === "genero") {
          result = especimenesNew.filter((e) => e.genero === busqueda);
        }

        if (parametro === "prepara") {
          result = especimenesNew.filter((e) => e.url === busqueda);
        }
        if (parametro === "holotipo") {
          result = especimenesNew.filter((e) => e.holotipo === busqueda);
        }
        if (parametro === "formacion") {
          result = especimenesNew.filter((e) => e.formacion === busqueda);
          //  console.log('result --->', result)
        }
        if (parametro === "especie") {
          result = especimenesNew.filter((e) => e.especie === busqueda);
        }
        if (parametro === "filo") {
          result = especimenesNew.filter((e) =>
            e.posicionfilo.includes(busqueda)
          );
        }
        if (parametro === "partes") {
          result = especimenesNew.filter((e) =>
            e.partesesqueletales.includes(busqueda)
          );
        }
        if (parametro === "descubridor") {
          result = especimenesNew.filter((e) => e.descubridor === busqueda);
        }
        if (parametro === "campana") {
          result = especimenesNew.filter((e) => e.campana === busqueda);
        }
      }

      return {
        ...state,
        especimenes_filtrados: result,
      };

    case "CLEAN":
      return {
        ...state,
        especimenes_filtrados: [],
      };

    // ---------------FILTRO BOCHONES -----------------//
    case "FILTRAR_DATOS_BOCHON":
      const { parametro1, busqueda1 } = action.payload;
      var result;
      if (parametro1 === "limpiar") {
        result = [];
      } else if (parametro1 === "numero") {
        var especimenesNew = state.bochones.data;
        result = especimenesNew.filter((e) => e.bochonnumero === busqueda1);

        if (result.length === 0) {
          Toast.fire({
            icon: "error",
            title: "Número de Bochón no encontrado",
          });
        }
      } else if (parametro1 === "desde") {
        var especimenesNew = state.bochones.data;
        result = especimenesNew.filter(
          (e) =>
            Number(e.bochonnumero) >= Number(busqueda1[0]) &&
            Number(e.bochonnumero) <= Number(busqueda1[1])
        );

        if (result.length === 0) {
          Toast.fire({ icon: "error", title: "Números de Bochones inválidos" });
        }
      } else {
        if (state.bochones_filtrados?.length === 0) {
          var especimenesNew = state.bochones.data;
        } else {
          var especimenesNew = state.bochones_filtrados;
        }
        if (parametro1 === "solobochon") {
          if (busqueda1 == "si") {
            result = especimenesNew.filter((e) => e.especimennumero == 0);
          } else {
            result = state.bochones.data;
          }
        }
        if (parametro1 === "prepara") {
          if (busqueda1 == "si") {
            result = especimenesNew.filter((e) => e.url === busqueda1);
            console.log(result.length);
            if (result.length <= 0) {
              Toast.fire({
                icon: "error",
                title: "No encontramos bochones en preparación",
              });
            }
          } else {
            result = state.bochones.data;
          }
        }

        if (parametro1 === "genero") {
          result = especimenesNew.filter((e) => e.genero === busqueda1);
        }
        if (parametro1 === "especie") {
          result = especimenesNew.filter((e) => e.especie === busqueda1);
        }
        if (parametro1 === "formacion") {
          result = especimenesNew.filter((e) => e.formacion === busqueda1);
          //  console.log('result --->', result)
        }
        if (parametro1 === "filo") {
          result = especimenesNew.filter((e) =>
            e.posicionfilo.includes(busqueda1)
          );
        }
        if (parametro1 === "partes") {
          result = especimenesNew.filter((e) =>
            e.partesesqueletales.includes(busqueda1)
          );
        }
        if (parametro1 === "descubridor") {
          result = especimenesNew.filter((e) => e.descubridor === busqueda1);
        }
        if (parametro1 === "campana") {
          result = especimenesNew.filter((e) => e.campana === busqueda1);
        }
      }

      return {
        ...state,
        bochones_filtrados: result,
      };

    case "CLEAN":
      return {
        ...state,
        bochones_filtrados: [],
      };

    // ---------- GET DE TABLAS --------------------------//
    case "GET_GENEROESPECIE":
      return {
        ...state,
        generoEspecie: action.payload.data,
      };

    case "GET_CUENCAFORMACION":
      return {
        ...state,
        cuencaformacion: action.payload.data,
      };

    case "GET_PERIODOEPOCA":
      return {
        ...state,
        periodoepoca: action.payload.data,
      };
    case "GET_FILO":
      return {
        ...state,
        filo: action.payload.data,
      };
    case "GET_PARTES":
      return {
        ...state,
        partes: action.payload,
      };

    //-----------------------------------------------------------------//
    // ------------- FILTRADO DE TABLAS--------------------------------//

    case "SELECT_ESPECIE":
      let filtrado = state.generoEspecie.filter(
        (el) => el.genero === action.payload
      );
      return {
        ...state,
        especie: filtrado[0].especie,
      };

    case "SELECT_CUENCA":
      let filtradoFormacion = state.cuencaformacion.filter(
        (el) => el.cuenca === action.payload
      );

      return {
        ...state,
        formacion: filtradoFormacion[0].formacion,
      };

    case "SELECT_EPOCA":
      let filtradoEpoca = state.periodoepoca.filter(
        (el) => el.periodo === action.payload
      );

      return {
        ...state,
        epoca: filtradoEpoca[0].epoca,
      };

    default:
      return state;
  }
}
