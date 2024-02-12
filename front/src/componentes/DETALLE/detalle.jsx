
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import './detalle.css'
import '../MODIFICACIONES/actualizarEspecimen'
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';

import {agregarQR, decimalAGrado, delEsp,subespecimen,filtrarDatos,Toast} from '../../store/action'
import Menu from "../NAVBAR/menu";
import { useDispatch,useSelector} from "react-redux";
import {useTranslation} from "react-i18next"
import Swal from 'sweetalert2'
import {url} from '../../URL.js'
import './detalle.css'
import CajaDetalle from './cajaDetalle'
import printFicha from "../../FUNCIONES/printFicha";

export default function Detalle (){
    const userD = useSelector((state)=> state.usuario)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qr, setQr] = useState(null)
    const [especimen, setEspecimen] = useState(null)
    const [pdfState, setPdfState] = useState(null)
    const [prestamoActivo, setPrestamoActivo] = useState({})
    const [t, i18n] = useTranslation("global")
    let id = useParams()
    let ids = id.id

    
    useEffect(() => {
        axios.get(`${url}especimenRoute/especimen/id?id=${ids}`)
        .then((response) => {
            let num = response.data.especimennumero
            setEspecimen(response.data)
            if(response.data.prestado){
             axios.get(`${url}prestamosRoute/prestamos?id=`+ num)
            .then(res => setPrestamoActivo(res.data))
            }


        })
        return () => {
            setEspecimen(null)
        }
    }, [])
    function goBack(e){
        e.preventDefault()
        navigate(-1)
    }
 
 // parte de lectura y comparacion de pdfs de especimen con carpeta contenedora de pdf
   
console.log('>>>>>>>>>>>     ',especimen)


  
   

    var coordenadas =  decimalAGrado(especimen?.coordlat,especimen?.coordlong)

    var linkMap='https://www.google.com/maps/place/'+especimen?.coordlat+especimen?.coordlong;
  
  

 
    function agregarqr(e){
        e.preventDefault()
        setQr(1)
        let idespecimen = especimen?.especimennumero
        dispatch(agregarQR(idespecimen))
        Toast.fire({      icon: 'success',
            title: 'QR generado con éxito!'
          }) 
        
        
    }

    function eliminaEspecimen(e){

        Swal.fire({
            title: t("ELIMINAESP")+' ' + subespecimen(e),
            toast: true,
            position: 'top-end',
            showDenyButton: true,
            confirmButtonText: t("ELI"),
            denyButtonText: t("CAN"),
          }).then((result) => {
          
            if (result.isConfirmed) {
                var response=delEsp(e);
                dispatch(filtrarDatos({parametro:'limpiar'}))
                return [navigate('/home/')]  
            } 
          })
    }

function abririmagen(el){
 
    Swal.fire({
        
        imageUrl: `${el.length > 40 ? el : `${url}getImg/` + el}`,
        imageHeight: 300,
        backdrop: `
    rgba(80, 77, 77, 0.70)
    no-repeat
        `
      })
}
  

