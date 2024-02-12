import axios from "axios";
import React, { useEffect, useState} from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import dino from  "../img/dinoGif.gif";
import { getCuencaFormacion, getFilo,getPartes, getGeneroEspecie, getPeriodoEpoca, postDatos, postEspecimen, postFilo,postCuencaFormacion, postGeneroEspecie, selectCuenca, selectEpoca, selectEspecie, postBochon,postParte } from "../../store/action";
import '../MODIFICACIONES/actualizarEspecimen.css'
import Swal from 'sweetalert2'
import crono from '../../pdf/ChronostratChart2022-02SpanishAmer.pdf'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import {gradoAdecimal,decimalAGrado,Toast} from "../../store/action/index";
import Menu from "../NAVBAR/menu";
import {url} from '../../URL.js'
import { BiPaste,BiArrowBack,BiArchiveIn } from "react-icons/bi";
import Resizer from "react-image-file-resizer";
import {useTranslation} from "react-i18next";
import { subirImg } from "../control-img";

export default function CrearEspecimen(){
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const generoEspecie = useSelector((state)=> state.generoEspecie)
    const especiefiltrada = useSelector((state)=> state.especie)
    const [todos, setTodos] = useState(null)
    const filogenia = useSelector((state)=> state.filo )
    const partes = useSelector((state)=> state.partes )
    const periodoEpoca = useSelector((state)=> state.periodoepoca.sort())
    const epocaFiltrada = useSelector((state)=> state.epoca)
    const [pisoFiltrado, setPisoFiltrado] = useState(null)
    const [imagenSelected, setImagenSelected] = useState(null)
    const [control, setControl] = useState(null)
    const [imagenes , setImagenes] = useState([])
    const [pdfs, setPdfs] = useState([])
    const cuencaformacion = useSelector((state)=> state.cuencaformacion )
    const formacion = useSelector((state)=> state.formacion )
    const[coordenadas, setCoordenadas] = useState()
    const [errors, setErrors] = useState({genero:false,especie:false,cuenca:false,formacion:false})
    const [ prueba, setPrueba] = useState([''])
    const [crear, setCrear] = useState({posicionfilo:[], partesesqueletales:[], publico:'no', holo:'no' })
    const [texto, setTexto] = useState([])
    const [newId, setNewId] = useState(null);
    const [numeroId, setNumeroId] = useState(null);
    const [sub, setSub] = useState(null);
    const [spinner, setSpinner] = useState(0);
    const [copiarInfo, setCopiarInfo] = useState(0);
    const [reservarInput, setReservarInput] = useState(0)
    const  [ newIdBochon,setNewIdBochon] = useState(null)
    const [t, i18n] = useTranslation("global")
    const [latitud, setLat] = useState(
        {
                    gra:0,
                    min:0,
                    seg:0,
                    coord:'S',
           
    })
    const [longitud, setLong] = useState(
        {
                     gra:0,
                    min:0,
                    seg:0,
                    coord:'W',
           
    })
   
    let que = useParams().que;

    var checkHolo='';
    var checkPublico='';

    if(crear.holo===""||crear.holo==="no")checkHolo='true';

    if(crear.publico===""||crear.publico==="no")checkPublico='true';

    //---------------------use efect--------------------------//
    useEffect(() => {
        
        axios.get(`${url}bochonRoute/bochon/especimen/?parametro=nuevo`)
        .then((response) => {
            setNewIdBochon(response.data)
        })
         axios.get(`${url}especimenRoute/especimen/?parametro=nuevoEsp`)
        .then((respons) => {
            setNewId(respons.data)

        }) 
        
        dispatch(getGeneroEspecie())
        dispatch(getCuencaFormacion())
            dispatch(getPeriodoEpoca())
            dispatch(getFilo())
            dispatch(getPartes())
          setCrear({
            posicionfilo:[], partesesqueletales:[], publico:'no', holo:'no'
          })
          setTexto(
            document.querySelectorAll('input')
          )
          setImagenes([])
          axios.get(`${url}datalist/`)
        .then((response2) => {
            setTodos(response2.data)
         })
            return () => {
              setNewId(null)  
            }
        }, []);

        
function filtrargenero(e){
         let comprobar = generoEspecie.filter((el) => el.genero === e.target.value )
 
     if(comprobar.length === 0 && e.target.value.length>0){
         setErrors({...errors,
             genero: "agregar genero",
         })
     }else {
     setErrors({...errors,genero:false})
     dispatch(selectEspecie(e.target.value))
     e.preventDefault()
     setCrear({
         ...crear,
         [e.target.name] : e.target.value
     })
 }
 }
 /// validacion de id null cuando no hay especimenes previos
 console.log("newIdBochon --- >>>",newIdBochon?.newId)
 if(!newId?.newId){
    setNewId({...newId,
    newId:1})
 }
 if(!newIdBochon?.newId){
    setNewIdBochon({...newIdBochon,
    newId:1})
 }

var contImg=0;
function filtrarEspecie(e){
    let comprobar1 = especiefiltrada.filter((el) => el === e.target.value )
    let generoInput = document.getElementById('genero-Input').value
    if(e.target.value.length === 0){
        setErrors({...errors,especie:false})
    }
    else if(comprobar1.length === 0 ){
        setErrors({...errors,
            especie: "agregar especie"
        })
       
    }else {
        setErrors({...errors,especie:false})
    e.preventDefault()
    setCrear({
        
        ...crear,
        [e.target.name] : e.target.value
    })
}
}
 
function filtrarEpoca(e){
    dispatch(selectEpoca(e.target.value))
    e.preventDefault()
   
    setCrear({
        
        ...crear,
        [e.target.name] : e.target.value
    })
}

function filtrarPiso(e){
    let piso = epocaFiltrada.filter(el => el.nombre === e.target.value)
    setPisoFiltrado(piso[0].piso)
     e.preventDefault()
     setCrear({
         
         ...crear,
         [e.target.name] : e.target.value
     })
 }

// ------------------- CREAR GENERO/ESPECIE------------------------------//

function crearGeneroEspecie(e){
    e.preventDefault()
    let generoInput = document.getElementById('genero-Input').value
    let modelo = 'genero'
        setErrors({...errors,genero:false})
        document.getElementById('especie-Input').value='';
        setCrear({
            ...crear,
            genero: generoInput
        })
        dispatch(postGeneroEspecie(modelo, generoInput))
        setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")

}
function crearEspecie(e){

    e.preventDefault()
    let generoInput = document.getElementById('genero-Input').value
    let especieInput = document.getElementById('especie-Input').value
    let modelo = 'genero'

    setErrors({...errors,especie:false})
    setCrear({
        ...crear,
        especie: especieInput
    })
    dispatch(postGeneroEspecie(modelo, generoInput, especieInput))
    setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")

}
function crearCuenca(e){
   e.preventDefault()
    let cuenca2 = document.getElementById('cuenca').value

    setCrear({
        ...crear,
        cuenca: cuenca2,
    })
    let modelo = 'cuenca'
        setErrors({...errors,cuenca:false})
       document.getElementById('formacion-in').value=''
    
        dispatch(postCuencaFormacion(modelo, cuenca2))
        setTimeout(() => {dispatch(getCuencaFormacion())}, "1000")

}

function crearFormacion(e){
    e.preventDefault()
    let cuenca2 = document.getElementById('cuenca').value
    let forma = document.getElementById('formacion-in').value
    setCrear({
        ...crear,
        formacion: forma,
    })

    let modelo = 'cuenca'
        setErrors({...errors,formacion:false})
        dispatch(postCuencaFormacion(modelo, cuenca2, forma))
        setTimeout(() => {dispatch(getCuencaFormacion())}, "1000")
      

}

// ------------------------ posicion filogenetica ------------------------//
//................ELIMINA SELECCIONADO----
function handleDelete(el,e){
    e.preventDefault()
    let cambio = prueba.filter( occ => occ !== el)
         setPrueba(
             cambio
         )

     setCrear({
        ...crear,
        posicionfilo: crear.posicionfilo.filter( occ => occ !== el)
    })
    
 }
 // ------------------------ partes  esqueletales ------------------------//
 function  handleDeletePartes(el,e){
    e.preventDefault()
    let cambio = prueba.filter( occ => occ !== el)
         setPrueba(
             cambio
         )

     setCrear({
        ...crear,
        partesesqueletales: crear.partesesqueletales.filter( occ => occ !== el)
    })
    
 }

 //------- AGREGA UNA NUEVA POSICION FILO---------------//
 
 
    
    
    function handleSelectionFilo(e){
        if(prueba.includes(e.target.value)){
          return(Toast.fire({icon: 'error',title:  t("-FILO")}) )
        }else{

        setPrueba([...prueba, e.target.value])
        setCrear({
          ...crear,
          posicionfilo: [...crear.posicionfilo, e.target.value]
        })
    }
  
  
      
}
function handleSelectionPartes(e){
    if(prueba.includes(e.target.value)){
        return(Toast.fire({icon: 'error',title:  t("-PARTE")}) )
      }else{

        setPrueba([...prueba, e.target.value])
    setCrear({
      ...crear,
      partesesqueletales: [...crear.partesesqueletales, e.target.value]
    })
}

}

function modificarEspe (e) { // funcion para actualizar datos del estado(con las modificaciones)
    e.preventDefault()
    setCrear({ 
        ...crear,
        [e.target.name] : e.target.value
    })
}
const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200,
      1200,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
  const handleImg = async (e) => {
    e.preventDefault()
  
    var file = e.target.files[0];
    let result =  await subirImg(file)
    let image = result.path
            setImagenes([...imagenes,image])
            setCrear({
                ...crear,
                imagen: [...imagenes, image]
            })
            if (file) {
                
                setImagenSelected(image);
            }       
        }
    
    
    function eliminarImagen(el,e){
        console.log(el + "el")
      let nuevo = imagenes.filter( occ => occ !== el)
      let path = el.slice(2)
      console.log(path + "path")
      axios.delete(`${url}eliminar-archivo-img?nombreArchivo=` + path)
        setImagenes(nuevo)
       setCrear({
        ...crear,
        imagen: nuevo
    })
        
    }

 function submitEspecimen(e){ // funcion submit + modal de cartel 
    e.preventDefault()
   if(que === 'especimen' && !crear.especimennumero){
    crear.especimennumero = newId.newId+'000';
    if(crear.bochonnumero === newIdBochon.newId){
        delete crear.bochonnumero
    }
   } else if( que === 'bochon' && !crear.bochonnumero){
    crear.bochonnumero = newIdBochon.newId
   delete  crear.especimennumero 
   }
   var coorde=gradoAdecimal(latitud,longitud)
   
 
   Swal.fire({
        title: t("COMFIRM"),
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: t("SI"),
        denyButtonText: t("NO"),
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          
           
         if(que === 'especimen'){
            
            axios.post(`${url}especimenRoute/especimen`, [crear,coorde])
              .then(res => {if(res.status == 202){
                Swal.fire(t("CREADO"), '', 'success')
                 setTimeout(() => {window.location.reload()}, "1000")
              } else{ Swal.fire(t("NOCAMBIO"), '', 'warning')
              setTimeout(() => {window.location.reload()}, "2000")
                    }})
             
          } else if( que === 'bochon'){
            console.log('entra bochon')
             axios.post(`${url}bochonRoute/bochon/especimen`,[crear,coorde])
             .then(res => {if(res.status == 202){
                console.log(res.status)
                Swal.fire(t("CREADOBO"), '', 'success')
                setTimeout(() => {window.location.reload()}, "1000")
             } else{ 
                console.log(res.status)
                console.log('error bochon')
                Swal.fire(t("NOCAMBIO"), '', 'warning')
             setTimeout(() => {window.location.reload()}, "2000")
                   }})
           
          } else {
            Toast.fire({icon: 'error',title: 'Debes seleccionar que quieres crear (genero/bochon)'}) 
          
          } 

        } else if (result.isDenied) {
          Swal.fire(t("NOCAMBIO"), '', 'info')
        }
      })
}
let filoNombre = filogenia.map(el => el.filo)

