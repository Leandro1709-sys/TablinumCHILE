import axios from "axios";
import React, { useEffect, useState} from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {url} from '../../URL.js'
import { gradoAdecimal,decimalAGrado,fechaActual, Toast,getCuencaFormacion,getDatos,postCuencaFormacion, getFilo,selectCuenca, getGeneroEspecie, getPeriodoEpoca, postDatos, postFilo, postGeneroEspecie, selectEpoca, selectEspecie, postBochon, putBochon, getBochones, postEspecimen,postParte, subespecimen } from "../../store/action";
import '../MODIFICACIONES/actualizarEspecimen'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import crono from '../../pdf/ChronostratChart2022-02SpanishAmer.pdf'
import Menu from "../NAVBAR/menu";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useTranslation} from "react-i18next"
import { MdOutlineChangeCircle } from "react-icons/md";
import { subirImg } from "../control-img.js";

export default function ActualizarBochon (){
    const dispatch = useDispatch();
    const [especimen, setEspecimen] = useState(null)
    const [ prueba, setPrueba] = useState(null)
    const [todos, setTodos] = useState(null)
    let especimenes = useSelector((state) => state.especimenes)
    let espec = especimenes;
    let numeroEspecimenes = espec?.map(el => el.especimennumero)
    const userD = useSelector((state) => state.usuario)
    const [t, i18n] = useTranslation("global")

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const generoEspecie = useSelector((state)=> state.generoEspecie)
    const especiefiltrada = useSelector((state)=> state.especie)
    const filogenia = useSelector((state)=> state.filo )
    const partes = useSelector((state)=> state.partes )
    const cuencaFormacion = useSelector((state)=> state.cuencaformacion )
    const formacion = useSelector((state)=> state.formacion )
    const [spinner, setSpinner] = useState(0);
    const periodoEpoca = useSelector((state)=> state.periodoepoca)
    const epocaFiltrada = useSelector((state)=> state.epoca)
    const [pisoFiltrado, setPisoFiltrado] = useState(null)
    const [coordenadas, setCordenadas] = useState();
    const [imagenes , setImagenes] = useState([])
    const [pdfs, setPdfs] = useState([])
    const [arrayImgDelete, setArrayImgDelete] = useState([])
    const [numeroespecimen,setNumeroespecimen] = useState()
    const [modificacion, setModificacion] = useState(
        {
            usuario:userD.nombre,
            fecha:'',
            espPrev:{},
            espNew:{},
        })

        const [errors, setErrors] = useState({genero:false,especie:false,cuenca:false,formacion:false})
    
    let id = useParams()
    let ids = id.id
    const navigate=useNavigate();
    const [modificar, setModificar] = useState({especimennumero:ids})
    const [imagenSelected,setImagenSelected] = useState()
   

   //useeffect
    useEffect(() => {
        dispatch(getGeneroEspecie())
        dispatch(getCuencaFormacion())
            dispatch(getPeriodoEpoca())
            dispatch(getFilo())
           

            axios.get(`${url}bochonRoute/bochon/especimen/id?id=${ids}`)
            .then((response) => {
             
                setEspecimen(response.data)
                setPrueba(response.data.posicionfilo)
                setImagenes(response.data.imagen)
                setPdfs(response.data.pdf)
                setCordenadas(decimalAGrado(response.data.coordlat,response.data.coordlong))
                if(response.data.especimennumero != '0'){
                    if(response.data.especimennumero == '99999000'){
                        setNumeroespecimen('9')
                        
                    } else {
                        
                        setNumeroespecimen(subespecimen(response.data.especimennumero))
                    }
                } 
                
                
            })
            axios.get(`${url}datalist/`)
            .then((response2) => {
                setTodos(response2.data)
             })

            return () => {
                setEspecimen(null)
            }
        }, [])

//GENERO LA FECHA ACTUAL PARA
var fecha=fechaActual();
//console.log(especimen)
//LLENADO DE EL ESTADO MODIFICACION(ESPECIMEN PREV Y NEW)
if(especimen){
  
if(!modificacion.espPrev.especimennumero){
        setModificacion({
            ...modificacion,
            fecha:fecha,
            espPrev:especimen,
        })
       
}else if(especimen!==modificacion.espNew){
    setModificacion({
        ...modificacion,
        espNew:especimen,
    })
   
}
}

//OBTEBCION DE COORDENADAS DESDE ESPECIMEN (TRUE OR FALSE DE LOS DELECT DE COORDENADAS)
//console.log(numeros)
var latnorte=coordenadas?.latitud?.coord==='N'?true:false;
var longeste=coordenadas?.longitud?.coord==='E'?true:false;

 
    function modificarEspe (e) { // funcion para actualizar datos del estado(con las modificaciones)
        e.preventDefault()
        if(e.target.name==='especimennumero'){
            let esp=e.target.value*1000;
            setEspecimen({ 
                ...especimen,
                [e.target.name] : esp.toString(),
            })
        }else if(e.target.name=='comentario'&&e.target.value==''){
          //  console.log('entra comentarios')
            setEspecimen({
                ...especimen,
                [e.target.name]: 'Sin comentarios',
            })
     

        }else{
        //  console.log('no entra')
            setEspecimen({
                ...especimen,
                [e.target.name]: e.target.value,
            })
    
        }
       
    }

    let numerosSort = numeroEspecimenes?.sort(SortArray12)
    function SortArray12(x, y) {
        if (Number(x) < Number(y)) { return -1; }
        if (Number(x) > Number(y)) { return 1; }
        return 0;
    }
    
    function filtrarEspecimen(e) {
        console.log('entra filtrar')
    
      if(especimen?.especimennumero.includes(e.target.value)){
        return(Toast.fire({icon: 'error',title:t('OPC')}) )
      }else{
       setEspecimen({
        ...especimen,
        especimennumero:[...especimen.especimennumero,e.target.value],
    }) }
   
     

    }

    function eliminarNumero(el, e) {
        e.preventDefault()
        let cambio = especimen.especimennumero.filter(occ => occ !== el)
        setEspecimen({
            ...especimen,
            especimennumero:cambio,
        }) 


    }
    
    
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
       
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            especie:'',
        })
        document.getElementById('especie-Input').placeholder='';
    }
    }

    function filtrarEspecie(e){

        let comprobar1 = especiefiltrada.filter((el) => el === e.target.value )
        let genero1 = document.getElementById('genero-Input').value
        let genero2 = document.getElementById('genero-Input').placeholder
         let generoInput
         if(genero1.length>1){
            generoInput = genero1
        }else{
            generoInput = genero2
        }
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
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value
        })
    }
    }

    function handleCuenca(e){

        e.preventDefault()
       
           let comprobar = cuencaFormacion.filter((el) => el.cuenca === e.target.value)
       
           if(comprobar.length === 0 && e.target.value.length>0){
            setErrors({...errors,
                cuenca: "agregar cuenca"
            })
           
        }else {
            setErrors({...errors, cuenca:false})
            setTimeout(() => {dispatch(selectCuenca(e.target.value))}, "1000")
                 
                  setEspecimen({
                      
                      ...especimen,
                      cuenca : e.target.value
                  })
             
       }
  
         }
       
         function handelForma(e){
        e.preventDefault()
             //console.log( e.target.value )
         
             let comprobar = formacion.filter((el) => el === e.target.value )
         
             if(comprobar.length === 0 && e.target.value.length>0){
                setErrors({...errors,
                    formacion: "agregar formación"
                })
               
            }else {
                setErrors({...errors,formacion:false})
                  e.preventDefault()
                   
                   setEspecimen({
                        
                        ...especimen,
                        formacion: e.target.value
                    })
               
         }
         
           }
       
           function crearCuenca(e){
            e.preventDefault()
             let cuenca2 = document.getElementById('cuenca').value
         
             setEspecimen({
                 ...especimen,
                 cuenca: cuenca2,
             })
             let modelo = 'cuenca'
             setErrors({...errors,cuenca:false})
                 dispatch(postCuencaFormacion(modelo, cuenca2))
                 setTimeout(() => {dispatch(getCuencaFormacion())}, "1000")
         
         }
         
         function crearFormacion(e){
             e.preventDefault()
             let cuenca2 = document.getElementById('cuenca').value
             let forma = document.getElementById('formacion-in').value
             setEspecimen({
                 ...especimen,
                 formacion: forma,
             })
    
             
        let modelo = 'cuenca'
        setErrors({...errors,formacion:false})
        dispatch(postCuencaFormacion(modelo, cuenca2, forma))
        setTimeout(() => {dispatch(getCuencaFormacion())}, "1000")
         
            }

    function filtrarEpoca(e){
        dispatch(selectEpoca(e.target.value))
        e.preventDefault()
       
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            epoca:'',
            piso:'',
        })
        document.getElementById('epoca-input').placeholder='';
        document.getElementById('piso-input').placeholder='';
        document.getElementById('epoca-input').value='';
        document.getElementById('piso-input').value='';
    }

    function filtrarPiso(e){
       let piso = epocaFiltrada.filter(el => el.nombre === e.target.value)
       setPisoFiltrado(piso[0].piso)
        e.preventDefault()
        setEspecimen({
            
            ...especimen,
            [e.target.name] : e.target.value,
            piso:'',
        })
        document.getElementById('piso-input').placeholder='';
      
        document.getElementById('piso-input').value='';
    }

    function crearEspecie(e){
        e.preventDefault()
        let especieInput = document.getElementById('especie-Input').value
        var genero1 = document.getElementById('genero-Input').value
        var genero2 = document.getElementById('genero-Input').placeholder
        let generoInput
            if(genero1.length>1){
                generoInput = genero1
            }else{
                generoInput = genero2
            }
        let modelo = 'genero'
       setErrors({...errors,especie:false})
        setEspecimen({
            ...especimen,
            especie: especieInput
        })
        dispatch(postGeneroEspecie(modelo, generoInput, especieInput))
        setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")
    }

    function crearGeneroEspecie(e){
        e.preventDefault()
        e.preventDefault()
        let generoInput = document.getElementById('genero-Input').value
        let modelo = 'genero'
        setErrors({...errors,genero:false})
            setEspecimen({
                ...especimen,
                genero: generoInput
            })
            dispatch(postGeneroEspecie(modelo, generoInput))
            setTimeout(() => {dispatch(getGeneroEspecie())}, "1000")

    }


    function handleDelete(el,e){
       e.preventDefault()
       let cambio = prueba.filter( occ => occ !== el)
            setPrueba(
                cambio
            )
        setEspecimen({
            ...especimen,
            posicionfilo: cambio
        })
       
    }

    function handleSelectionFilo(e){
        if(prueba.includes(e.target.value)){
          return(Toast.fire({icon: 'error',title: t('OPC')}) )
        }else{

        setPrueba([...prueba, e.target.value])
        setEspecimen({
          ...especimen,
          posicionfilo: [...prueba, e.target.value]
        })
    }
    }

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
               
                
                Swal.fire(
                    t("EXITO"),
                    t("VOLVER"),
                    'success'
                  )
              return [
                  // console.log(gen, esp),
                  filoNew.length===0?null:
                  setPrueba([...prueba, filoNew]),
                  setModificar({
                    ...modificar,
                    posicionfilo: [...prueba,filoNew]
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

    // function agregarNum(e){
    //     e.preventDefault()
    //     const { value: formValues } =  Swal.fire({
    //         title: t("+NUM") ,
    //         html:
    //           '<input id="swal-input23" class="swal2-input" >',
    //         focusConfirm: false,
    //         preConfirm: () => {
    //          //   console.log("valu ---ZZZ",document.getElementById('swal-input23').value.length)
    //             var num
    //             document.getElementById('swal-input23').value.length===0?       Swal.fire(
    //                 t("VACIO"),
    //                 t("VOLVER"),
    //                 'error'
    //               ): num =  document.getElementById('swal-input23').value
           
               
                
    //             Swal.fire(
    //                 t("EXITO"),
    //                 t("VOLVER"),
    //                 'success'
    //               )
    //           return [
    //                console.log(num),
                
                   
                
                
    //           ]
    //         }
    //       })
          
    //       if (formValues) {
    //         Swal.fire(JSON.stringify(formValues))
    //       }
    // }

    console.log(especimen)
    function agregarParte(e){
        e.preventDefault()
         const { value: formValues } =  Swal.fire({
            title: t("+ESQ") ,
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
                Swal.fire(
                    t("EXITO"),
                    t("VOLVER"),
                    'success'
                  )
              return [
                  setEspecimen({
                    ...especimen,
                    partesesqueletales: [...especimen.partesesqueletales,parteNew]
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


  
    const handleImg = async (e) => {
        e.preventDefault()
      
        var file = e.target.files[0];
        let result =  await subirImg(file)
        let image = result.path
                setImagenes([...imagenes,image])
                setEspecimen({
                    ...especimen,
                    imagen: [...imagenes, image]
                })
                if (file) {
                    
                    setImagenSelected(image);
                }       
            }
       
        
    function eliminarImagen(el, e){
        e.preventDefault()
        let nuevo = imagenes.filter( occ => occ !== el)
        if(el.slice(0,5) !== 'data:'){
            let path = el.slice(2)
            setArrayImgDelete([...arrayImgDelete, path])

        }
        setImagenes(nuevo)
        setModificar({
            ...modificar,
            imagen: nuevo
        })
        setEspecimen({
            ...especimen,
            imagen: nuevo
        })
        
    }
    
    let filoNombre = filogenia.map(el => el.filo);

    function modificarPublico(e){
       
            setEspecimen({
                ...especimen,
                publico: e.target.value,
            })  
         
        
    }
    function modificarHolotipo(e){
        setEspecimen({
            ...especimen,
            holotipo: e.target.value,
        })  
      }
      
      function modificarURL(e){
        setEspecimen({
            ...especimen,
            url: e.target.value,
        })  
      }  

      function handleSelectionPartes(e){
        e.preventDefault()
if(!especimen.partesesqueletales.includes(e.target.value)){
     setEspecimen({
          ...especimen,
          partesesqueletales: [...especimen.partesesqueletales,e.target.value],
        })
    } else {
        Toast.fire({icon: 'error',title: t('OPC')}) 
      
    }
       
    }
    
    function  handleDeletePartes(el,e){
        e.preventDefault()
    
         setEspecimen({
            ...especimen,
            partesesqueletales: especimen.partesesqueletales.filter( occ => occ !== el)
        })
       
        
     }

//COORDENADAS

  function  handleLat(e){
       if(e.target.name==='grados'){
        coordenadas.latitud.gra=Number(e.target.value);
        let co = document.getElementById('input1').value
        let co2 = document.getElementById('input2')
        if(co.length == 2){
            co2.focus()
        }
       }
       if(e.target.name==='minutos'){
        coordenadas.latitud.min=Number(e.target.value);
        let co = document.getElementById('input2').value
        let co2 = document.getElementById('input3')
        if(co.length == 2){
            co2.focus()
        }
       }
       if(e.target.name==='segundos'){
        coordenadas.latitud.seg=Number(e.target.value);
       }
       if(e.target.name==='coord'){
        coordenadas.latitud.coord=e.target.value;
       }
        
       var decimal=gradoAdecimal(coordenadas.latitud,coordenadas.longitud);
         setEspecimen({
            ...especimen,
            coordlat: decimal.latitud
        })
       
        
     }

     function  handleLong(e){
       if(e.target.name==='grados'){
        coordenadas.longitud.gra=Number(e.target.value);
        let co = document.getElementById('input4').value
        let co2 = document.getElementById('input5')
        if(co.length == 2){
            co2.focus()
        }
       }
       if(e.target.name==='minutos'){
        coordenadas.longitud.min=Number(e.target.value);
        let co = document.getElementById('input5').value
        let co2 = document.getElementById('input6')
        if(co.length == 2){
            co2.focus()
        }
       }
       if(e.target.name==='segundos'){
        coordenadas.longitud.seg=Number(e.target.value);
       }
       if(e.target.name==='coord'){
        coordenadas.longitud.coord=e.target.value;
       }
        
        var decimal=gradoAdecimal(coordenadas.latitud,coordenadas.longitud);
        setEspecimen({
            ...especimen,
            coordlong: decimal.longitud,
        })
       
        
     }

//////////////////////////////////////////////////////////////
////////////////  SUBMIT    //////////////////////////////////
//////////////////////////////////////////////////////////////
function submitEspecimen(e){ // funcion submit + modal de cartel 

    e.preventDefault()
   
    
    console.log("submit ---ZZZ ",especimen)
    Swal.fire({
        title:  t("COMFIRM"),
        showDenyButton: true,
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
            if(arrayImgDelete.length > 0){
                arrayImgDelete.map(el => {
                    axios.delete(`${url}eliminar-archivo-img?nombreArchivo=` + el)
                })
            }
                putBochon([especimen,modificacion]) // envio datos al back
                setEspecimen(null) // seteo estado local a null
                Toast.fire({ icon: 'success', title:  t("SICAMBIO")  })

                    setTimeout(() => {navigate(`/home/bochon/${ids}`)}, "1000")   // funcion para que solo cargue la pagina despues
                    setTimeout(() => {getBochones()}, "1000")   
        } else if (result.isDenied) {
          Swal.fire(t("NOCAMBIO"), '', 'info')
        }
      })
}


const subirArchivo = (e) => {
    const archivos = e.target.files;
    const data = new FormData();
    data.append('archivo', archivos[0]);
    setSpinner(1)
    axios.post(`${url}subir-archivo`, data)
    .then(data => {
        setSpinner(0)
      setPdfs([...pdfs, data.data.filename])
      setEspecimen({
        ...especimen,
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
    setEspecimen({
        ...especimen,
        pdf: nuevo
      })

}

function bochonAespeciemen (){
    let cord = { latitud: especimen.coordlat,
                    longitud: especimen.coordlong}
     dispatch(postEspecimen([especimen, cord]))
     Toast.fire({icon: 'success',title: 'Bochon ' + especimen.bochonumero  +'se agrego a catalogo de especimenes'}) 
  
} 

    var modificaciones=[];
    if( especimen?.modificado.length > 0){
       var cont=especimen?.modificado.length-1;
       for(var i=cont; i>-1; i--){
           modificaciones.push(especimen?.modificado[i])

       }
         
    } 

    return (
        <div className="container34">
        <datalist id='generoEspecie'>
            {
                generoEspecie?.map(el => {return <option>{el.genero}</option>})
            }

        </datalist>
        <datalist id='especiefiltrada'>
            {
                especiefiltrada?.map(ele => {return <option>{ele}</option>})
                //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

            }

        </datalist>

        <datalist id='periodoEpoca'>
            {
                periodoEpoca?.map(elem => {return <option>{elem.periodo}</option>})
                //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

            }
             <datalist id='epocaFiltrada'>
            {
                epocaFiltrada?.map(eleme => {return <option>{eleme.nombre}</option>})
                //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

            }

        </datalist>
        <datalist id='formacionCuenca'>
        {
            cuencaFormacion?.map(el => {return <option>{el.cuenca}</option>})
        }

    </datalist>
    <datalist id='formacion'>
        {
           formacion?.sort().map(el => {return <option>{el}</option>})
        }

    </datalist>
        <datalist id='pisoFiltrado'>
            {
               pisoFiltrado?.sort().map(eleme => {return <option>{eleme}</option>})
                //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

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
       

          
        <Menu activo={1}/>
         
            <div className="contenido34">
           
                <div className="cabecera">
                <div className="vuelve">
                <Link to={'/home/bochon/'+especimen?.bochonnumero} className="limpiar">{t("VOLVER")}</Link>
                </div>
              
                    <div className="a">
                    {t("MODBO")} {especimen?.bochonnumero}
                    </div>
                    {
                    especimen?.modificado.length > 0 && userD.nivel == 1? 
                    <label onClick={handleShow}><span tooltip={t("HISTORIAL")} ><MdOutlineChangeCircle fontSize='25px' class='modificacion-boton'/></span></label>
             : null
                }
               
                </div>
         
                <div className="cuerpo">

                    <div className="col1">
               
                        <div className="info1">
                            <div className=" texto">
                                <label className="label">{t("GENRE")}:</label></div>
                            <div className="content">

                            <input type='text' id='genero-Input' className="in" name='genero' autoComplete='off' list='generoEspecie' onChange={(e)=> {filtrargenero(e)}} placeholder={modificacion?.espPrev.genero}/>
                            {
                                errors.genero?<p  className="p2" onClick={(e)=> crearGeneroEspecie(e)}>+ {t("+GENRE")}</p>
                                : <></>
                            }

                        </div>
                       

                    </div>
                   



                    <div className="info1">
                         <div className=" texto">
                           <label className="label">{t("SPECIES")}:</label>
                         </div>
                         <div className="content">
                            <input type='text' id = 'especie-Input'class='in'name='especie'autoComplete='off' list='especiefiltrada' onChange={(e)=> {filtrarEspecie(e)}} placeholder={modificacion?.espPrev.especie}/>
                            {
                              errors.especie?<p  className="p2" onClick={(e)=> crearEspecie(e)}>+ {t("+ESP")}</p>
                                :  <></>
                            }
                         </div>




                    </div>
                    <div  class='info1'>
                        <div className="texto">
                             <label className="label">{t("DISCOVERER")}:</label>
                        </div>
                       <div className="content">
                             <input type='text' className="in" name='descubridor' list='descubridor' onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.descubridor}/>
                        </div>
                     </div>
                    <div className="info33">
                   
                                    <div className="mostrador33">
                                        <div className="cabeza">
                                    <label>{t("ESPECNRO")}:</label>
                                    <select onChange={(e) => { filtrarEspecimen(e) }} required>
                                        <option value=''>{t("SEL")}</option>
                                        {
                                            numerosSort?.map(eleme => { return <option value={eleme}>{subespecimen(eleme)}</option> })
                                        }
                                    </select>
                                  
                                </div>
                                
                                {
                                        especimen?.especimennumero?.length===0 ? <>{t("NONUM")}</>:especimen?.especimennumero.map(el => { return <div onClick={(e) => eliminarNumero(el, e)} class='caca-prestamos'><span tooltip="click para eliminar" >{subespecimen(el)}</span></div> })                                     }
                                
                                </div>
                                {/* <div className="base1" onClick={(e)=> agregarNum(e)} >
                             <h6 className="h67">+ {t("+NUMER")}</h6>
                         </div> */}
                               
                                </div>
                                
                    
                        <div className="info3">

                         <div className="mostrador">
                            <div className="cabeza">
                            <label className="lab">{t("PHYLOGENETICS")}</label>

                                        <select  onChange={(e)=>handleSelectionFilo(e)}>
                                        <option>{t("SEL")}...</option>
                                            {
                                                    filoNombre.sort().map(ee => {return <option value={ee}>{ee}</option>})
                                                }
                                        </select>
                            </div>

                             {prueba?.length===0?<> {t("NOFILO")}</>:prueba?.length<9?prueba?.map(el => {return <div className="caca" onClick={(e)=> handleDelete(el, e)}><span tooltip={t("CLICK")} >{el} </span></div>}):
                             prueba?.map(el => {return <div className="caca11" onClick={(e)=> handleDelete(el, e)}><span tooltip={t("CLICK")}>{el} </span></div>})}
                             </div>
                         <div className="base1" onClick={(e)=> agregarFilo(e)} >
                             <h6 className="h67">+ {t("+POS")}</h6>
                         </div>
                    </div>

                    <div className="info3">


                        <div className="mostrador2">
                        <div className="cabeza">
                        <label className="lab"> {t("PARTS")}:</label>
                         <select onChange={(e)=>handleSelectionPartes(e)}>
                         <option id="partesOp">{t("SEL")}...</option>
                                            {
                                                partes?.sort().map(el => {return <option value={el}>{el}</option>})
                                            }
                                        </select>
                                        </div>
                                    {
                                    especimen?.partesesqueletales?.length===0?<>{t("NOPAR")}</>:especimen?.partesesqueletales?.length<9?especimen?.partesesqueletales?.map(el => {return <div className="caca" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip={t("CLICK")} >{el} </span></div> }):
                                    especimen?.partesesqueletales?.map(el => {return <div className="caca11" onClick={(e)=> handleDeletePartes(el, e)}><span tooltip={t("CLICK")} >{el} </span></div> })
                                    }
                                </div>
                                      <div className="base1" onClick={(e)=> agregarParte(e)} >
                                                <h6 className="h67"> +  {t("+PAR")}</h6>
                                            </div>
                                    
                                
                    </div>


                </div>
                <div className="col1">
                    <div className="info1">
                    <div className="texto">
                        <label className="label"> <span title={t("TABLA")} ><a className="labelH" href={crono} target='_blank'>{t("PERIODO")}:</a></span></label>
                        </div>
                        <div className="content">
                            <input type='text' name='periodo' className="in" autoComplete='off' list='periodoEpoca' onChange={(e)=> {filtrarEpoca(e)}} placeholder={modificacion?.espPrev.periodo}/>
                         </div>
                    </div>
                    <div  class='info1'>
                    <div className="texto">
                        <label className="label">{t("EPOCA")}:</label>
                        </div>
                        <div className="content">

                        <input type='text'  id='epoca-input' className="in" name='epoca'autoComplete='off' list='epocaFiltrada'onChange={(e)=> {filtrarPiso(e)} } placeholder={modificacion?.espPrev.epoca}/>
                        </div>

                    </div>
                    <div  class='info1'>
                    <div className="texto">
                        <label className="label">{t("PISO")}:</label>

                        </div>
                        <div className="content">
                        <input type='text' id='piso-input'name='piso'autoComplete='off' className="in" list='pisoFiltrado'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.piso}/>
                                    </div>
                    </div>
                    <div  class='info1'>
                            <div className="texto">
                                <label className="label">{t("CUENCA")}:</label>
                                </div>
                                <div className="content">
                                <input type='text' name='cuenca' id='cuenca'list='formacionCuenca' className="in" autoComplete='off' onChange={(e)=> {handleCuenca(e)}} placeholder={modificacion?.espPrev.cuenca}/>
                                {
                                        errors.cuenca?<p  className="p2" onClick={(e)=> crearCuenca(e)}>+ {t("+CUENCA")}</p>
                                        : <></>
                                    }
                                    </div>
                            </div>
                            <div  class='info1'>
                            <div className="texto">
                                <label className="label">{t("TRAINING")}:</label>
                                </div>
                                <div className="content">
                                 <input type='text'  name='formacion' id='formacion-in' className="in"  list='formacion'autoComplete='off'onChange={(e)=> {handelForma(e)}} placeholder={modificacion?.espPrev.formacion}/>
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
                        <input type='text' name='miembro' list='miembro' className="in" onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.miembro}/>
                        </div>
                    </div>
                    <div  class='info1'>
                    <div className="texto">
                        <label className="label">{t("LOCALIDAD")}:</label>
                        </div>
                        <div className="content">
                        <input type='text' className="in" list='localidad' name='localidad'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.localidad}/>
                        </div>
                     </div>
                     <div  class='info1'>
                        <div className="texto">
                             <label className="label">{t("CAMPAIGN")}:</label>
                        </div>
                       <div className="content">
                             <input type='text' className="in" list='campana' name='campana'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.campana}/>
                        </div>
                     </div>
                     <div  class='info1'>
                        <div className="texto">
                          <label className="label">{t("FECHACAM")}:</label>
                        </div>
                        <div className="content">
                              <input type='date' className="in"name='fechadescubrimiento'onChange={(e)=> {modificarEspe(e)}} defaultValue={modificacion?.espPrev.fechadescubrimiento}/>
                         </div>
                     </div>
                
                 
                </div>
                <div className="col1">
                <div  class='info1'>
                    <div className="texto">
                    <label className="label">{t("FIELD")}:</label>
                    </div>
                <div className="content">
                <input type='number' class='in'name='nrocampo'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.nrocampo}/>
                </div>



       </div>
       <div  class='info141'>
               <div className="texto2">
               <label  className="label23">{t("COOR")}</label>
               </div>

                        
                   

                    <div className="coorde">
                            <div className="coordeIn">
                                    
                            <select name='coord' className="coorden" onChange={(e)=>{handleLat(e)}}>
                            {coordenadas?.latitud.coord==='N'?<option value='N' selected='true'>N</option>:<option value='N'>N</option>}
                            {coordenadas?.latitud.coord==='S'?<option value='S' selected='true'>S</option>:<option value='S'>S</option>}
                            </select><p className="p"></p>

                            <input className="coor" type='number' min='0'id='input1' name='grados' placeholder={coordenadas?.latitud.gra} onChange={(e)=>{handleLat(e)}} ></input><p className="p">{'°'}</p>
                            <input className="coor" type='number' min='0'id='input2' name='minutos' placeholder={coordenadas?.latitud.min} onChange={(e)=>{handleLat(e)}} ></input> <p className="p">{"'"} </p>
                            <input  className="coorseg" type='number' min='0' id='input3' name='segundos' placeholder={coordenadas?.latitud.seg} onChange={(e)=>{handleLat(e)}} ></input> <p className="p">{'" '}</p>
                        </div>
                        </div>


                    <div className="coorde">
                        <div className="coordeIn">
                    
                    <select name='coord' className="coorden" onChange={(e)=>{handleLong(e)}}>
                        {coordenadas?.longitud.coord==='E'?<option value='E' selected='true'>E</option>:<option value='E'>E</option>}
                        {coordenadas?.longitud.coord==='W'?<option value='W' selected='true'>W</option>:<option value='W'>W</option>}
                    </select>
                     <p className="p"> </p>
            <input type='number'  name='grados' min='0' id='input4' placeholder={coordenadas?.longitud.gra} class='coor'  onChange={(e)=>{handleLong(e)}}></input><p className="p">{'°'}</p>
            <input type='number' name='minutos' min='0' id='input5'placeholder={coordenadas?.longitud.min} class='coor'  onChange={(e)=>{handleLong(e)}}></input><p className="p">{"'"}</p>
            <input type='number' name='segundos' min='0' id='input6'placeholder={coordenadas?.longitud.seg} class='coorseg'  onChange={(e)=>{handleLong(e)}}></input><p className="p">{'"'}</p>

                    </div>
                    </div>
                </div>


                <div  class='info1'>
                <div className="texto">
                <label className="label">{t("PREPARADOR")}:</label>
                </div>
                <div className="content">
                <input type='text' class='in'name='preparador' list='preparador' onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.preparador}/>
                </div>


                </div>
                <div  class='info1'>
                        <div className="texto">
                        <label className="label">{t("FECHAPRE")}:</label>
                        </div>
                        <div className="content">
                        <input type='date' class='in' name='preparacionfecha'onChange={(e)=> {modificarEspe(e)}} defaultValue={modificacion?.espPrev.preparacionfecha}/>
                    </div>
                </div >

                <div  class='info1'>
                    <div className="texto">
                    <label className="label">{t("FRAGMENTOS")}:</label>
                    </div>
                    <div className="content">
                    <input type='number'  class='in' name='cantidadfrag' onChange={(e)=> {modificarEspe(e)}} defaultValue={modificacion?.espPrev.cantidadfrag}/>
                    </div>


                </div>
                <div  class='info1coment'>
                        <div className="texto">
                              <label className="label">{t("COMENT")}:</label>
                            </div>
                           

                            <div className="content">
                         <textarea type='text' class='textar'name='comentario'onChange={(e)=> {modificarEspe(e)}} defaultValue={modificacion?.espPrev.comentario}/>
                      </div>
                      </div>

        
                <div  class='info1'>
                     <div className="texto">
                     <label className="label">{t("PUBLICO")}:</label>
                     </div>
                                 <div className="inpus2">
                                 <div>
                                 {t("SI")+" "}
                                 {especimen?.publico ==='si'?<input type='radio' name='publico' value="si" checked='true'  onClick={(e)=> {modificarPublico(e)}} />:<input type='radio' name='publico' value="si"  onClick={(e)=> {modificarPublico(e)}} />}
                                 </div>
                                 <div>
                                 {t("NO")+" "}
                                 {especimen?.publico==='no'?<input type='radio' name='publico' value='no' checked='true' onClick={(e)=> {modificarPublico(e)}}/>:<input type='radio' name='publico' value='no'   onClick={(e)=> {modificarPublico(e)}}/>    }
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
                                 {especimen?.holotipo ==='si'?<input type='radio' name='holotipo' value="si" checked='true'  onClick={(e)=> {modificarHolotipo(e)}} />:<input type='radio' name='holotipo' value="si"  onClick={(e)=> {modificarHolotipo(e)}} />}
                                 </div>
                                 <div>
                                 {t("NO")+" "}
                                 {especimen?.holotipo === 'no'?<input type='radio' name='holotipo' value='no' checked='true' onClick={(e)=> {modificarHolotipo(e)}}/>:<input type='radio' name='holotipo' value='no'   onClick={(e)=> {modificarHolotipo(e)}}/>    }
                                 </div>
                                 </div>



                     </div>
                     <div  class='info1'>
                     <div className="texto">
                     <label className="label">{t("ONPREP")}:</label>
                     </div>
                                 <div className="inpus2">
                                 <div>
                                 {t("SI")+" "}
                                 {especimen?.url ==='si'?<input type='radio' name='url' value="si" checked='true'  onClick={(e)=> {modificarURL(e)}} />:<input type='radio' name='url' value="si"  onClick={(e)=> {modificarURL(e)}} />}
                                 </div>
                                 <div>
                                 {t("NO")+" "}
                                 {especimen?.url === 'no' || especimen?.url === 'sin URL' || especimen?.url === 'Sin URL' ?<input type='radio' name='url' value='no' checked='true' onClick={(e)=> {modificarURL(e)}}/>:<input type='radio' name='url' value='no'   onClick={(e)=> {modificarURL(e)}}/>    }
                                 </div>
                                 </div>



                     </div>

                </div>
                <div className="col1">
                <div className="info3B1">

                            <div className="cabeza5">
                                <label className="lab">{t("ARMARIO")}:</label>

                                <input type='number'  name='armario1'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.armario1}/>


                            </div>
                            <div className="estante">
                                <label class='labelo'>{t("ESTANTE")} </label>
                                <input className="ubic"  type='number' name='estante1desde'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.estante1desde}/>
                                <label class='labelo'>{t("UNTIL").toLocaleLowerCase()}</label>
                                <input className="ubic" type='number'  name='estante1hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.estante1hasta}/>

                            </div>


            </div>
            <div className="info3B1">

                       <div className="cabeza5">
                           <label className="lab">{t("ESTANTE")}:</label>

                           <input type='number'  name='armario2'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.armario2}/>


                       </div>
                       <div className="estante">
                           <label class='labelo'>{t("CAJON")} </label>
                           <input className="ubic"  type='number' name='estante2desde'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.estante2desde}/>
                           <label class='labelo'>{t("OF")} </label>
                           <input className="ubic" type='number'  name='estante2hasta'onChange={(e)=> {modificarEspe(e)}} placeholder={modificacion?.espPrev.estante2hasta}/>

                       </div>


       </div>



                    <div className="info3">
                        <div className="mostrador3">
                            <div className="cabeza3">
                                <label className="lab"> {t("PUBLICA")}</label>
                                <input onChange={(e) => subirArchivo(e)} type="file" id="pdf" name="pdf" accept="application/pdf" className="buto"/>
                            </div>
                                {
                                pdfs?.length>0?pdfs?.map(el => {
                                    return <div className="caca2" onClick={(e)=> eliminarArchivo(e, el)}><span tooltip="click para eliminar" className="butono">{el.length>35?el.slice(0,35)+'...pdf':el} </span></div>
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

                                    especimen?.imagen?.length>0?especimen?.imagen?.map(el => {
                                        return <div>
                                          <span tooltip="click para eliminar" className="butono"> 
                                          {                                                          
                                                            el.length < 40 ? 
                                                            <img src={`${url}getImg/` + el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                            :
                                                            <img src={el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                        }   
                                           </span>
                                            
                                        </div>


                                    }): <>{t("NOIMG")} </>
                            }
                        </div>
                    </div>


            </div>
            </div>

            {
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
        <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modificaciones de Bochón {especimen?.bochonnumero}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{
     
            modificaciones ? modificaciones.map(el => {
                return (
                <div class='modal-modificaciones'>
                 <p>Usuario: { el.usuario} </p> 
                 <p>Fecha: {' '+ el.fecha+ ' '} </p>
                 {
                    el.cambios.length > 0 ? 
                    <p> Cambios: {el.cambios.map(ele =>  { return <p>{ele}</p> })} </p>
                    : <p>Cambios: Imagen/PDF</p>
                 }
            
                </div>
                )
        
        
        }) : <p>nada</p>
            }</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          
        </Modal.Footer>
      </Modal>
</div>


            )
}