function abrirPrestamo(){
    const { value: formValues } =  Swal.fire({
        title: `Prestamo` ,
        html: 
        `<p>Prestado por : ${prestamoActivo[0].emisor}</p>` +
        `<p>investigador: ${prestamoActivo[0].investigador}</p>`+
        `<p>institucion: ${prestamoActivo[0].institucion != null?prestamoActivo[0].institucion: 'indefinido'}</p>`+
        `<p>Nro especimen : ${prestamoActivo[0].numeroespecimen ? prestamoActivo[0].numeroespecimen.map(el =>subespecimen(el.toString())).toString(): ''}</p>`+
        `<p>fecha de prestamo: ${prestamoActivo[0].fechaprestamo}</p>` +
        `<p>fecha devolucion estimada: ${prestamoActivo[0].fechadevolucionest}</p>` +
        `<p> comentario: ${prestamoActivo[0].comentarios != null? prestamoActivo[0].comentarios:'Sin comentarios'} </p>`,

        showCloseButton: true,
        showDenyButton:true,
        denyButtonText:'volver',
       confirmButtonText: 'ir a prestamos',
        preConfirm: () => {   
           
          return [
            navigate('/home/prestamos')
           
          ]  
        }   
      }) 
      if (formValues) {
        Swal.fire(JSON.stringify(formValues)) 
      }
   }

    return (

        <div className="container34">    
        <div>
{qr===1?<Menu activo={0}/>:<Menu activo={0}/>}
        </div>
        <div className="contenido34">
            <div className="cabecera">
                <div className="vuelve">
                <Link to={'/home/'} className="limpiar">{t("VOLVER")}</Link>
                </div>
              
                    <div className="a">

                    {t("DETALLE")} {especimen?subespecimen(especimen?.especimennumero):''}

                    </div>
                {
                     userD.nivel <= 2 ? 
                <div className="vuelve2">
                    <h6 onClick={e => printFicha(especimen,"e")} class='limpiar'>{t("IMPFICHA")} </h6>
                    <a className="limpiar" onClick={e=>eliminaEspecimen(especimen?.especimennumero)}>{t("ELIMINAESP")}</a>
                </div>
                        : null
                }
               
            </div>
            <div className="cuerpo">
                <div className="col1-detalle">
                    <div className="info1">
                     
                            <label className="colu1"> {t("GENRE")}:</label>

                            <h6 class='datosCur2'>{especimen?.genero?especimen.genero:'Sin especificar'}</h6>
                         
                    </div>
                   
                    <div className="info1">   
                    <label className="colu1" > {t("SPECIES")}:</label>

                        <h6 class='datosCur2'>{especimen?.especie?especimen.especie:'Sin especificar'}</h6>
                     
                     
                    </div>
                    <div className="info1">
                    <label className="colu1"> {t("BOCHCNRO")}:</label> 
                            <h6 class='datosCur'>{especimen?.bochonnumero!='0'?<a href={`/home/bochon/${especimen?.bochonnumero}`} target='_blank' class='href-detalle'>{especimen?.bochonnumero}</a>:'Sin especificar'}</h6>       
                        
                    </div>
             
                    <CajaDetalle tipo='filo' elementos={especimen?.posicionfilo}
                        />
                    <CajaDetalle tipo='esqueletal' elementos={especimen?.partesesqueletales}
                        />
                    
                
               
                </div>
                 <div className="col2">
                    <div className="info1">
                        <label >{t("PERIODO")}:</label>
                        <h6 class='datosCur'>{especimen?.periodo}</h6>
                    </div>
                    <div  class='info1'>
                        <label >{t("EPOCA")}:</label>
                        <h6 class='datosCur'>{especimen?.epoca}</h6>
                        
                    </div>
                    <div  class='info1'>
                        <label >{t("PISO")}:</label>
                        <h6 class='datosCur'>{especimen?.piso}</h6>
                    </div>
                    <div  class='info1'>
                        <label >{t("CUENCA")}:</label>
                        <h6 class='datosCur'>{especimen?.cuenca}</h6>
                    </div>
                    <div  class='info1'>
                        <label >{t("TRAINING")}:</label>
                        <h6 class='datosCur'>{especimen?.formacion}</h6>
                    </div>
                    
                    <div  class='info1'>
                        <label >{t("MIEMBRO")}:</label>
                        <h6 class='datosCur'>{especimen?.miembro}</h6>
                    </div>
                    <div  class='info1'>
                        <label >{t("LOCALIDAD")}:</label>
                        <h6 class='datosCur'>{especimen?.localidad}</h6>
                     </div>
                     <div  class='info1'>
                     <label >{t("CAMPAIGN")}:</label>
                     <h6 class='datosCur'>{especimen?.campana}</h6>
                     </div>
                     <div  class='info1'>
                     <label >{t("FECHACAM")}:</label>
                     <h6 class='datosCur'>{especimen?.fechadescubrimiento}</h6>
       
                     </div>
                     {
                    userD.nivel >=3 ? null :
                    <div  class='info1'>
                 <div class='qrs'>
                
                   <div class='qr-div2'onClick={(e)=> agregarqr(e)}>{t("GENQR")}</div>
                   <a href={`/home/plantillaqr/${especimen?.especimennumero}`}target='_blank' ><div class='qr-div2'>{t("IMPRIQR")}</div></a>
                 </div>
                 </div>  
                 } 
                </div>
                <div className="col1">
                <div  class='info111'>
                <label >{t("FIELD")}</label>
                <h6 class='datosCur'>{especimen?.nrocampo}</h6>
       </div>
       <div className="mostradorDetalle-cord">
                            <div className="cabeza">
                            <label className="lab">{t("COOR")}</label>
                            </div>
                            {coordenadas?.latitud.gra>0?<div class='info1C'>
                            {coordenadas?.latitud.completa}
                          <br></br>                           {coordenadas?.longitud.completa}
                            </div>:<div class='info1C'>
                            {t("MAPSNO")}
                            </div>}
                            
                           </div>
{coordenadas?.latitud.gra>0? <a className="base1D" href={'https://www.google.com/maps/place/'+especimen?.coordlat+','+especimen?.coordlong} target='_blank'>
                                     <h6 className="h67"> {t("MAPS")}  </h6>
                                 </a>: <a className="base1D"  target='_blank'>
                                    
                                 </a>}
                             <div  class='info111'>
                     <label >{t("DISCOVERER")}:</label>
                     <h6 class='datosCur'>{especimen?.descubridor}</h6>
       
                     </div>
                <div  class='info111'>
                <label >{t("PREPARADOR")}:</label>
                <h6 class='datosCur'>{especimen?.preparador}</h6>
                </div>
                <div  class='info111'>
                <label >{t("FECHAPRE")}:</label>
                <h6 class='datosCur'>{especimen?.preparacionfecha}</h6>
                </div >
                <div  class='info111'>
                <label >{t("FRAGMENTOS")}:</label>
                <h6 class='datosCur'>{especimen?.cantidadfrag}</h6>
                </div>
                <div  class='info111'>
                     <label >{t("HOLOTIPO")}:</label>
                     <h6 class='datosCur'>{especimen?.holotipo.toUpperCase()}</h6>
                  </div>
                <div  class='info1coment'>
                <label >{t("COMENT")}:</label>
                <textarea type='text' class='textar'name='comentario' defaultValue={especimen?.comentario}/>
                </div>
                <div className="info111">
                {
                    especimen?.prestado&& userD.nivel <3  ? 
                               <div class='en-prestamo' onClick={(e)=> abrirPrestamo(e)}>{t("ONLOAN")}</div> : null

                 }
                </div>
                </div>
                <div className="col4-detalle">
                <div className="info3-detalle1">
                       
                            <div className="cabeza5-detalle1">
                            <h6 class='datos66'>{t("ARMARIO")} {especimen?.armario1}</h6>
                 
                            </div>
                            <div className="estante-detalle">
                            <h6 class='datos'>{t("ESTANTE") +' '+especimen?.estante1desde+' ' +t("UNTIL").toLowerCase() +' '+especimen?.estante1hasta} </h6>
                    
                            </div>
            </div>
            <div className="info3-detalle1">
                       <div className="cabeza5-detalle1">
                       <h6 class='datos66'>{t("ARMARIO")} {especimen?.armario2}</h6>
                       </div>
                       <div className="estante-detalle">
                       <h6 class='datos'>{t("ESTANTE")} {especimen?.estante2desde} {t("UNTIL").toLowerCase()} {especimen?.estante2hasta} </h6>
               
                       </div>
       </div>
        <div className="info3-publicacion">
                       <div className="cabeza5">
                           <label className="lab">{t("PUBLICA")}:</label>
                       </div>
                       <div className="publicaiones-detalle">
                       {
                            especimen?.pdf?.length>0 ? 
                            especimen?.pdf.map(el => {return <a href={`${url}getpdf/` + el} target="_blank" class='caca326'>{el.length>35?el.slice(0,25)+'...pdf':el}</a>
                            }) : <p>{t("NOPDF")}</p>
                        }
               
                       </div>
                            
                       
       </div>    
       {
         especimen?.imagen?.length>0? 
         <div className="info3-imagen-detalle">
         <div className="cabeza">
         <label className="lab">{t("IMAGENES")}</label>
         </div>
                     <Carousel >
                         {especimen?.imagen?.map(el => { 
                             return <Carousel.Item>
                            {
                                el.length < 40 ?
                                <img 
                                    onClick={e=>abririmagen(el,e)}
                                     src={`${url}getImg/` + el}
                                     alt='banner'
                                    className="foto"
                                    />
                                    :
                             <img 
                                    onClick={e=>abririmagen(el,e)}
                                     src={el}
                                     alt='banner'
                                    className="foto"
                                    />
                            }
                         
                             </Carousel.Item>
                         })}
                         </Carousel>

                        </div>
                        :
                        <div className="info3-imagen-detalle2">
                        <div className="cabeza">
                        <label className="lab">{t("IMAGENES")}</label>
                        </div>
                                   <div class='sin-imagen'>{t("NOIMG")}</div>
               
                                       </div>

         }
            </div>
            </div>
            <div className="pie">
            {
                        userD.nivel >= 3 ? null :
                        <Link  className="pie2" to={`/modificar/${especimen?.especimennumero}`}>
                         {t("MODIF")}
                        </Link>
                    } 
            </div>
        </div>
</div>
            )
}