function agregarFilo(e){
    e.preventDefault()
      
   
    const { value: formValues } =  Swal.fire({
        title: t("+FILO") ,
        html:
          
          '<input id="swal-input2" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
            var filo1
            document.getElementById('swal-input2').value.length===0?       Swal.fire(
                t("VACIO"),
                t("VOLVER"),
                'error'
              ): filo1 =  document.getElementById('swal-input2').value
          let filoNew = filo1[0].toUpperCase() + filo1.slice(1)
            let modelo = 'filo'
                Toast.fire({icon: 'success',title: t("EXITO")}) 
          return [
              filoNew.length===0?null:
              setCrear({
                ...crear,
                posicionfilo: [...crear.posicionfilo,filoNew]
              }),
              setTimeout(() => {
                dispatch(postFilo(modelo, filoNew))
                dispatch(getFilo())
                }, "2000"), 
        
          ]
        }
      })

      if (formValues) {
        Swal.fire(JSON.stringify(formValues))
        
      }
}

function agregarParte(e){
    e.preventDefault()
     const { value: formValues } =  Swal.fire({
        title:t("+ESQ") ,
        html:
          '<input id="swal-input21" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
            var parte
            document.getElementById('swal-input21').value.length===0?       Swal.fire(
                t("VACIO"),
                t("VOLVER"),
                'error'
              ): parte =  document.getElementById('swal-input21').value
          let parteNew = parte[0].toUpperCase() + parte.slice(1)
          Toast.fire({icon: 'success',title:   t("EXITO")}) 
          return [
              setCrear({
                ...crear,
                partesesqueletales: [...crear.partesesqueletales,parteNew]
              }),
               setTimeout(() => {
                dispatch(postParte(parteNew))
                }, "1000"), 
          ]
        }
      })

      if (formValues) {
        Swal.fire(JSON.stringify(formValues))
      } 

}

function modificarPublico(e){
        setCrear({
            ...crear,
            publico: e.target.value,
        })  
   
    
}
function modificarHolotipo(e){
    setCrear({
        ...crear,
        holo: e.target.value,
    })  

      
  }

  const subirArchivo = async (e) => {
   
    const archivos = await e.target.files;
    
    const data = new FormData();
  
    data.append('archivo', archivos[0]);
  setSpinner(1)
    axios.post(`${url}subir-archivo`, data)
    .then(data => {
        setSpinner(0)
      setPdfs([...pdfs, data.data.filename])
      setCrear({
        ...crear,
        pdf: [...pdfs,data.data.filename]
      })
    })
    .catch(error => {
    });
    
}
function eliminarArchivo(e, el){
    e.preventDefault();
    axios.delete(`${url}eliminar-archivo?nombreArchivo=` + el)
    let nuevo = pdfs.filter( occ => occ !== el)
    setPdfs(nuevo)
}

function modificarCoorLong(e){
  if(e.target.name==='coord'){
    setLong({
        ...longitud,
        [e.target.name]:e.target.value,
    
    })

  }else{ 
    if(e.target.name === 'gra'){
        var co = document.getElementById('input4').value
        
        let co2 = document.getElementById('input5')
        if(co.length == 2){
            co2.focus()
        }
    } else if(e.target.name === 'min'){
        let co = document.getElementById('input5').value
        let co2 = document.getElementById('input6')
        if(co.length == 2){
            co2.focus()
        }
    }
        setLong({
        ...longitud,
        [e.target.name]:Number(e.target.value),

    })
    
}
    
  }
  function modificarCoorLat(e){
  if(e.target.name==='coord'){
    setLat({
        ...latitud,
        [e.target.name]:e.target.value,

    })
      

  }else{ 
    if(e.target.name === 'gra'){
        let co = document.getElementById('input1').value
        let co2 = document.getElementById('input2')
        if(co.length == 2){
            co2.focus()
        }
    } else if(e.target.name === 'min'){
        let co = document.getElementById('input2').value
        let co2 = document.getElementById('input3')
        if(co.length == 2){
            co2.focus()
        }
    }
   
    setLat({
        ...latitud,
        [e.target.name]:Number(e.target.value),

    })
      
}
  }

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function handleCuenca(e){
     e.preventDefault()
    let comprobar = cuencaformacion.filter((el) => el.cuenca === e.target.value)
    if(comprobar.length === 0 && e.target.value.length>0){
        setErrors({...errors,
            cuenca: "agregar cuenca"
        })
    }else {
        setErrors({...errors, cuenca:false})
        setTimeout(() => {dispatch(selectCuenca(e.target.value))}, "1000")
        setCrear({
               ...crear,
               cuenca : e.target.value
           })
}
  }

  function handelForma(e){
 e.preventDefault()
      let comprobar = formacion.filter((el) => el === e.target.value )
  
      if(comprobar.length === 0 && e.target.value.length>0){
          setErrors({...errors,
              formacion: "agregar formación"
          })
         
      }else {
          setErrors({...errors,formacion:false})
            e.preventDefault()
            
             setCrear({
                 
                 ...crear,
                 formacion: e.target.value
             })
        
  }
  
    }


function cambiarNumeroEspecimen(e){
   
    
    if(que === 'especimen'){
       var caca=newId.numero[0].filter(el=>el.especimennumero.slice(0,el.especimennumero.length-3)==e.target.value)
       let sub2='';

        if(caca.length>0){
            if(caca.length<10){
                setSub('00'+ caca.length)
                sub2='00'+caca.length;
            }else if(caca.length<100){
                setSub('0' + caca.length.toString())
                sub2='0'+caca.length
              
            } else if(caca.length>99){
                setSub( caca.length.toString())
                sub2=caca.length
            }
        }else{
            setSub('000')
            sub2='000'
        }
setCrear({
    ...crear,
    especimennumero:e.target.value+sub2,
    bochonnumero:'',
}) 
    } else if (que === 'bochon') {
        setCrear({
            ...crear,
            bochonnumero: e.target.value,
        }) 
    } 
}
function SortArray(x, y){
    if (Number(x) < Number(y)) {return -1;}
      if (Number(x) > Number(y)) {return 1;}
      return 0;
    }
    if(newId?.newId>1){
        var numerosSort = newId?.numeros.sort(SortArray)
    }    
    function botonCopiar () {
    setCopiarInfo(1)
}

function cancelar(){
    
    setCopiarInfo(0)
}
function cancelarR(){
    
    setReservarInput()
}

function copiar (){
if(que === 'especimen'){
    var id = document.getElementById('traer-especimen').value
    id = id + '000'
    

    if(!newId.faltantes.includes(id)){
        Toast.fire({icon: 'error',title: 'Número de especimen inexistente'}) 
       
    } else{
       
     
      
     axios.get(`${url}especimenRoute/especimen/id?id=${Number(id)}`)
    .then(res => {
        var coord =  decimalAGrado(res.data.coordlat,res.data.coordlong)
        document.getElementById('periodo-input').value = res.data.periodo
        document.getElementById('epoca-input').value = res.data.epoca
        document.getElementById('piso-input').value = res.data.piso
        document.getElementById('cuenca').value = res.data.cuenca
        document.getElementById('formacion-in').value = res.data.formacion
        document.getElementById('miembro-input').value = res.data.miembro
        document.getElementById('localidad-input').value = res.data.localidad
        document.getElementById('campana-input').value = res.data.campana
        document.getElementById('fechaC-input').value = res.data.fechadescubrimiento
        document.getElementById('input1').placeholder = coord?.latitud.gra
        document.getElementById('input2').placeholder = coord?.latitud.min
        document.getElementById('input3').placeholder = coord?.latitud.seg
        document.getElementById('input4').placeholder = coord?.longitud.gra
        document.getElementById('input5').placeholder = coord?.longitud.min
        document.getElementById('input6').placeholder = coord?.longitud.seg
         setLat({
            coord: coord.latitud.coord,
            gra:coord.latitud.gra,
            min:coord.latitud.min,
            seg:coord.latitud.seg
         })
         setLong({
            coord: coord.longitud.coord,
            gra:coord.longitud.gra,
            min:coord.longitud.min,
            seg:coord.longitud.seg,
         })
        setCrear({
            ...crear,
            periodo: res.data.periodo,
            epoca:  res.data.epoca,
            piso: res.data.piso,
            cuenca: res.data.cuenca,
            formacion: res.data.formacion,
            miembro:res.data.miembro,
            localidad: res.data.localidad,
            campana: res.data.campana,
            fechadescubrimiento:res.data.fechadescubrimiento,
            posicionfilo: res.data.posicionfilo,
        })
        setCopiarInfo(0)
    }) 
}
}else if(que == 'bochon'){
    var id = document.getElementById('traer-especimen').value
    
    if(newIdBochon.faltantes.includes(Number(id))||newIdBochon.newId==id){
        Toast.fire({icon: 'error',title: 'Número de Bochón inexistente'}) 
    } else{
    
    axios.get(`${url}bochonRoute/bochon/especimen/id?id=${id}`)
    .then(res => {
        var coord =  decimalAGrado(res.data.coordlat,res.data.coordlong)
        document.getElementById('periodo-input').value = res.data.periodo
        document.getElementById('epoca-input').value = res.data.epoca
        document.getElementById('piso-input').value = res.data.piso
        document.getElementById('cuenca').value = res.data.cuenca
        document.getElementById('formacion-in').value = res.data.formacion
        document.getElementById('miembro-input').value = res.data.miembro
        document.getElementById('localidad-input').value = res.data.localidad
        document.getElementById('campana-input').value = res.data.campana
        document.getElementById('fechaC-input').value = res.data.fechadescubrimiento
        document.getElementById('input1').placeholder = coord?.latitud.gra
        document.getElementById('input2').placeholder = coord?.latitud.min
        document.getElementById('input3').placeholder = coord?.latitud.seg
        document.getElementById('input4').placeholder = coord?.longitud.gra
        document.getElementById('input5').placeholder = coord?.longitud.min
        document.getElementById('input6').placeholder = coord?.longitud.seg
         setLat({
            coord: coord.latitud.coord,
            gra:coord.latitud.gra,
            min:coord.latitud.min,
            seg:coord.latitud.seg
         })
         setLong({
            coord: coord.longitud.coord,
            gra:coord.longitud.gra,
            min:coord.longitud.min,
            seg:coord.longitud.seg,
         })
        setCrear({
            ...crear,
            periodo: res.data.periodo,
            epoca:  res.data.epoca,
            piso: res.data.piso,
            cuenca: res.data.cuenca,
            formacion: res.data.formacion,
            miembro:res.data.miembro,
            localidad: res.data.localidad,
            campana: res.data.campana,
            fechadescubrimiento:res.data.fechadescubrimiento,
            posicionfilo: res.data.posicionfilo,
        })
        setCopiarInfo(0)
    })
    } 
}

}

function stateReservar() {
    setReservarInput(1)
}
function  reservar(e){
    let input = document.getElementById('reservar-especimen')?.value
    if(input.length > 0) {
        Swal.fire({
            title: '¿'+ t("SEG") +" "+ input+" "+ t("CAMPOS")+"?",
            toast: true,
            position: 'top-end',
            showDenyButton: true,
            confirmButtonText: t("SI") ,
            denyButtonText: t("CAN") ,
          }).then((result) => {
            if (result.isConfirmed) {
                if(que == 'especimen') {
                    axios.post(`${url}reserva/` + input)
                    .then(res => Toast.fire({
                        icon: 'success',
                        title: `${res.data}`
                      }), setReservarInput(0),
                     
                    )
                } else if(que == 'bochon'){
                    axios.post(`${url}bochon/reserva/` + input)
                    .then(res =>  Toast.fire({icon: 'success',title: res.data}) ,setReservarInput(0))
                }
            } else {
                Toast.fire({icon: 'error',title:t("NORES")})
            }
                    
            
          })
        }
          else {
            Toast.fire({icon: 'warning',title:t("VALID")})
        }
}

function SortArray31(x, y, param){
    if (x.genero < y.genero) {return -1;}
    if (x.genero > y.genero) {return 1;}
    return 0;
}

function SortArray2(x, y, param){
if (x.periodo < y.periodo) {return -1;}
if (x.periodo > y.periodo) {return 1;}
return 0;


}

let generoSort=generoEspecie.sort(SortArray31);
let periodoSort=periodoEpoca.sort(SortArray2);
return (   
    crear?
    <div className="container34">
                
    <datalist id='generoEspecie'>
        {
            generoSort?.sort().map(el => {return <option>{el.genero}</option>})
        }

    </datalist>
    <datalist id='formacionCuenca'>
        {
            cuencaformacion?.sort().map(el => {return <option>{el.cuenca}</option>})
        }

    </datalist>
    <datalist id='formacion'>
        {
           formacion?.sort().map(el => {return <option>{el}</option>})
        }

    </datalist>
    <datalist id='especiefiltrada'>
        {
            especiefiltrada?.sort().map(ele => {return <option>{ele}</option>})
           
        }
       
    </datalist>

    <datalist id='periodoEpoca'>
        {
            periodoSort?.map(elem => {return <option>{elem.periodo}</option>})
           
        }
         <datalist id='epocaFiltrada'>
        {
            epocaFiltrada?.sort().map(eleme => {return <option>{eleme.nombre}</option>})
           
        }
       
    </datalist>
    <datalist id='pisoFiltrado'>
        {
           pisoFiltrado?.sort().map(eleme => {return <option>{eleme}</option>})
           
        }
       
    </datalist>
       
    </datalist>
    <datalist id='posiFilo'>
        {
            filogenia?.sort().map(elemento => {return <option>{elemento.filo}</option>})
        }
    </datalist>
    <datalist id='descubridor'>
                    {
                    todos?.descubridor?.sort().map(el => {return <option>{el}</option>})
                    }

                </datalist>
                <datalist id='miembro'>
                    {
                    todos?.miembro?.sort().map(el => {return <option>{el}</option>})
                    }

                </datalist>
                <datalist id='localidad'>
                    {
                    todos?.localidad?.sort().map(el => {return <option>{el}</option>})
                    }

                </datalist>
                <datalist id='campana'>
                    {
                    todos?.campana?.sort().map(el => {return <option>{el}</option>})
                    }

                </datalist>
                <datalist id='preparador'>
                    {
                    todos?.preparador?.sort().map(el => {return <option>{el}</option>})
                    }

                </datalist>
   
    <div>
        {que==='especimen'?<Menu activo={2}/>:<Menu activo={3}/>}
     
    </div>
   
    <div className="contenido34">
        <div className="cabecera">
                {que==='especimen'?
                <> <div className="vuelve">
                <Link to={'/home/'} className="limpiar">{t("VOLVER")}</Link>
                </div>
      <div className="a">
      {t("+CREAES")} 
      <select onChange={(e) => cambiarNumeroEspecimen(e)} class='select-numeroespecimen'>
        <option value={newId?.newId}>{newId?.newId}</option>
        {
            newId?.newId>1? numerosSort?.map(el => {return <option value={el}>{el}</option>}):<option value=""></option>
        }
      </select>
      <p> SUB: {sub?sub:'000'} </p>
      </div>
      {
        copiarInfo == 1 ? 
        <> 
        <input placeholder='nro esp..' id='traer-especimen' type="number"></input>
        <button onClick={(e)=> copiar()} class='boton-copiar-1'>✔</button>
        <button onClick={(e)=> cancelar()} class='boton-copiar-1'>❌</button>
        </>
        :<button onClick={(e)=> botonCopiar()} class='boton-copiar'><span tooltip={t("COPY")}><BiPaste fontSize='1.4rem'/></span></button>
      }
         </>                   
                :
                <> <div className="vuelve">
                <Link to={'/home/bochon'} className="limpiar">{t("VOLVER")}</Link>
                </div>
      <div className="a">
      {t("+CREABO")} 
      <select onChange={(e) => cambiarNumeroEspecimen(e)} class='select-numeroespecimen'>
        <option value={newIdBochon?.newId}>{newIdBochon?.newId}</option>
        {
            newIdBochon?.newId>1?newIdBochon.faltantes.map(el => {return <option value={el}>{el}</option>}):<option value=""></option>
        }
      </select>
      </div>
      {
        copiarInfo == 1 ? 
        <> 
        <input placeholder='nro esp..' id='traer-especimen' type="number"></input>
        <button onClick={(e)=> copiar()} class='boton-copiar-1'>✔</button>
        <button onClick={(e)=> cancelar()} class='boton-copiar-1'>❌</button>
        </>
        :
        <button onClick={(e)=> botonCopiar()} class='boton-copiar'><span tooltip={t("COPYBO")}><BiPaste fontSize='1.4rem'/></span></button>
      }
      </>
              

    }
    {
        reservarInput == 1 ? <><input placeholder='cantidad...' type="number" id='reservar-especimen'></input>
        <button onClick={(e)=> reservar(e)} >✔</button><button onClick={(e)=> cancelarR(e)} >❌</button></>:
        <button className="boton-copiar" onClick={(e)=> stateReservar()}><span tooltip={que==='especimen'?t("RES"):t("RESBO")}><BiArchiveIn fontSize='1.4rem'></BiArchiveIn></span></button>
    }
        </div>
        <div className="cuerpo">
            <div className="col1">
          <div className="info1">
                                    <div className=" texto">
                                        <label className="label">{t("GENRE")}:</label>
                                        </div>
                                    <div className="content">

                                    <input type='text' id='genero-Input' className="in" name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}}/>
                                    {
                                        errors.genero?<p  className="p2" onClick={(e)=> crearGeneroEspecie(e)}>+ agregar género</p>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="info1">
                                 <div className=" texto">
                                   <label className="label">{t("SPECIES")}:</label>
                                 </div>
                                 <div className="content">
                                    <input type='text' id = 'especie-Input'class='in'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}}/>
                                    {
                                      errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ agregar especie</p>
                                        :  <></>
                                    }
                                 </div>
                            </div>
                            <div className="info1">
                              <div className=" texto">
                                <label className="label">{t("BOCHCNRO")}</label>
                            </div>
                            <div className="content">
                                {que==='especimen'?<input type='number'  min={0} class='in' name='bochonnumero' onChange={(e)=> {modificarEspe(e)}} />
                                :<input disabled='true' type='number'  min={0} class='in' name='especimennnumero' onChange={(e)=> {modificarEspe(e)}} />}
                            </div>
                                </div>
                                <div  class='info1'>
                <div className="texto">
                 <label className="label">{t("DISCOVERER")}:</label>
                </div>
          <div className="content">
          <input type='text' class='in' name='descubridor' list='descubridor' onChange={(e)=> {modificarEspe(e)}} />
          </div>
            </div>
                <div className="info3">
                     <div className="mostrador">
                        <div className="cabeza">
                        <label className="lab">{t("PHYLOGENETICS")}</label>
                                    <select  onChange={(e)=>handleSelectionFilo(e)} >
                                    <option>{t("SEL")}...</option>
                                        {
                                                filoNombre.sort().map(ee => {return <option value={ee}>{ee}</option>})
                                            }
                                    </select> 
                        </div>
                         {crear.posicionfilo.length===0?<div className="mostradores">{t("NOFILO")}</div>:crear.posicionfilo.length<9?crear.posicionfilo?.map(el => {return <div className="caca" onClick={(e)=> handleDelete(el, e)}><span tooltip={t("CLICK")}  >{el} </span></div>}):
                         crear.posicionfilo?.map(el => {return <div className="caca11" onClick={(e)=> handleDelete(el, e)}><span tooltip="click para eliminar" >{el} </span></div>})} 
                         </div>
                         <div className="base1" onClick={(e)=> agregarFilo(e)} >
                         <h6 className="h67"> +  {t("+POS")}</h6>
                     </div>
                </div>
                <div className="info3">
                    <div className="mostrador2">   
                    <div className="cabeza">        
                    <label className="lab"> {t("PARTS")}:</label>
                     <select onChange={(e)=>handleSelectionPartes(e)}>
                     <option>{t("SEL")}...</option>
                                        {
                                            partes.map(el => {return <option value={el}>{el}</option>})
                                        }
                                    </select> 
                                    </div>
                                {
                                crear?.partesesqueletales?.length===0?<div className="mostradores">{t("NOPAR")}</div>:crear?.partesesqueletales?.length<9?crear?.partesesqueletales?.map(el => {return <div className="caca" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip={t("CLICK")}  >{el} </span></div> }):
                                crear?.partesesqueletales?.map(el => {return <div className="caca11" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip="click para eliminar" >{el} </span></div> })  
                                } 
                            </div>
                                 <div className="base1" onClick={(e)=> agregarParte(e)} >
                                                <h6 className="h67"> + {t("+PAR")}</h6>
                                            </div>
                </div>
            </div> 
            <div className="col1">
                <div className="info1">
                   <div className="texto"><span title={t("TABLA")}>
                   <label className="label"><a className="labelH" href={crono} target='_blank'>{t("PERIODO")}: </a></label>
                   </span>
                   </div>
                   <div className="content">
                   <input type='text' name='periodo' id='periodo-input' className="in"  autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}} />
                   </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("EPOCA")}:</label>
                    </div>
                    <div className="content">
                    <input type='text'  id='epoca-input' className="in" name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)} } />
                    </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("PISO")}:</label>
                    </div>
                    <div className="content">
                    <input type='text' id='piso-input' className="in" name='piso'autoComplete='off' list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}} />
                    </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("CUENCA")}:</label>
                    </div>
                    <div className="content">
                    <input type='text' name='cuenca' id='cuenca' className="in" list='formacionCuenca' autoComplete='off' onChange={(e)=> {handleCuenca(e)}} />
                    {
                                        errors.cuenca?<p  className="p2" onClick={(e)=> crearCuenca(e)}>+ {t("+CUENCA")}</p>
                                        : <></>
                                    }
                    </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("TRAINING")} :</label>
                    </div>
                    <div className="content">
                     <input type='text'  name='formacion' id='formacion-in' className="in" list='formacion'autoComplete='off'onChange={(e)=> {handelForma(e)}} />
                     {
                                        errors.formacion?<p  className="p2" onClick={(e)=> crearFormacion(e)}>+ {t("+FORMA")}</p>
                                        : <></>
                                    }
                     </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("MIEMBRO")}:</label>
                    </div>
                    <div className="content">
                    <input type='text' name='miembro' list="miembro" id='miembro-input'className="in" onChange={(e)=> {modificarEspe(e)}} />
                    </div>
                </div>
                <div  class='info1'>
                <div className="texto">
                    <label className="label">{t("LOCALIDAD")}:</label>
                    </div>
                    <div className="content">
                    <input type='text' className="in" id='localidad-input' list="localidad" name='localidad'onChange={(e)=> {modificarEspe(e)}} />
                    </div>
                 </div>
                 <div  class='info1'>
                 <div className="texto">
                 <label className="label">{t("CAMPAIGN")}:</label>
                 </div>
                 <div className="content">
     <input type='text' className="in" id='campana-input'name='campana' list="campana" onChange={(e)=> {modificarEspe(e)}} />
     </div>
                 </div>
                 <div  class='info1'>
                 <div className="texto">
                 <label className="label">{t("FECHACAM")}:</label>
                 </div>
                 <div className="content">
     <input type='date' className="in" id='fechaC-input'name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}}/>
     </div>
                 </div>
            </div>
            <div className="col1">
              <div  class='info1'>
                <div className="texto">
                <label className="label">{t("FIELD")}:</label>
                </div>
          <div className="content">
          <input type='number' class='in'name='nrocampo'onChange={(e)=> {modificarEspe(e)}}/>
          </div>
            </div>
            <div  class='info141'>
                       <div className="texto2">
                       <label  className="label23"> {t("COOR")} </label>
                       </div>
                            <div className="coorde">
                                    <div className="coordeIn">
                                        <select name='coord' className="coorden" onChange={(e)=>{modificarCoorLat(e)}}>
                                            <option value='S'>S</option>
                                            <option value='N'>N</option>
                                        </select><p className="p"></p>
                                    <input className="coor" min={0} type='number' id='input1' name='gra' onChange={(e)=>{modificarCoorLat(e)}} ></input><p className="p">{'°'}</p>
                                    <input className="coor" min={0} type='number'id='input2' name='min'  onChange={(e)=>{modificarCoorLat(e)}} ></input> <p className="p">{"'"} </p>
                                    <input  className="coorseg"  min={0} type='number'id='input3' name='seg'  onChange={(e)=>{modificarCoorLat(e)}} ></input> <p className="p">{'" '}</p>
                                </div>
                                </div>
                            <div className="coorde">
                                <div className="coordeIn">
                            <select name='coord' className="coorden" onChange={(e)=>{modificarCoorLong(e)}}>
                                <option value='W'>W</option>
                                <option value='E'>E</option>
                            </select>
                             <p className="p"> </p>
                    <input type='number'  name='gra' class='coor'id='input4' min={0} max='59' onChange={(e)=>{modificarCoorLong(e)}}></input><p className="p">{'°'}</p>
                    <input type='number' name='min'  class='coor'id='input5' min={0} max='59' onChange={(e)=>{modificarCoorLong(e)}}></input><p className="p">{"'"}</p>
                    <input type='number' name='seg' class='coorseg'id='input6' min={0} onChange={(e)=>{modificarCoorLong(e)}}></input><p className="p">{'"'}</p>
                            </div>
                            </div>
                        </div>
            <div  class='info1'>
                <div className="texto">
                 <label className="label">{t("PREPARADOR")}:</label>
                </div>
          <div className="content">
          <input type='text' class='in'name='preparador' list='preparador' onChange={(e)=> {modificarEspe(e)}} />
          </div>
            </div>
            <div  class='info1'>
            <div className="texto">
            <label className="label">{t("FECHAPRE")}:</label>
            </div>
            <div className="content">
            <input type='date' class='in'name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}} />
            </div>
            </div >
            <div  class='info1'>
            <div className="texto">
            <label className="label">{t("FRAGMENTOS")}:</label>
            </div>
            <div className="content">
            <input type='number'  min={0} class='in' name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} />
            </div>
            </div>
            <div  class='info1coment'>
                        <div className="texto">
                              <label className="label">{t("COMENT")}:</label>
                            </div>
                            <div className="content">
                         <textarea type='text' class='textar'name='comentario'onChange={(e)=> {modificarEspe(e)}} />
                      </div>
                      </div>
                      <div  class='info1'>
                             <div className="texto">
                             <label className="label">Público:</label>
                             </div>
                                         <div className="inpus2">
                                         <div>
                                         {t("SI")+" "}
                                         {crear?.publico ==='si'?<input type='radio' name='publico' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='publico' value="si"  onClick={(e)=> {modificarPublico(e)}} />}
                                         </div>
                                         <div>
                                         {t("NO")+" "}
                                         {crear?.publico==='no'?<input type='radio' name='publico' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='publico' value='no'   onClick={(e)=> {modificarPublico(e)}}/>    }
                                         </div>
                                         </div>
                             </div> 
                      <div  class='info1'>
                             <div className="texto">
                             <label className="label">{t("HOLOTIPO")}:</label>
                             </div>
                                         <div className="inpus2">
                                         <div>
                                         {t("SI")+" "}
                                         {crear?.holo ==='si'?<input type='radio' name='holotipo' value="si" checked='true'  onClick={(e)=> {modificarHolotipo(e)}} />:<input type='radio' name='holotipo' value="si"  onClick={(e)=> {modificarHolotipo(e)}} />}
                                         </div>
                                         <div>
                                         {t("NO")+" "}
                                         {crear?.holo === 'no'?<input type='radio' name='holotipo' value='no' checked='true' onClick={(e)=> {modificarHolotipo(e)}}/>:<input type='radio' name='holotipo' value='no'   onClick={(e)=> {modificarHolotipo(e)}}/>    }
                                         </div>
                                         </div>
                             </div> 
            </div>
            <div className="col1">
            <div className="info3B1">

<div className="cabeza5">
    <label className="lab">{t("ARMARIO")}:</label>
    <input type='number' min={0}  name='armario1'onChange={(e)=> {modificarEspe(e)}}/>
</div>
<div className="estante">
    <label class='labelo'>{t("ESTANTE")} </label>
    <input className="ubic" min={0} type='number' name='estante1desde'onChange={(e)=> {modificarEspe(e)}} />
    <label class='labelo'>{t("UNTIL").toLocaleLowerCase()}</label>
    <input className="ubic" min={0} type='number'  name='estante1hasta'onChange={(e)=> {modificarEspe(e)}} />
</div>
</div>
<div className="info3B1">
<div className="cabeza5">
<label className="lab">{t("ARMARIO")}:</label>
<input type='number' min={0} name='armario2'onChange={(e)=> {modificarEspe(e)}} />
</div>
<div className="estante">
<label class='labelo'>{t("ESTANTE")} </label>
<input className="ubic"  type='number' min={0} name='estante2desde'onChange={(e)=> {modificarEspe(e)}} />
<label class='labelo'>{t("UNTIL").toLocaleLowerCase()}</label>
<input className="ubic" type='number' min={0} name='estante2hasta'onChange={(e)=> {modificarEspe(e)}} />
</div>
</div>
                <div className="info3">
                    <div className="mostrador3">   
                        <div className="cabeza3">        
                            <label className="lab">{t("PUBLICA")}</label>
                            <input onChange={(e) => subirArchivo(e)} type="file" id="pdf" name="pdf" accept="application/pdf" className="buto"/>
                        </div>
                            {
                            pdfs?.length>0?pdfs.map(el => {
                                return <div className="caca2" onClick={(e)=> eliminarArchivo(e, el)}><span tooltip={t("CLICK")}  className="butono">{el} </span></div>
                                    }): spinner === 1 ? <Spinner animation="border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                         </Spinner>
                                    :
                                    <>{t("NOPDF")}</>
                            }
                    </div>
                </div>
                <div className="info3">
                                <div className="mostrador3">
                                    <div className="cabeza3">
                                        <label className="lab">{t("IMAGENES")}</label>
                                        <input onChange={(e) => handleImg(e)} type="file" id="imagen" name="imagen" accept="image/png, image/jpeg" className="buto"/>
                                    </div>
                                    {
                                            crear?.imagen?.length>0?crear.imagen.map(el => {
                                                return <div>
                                                    <span tooltip={t("CLICK")}  className="butono">
                                                        {
                                                            el.length < 40 ? 
                                                            <img src={`${url}getImg/` + el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                            :
                                                            <img src={el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                        }
                                                        </span>
                                                </div>
                                            }):  <>{t("NOIMG")} </>
                                    }
                                </div>
                            </div>
        </div>
        </div>{
            errors?.genero||errors?.especie||errors?.cuenca||errors?.formacion?<div className="pieErr">
                <p className="cargar23" >{t("FORMIN")}</p>
          {errors.genero?<p className="cargar2"  onClick={(e)=> crearGeneroEspecie(e)} >{errors.genero}</p>:''}
          {errors.especie?<p className="cargar2" onClick={(e)=> crearEspecie(e)}>{errors.especie}</p>:''}
          {errors.cuenca?<p className="cargar2" onClick={(e)=> crearCuenca(e)}>{errors.cuenca}</p>:''}
          {errors.formacion?<p className="cargar2" onClick={(e)=> crearFormacion(e)} >{errors.formacion}</p>:''}
</div>:<div className="pie">
                        <p className="cargar" onClick={(e)=>submitEspecimen(e)}>{t("CARGAR")}</p>
        </div>
        }
    </div>
</div> //termina container
:<>{dino}</>)
}