import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import {useTranslation} from "react-i18next"
import {agregarQR, decimalAGrado, delBochon, postEspecimen, putBochon, subespecimen, Toast} from '../../store/action'
import Menu from "../NAVBAR/menu";
import { useDispatch,useSelector} from "react-redux";
import {url} from '../../URL.js'
import Swal from "sweetalert2";
import CajaDetalle from './cajaDetalle'
import printFicha from "../../FUNCIONES/printFicha";


const reqPdfs = require.context ( '../../pdf', true, /.pdf$/ )


export default function DetalleBochon (){
    const userD = useSelector((state)=> state.usuario)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [especimen, setEspecimen] = useState(null)
    const [numeros, setNumeros] = useState()
    const [t, i18n] = useTranslation("global")

   
    let id = useParams()
    let ids = id.id

    
    useEffect(() => {
        axios.get(`${url}bochonRoute/bochon/especimen/id?id=${ids}`)
        .then((response) => {
            setEspecimen(response.data)
        axios.get(`${url}especimenRoute/especimen/?parametro=nuevo`)   
        .then((respons) => {setNumeros(respons.data)}) 

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
    let pdfs = reqPdfs?.keys()


    let pdfArr = [];
    var coordenadas =  decimalAGrado(especimen?.coordlat,especimen?.coordlong)
    var linkMap='https://www.google.com/maps/place/'+especimen?.coordlat+especimen?.coordlong;

     if(pdfs.length>0){
    for(let i = 0; i < pdfs?.length; i++){
        especimen?.pdf?.map(el => {
            if('./' + el == pdfs[i]){
                pdfArr.push(i)
            }
        }
        )
    }
    } 

    function agregarqr(e){
        e.preventDefault()
        let idespecimen = especimen?.especimennumero
        dispatch(agregarQR(idespecimen))
    }

    function eliminaEspecimen(e){

        Swal.fire({
            title: t("ELIMINABO")+ e  +" ?",
            toast: true,
            position: 'top-end',
            showDenyButton: true,
            confirmButtonText: t("ELI"),
            denyButtonText: t("CAN"),
          }).then((result) => {
          
            if (result.isConfirmed) {
                var response=delBochon(e);
                
                return [navigate('/home/')]  
                    
            } 
          })
  
      
    }

    function bochonAespeciemen (){
        let cord = { latitud: especimen.coordlat,
            longitud: especimen.coordlong}
      let obj =  numeros.faltantes.reduce(function(target, key, index) {
            target[key] = subespecimen(key.toString());
           
            return target;
          }, {})
          let obj1=[Number(numeros.newId.toString().slice(0,numeros.newId.toString().length-3)+'000')];
          let obj1Key = obj1.reduce(function(target, key, index) {
            target[key] =subespecimen(key.toString());
            return target;
          }, {})
          
        const { value: fruit } =  Swal.fire({
            title: 'selecciona Nro de especimen',
            input: 'select',
            inputOptions: {
                'Ultimo numero' :obj1Key,
                'Numeros disponibles': obj,
            }, 
            inputPlaceholder: '',
            showCancelButton: true,
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value) {
                Swal.fire('Creacion exitosa', '', 'success')
                  axios.post(`${url}especimenRoute/especimen`, [especimen, cord, value])
                  .then((response) => {
                    setTimeout(() => {window.location.reload()}, "1000")
                    })
                } else {
                  resolve('tienes que seleccionar uno :)')
                }
              })
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
console.log('coordenadas?.latitud----->>>>>',coordenadas?.latitud)

    return (
        <div className="container34">    
        <div>
        <Menu activo={1}/>
        </div>
        <div className="contenido34">
            <div className="cabecera">
            <div className="vuelve">
                <Link to={'/home/bochon/'} className="limpiar">{t("VOLVER")}</Link>
                </div>
              
                    <div className="a">
                    {t("DETALLEB")} {especimen?.bochonnumero}
                    </div>
                
                <div className="vuelve2">
                <h6 onClick={e => printFicha(especimen,"b")} class='limpiar'>{t("IMPFICHA")} </h6>
                    <a className="limpiar" onClick={e=>eliminaEspecimen(especimen?.bochonnumero)}>{t("ELIMINABO")}</a>
                 
                </div>
            </div>
            <div className="cuerpo">
                <div className="col1-detalle">
                    <div className="info1">
                     
                            <label className="colu1">{t("GENRE")}:</label>

                            <h6 class='datosCur2'>{especimen?.genero?especimen.genero:'Sin especificar'}</h6>
                         
                    </div>
                   
                    <div className="info1">   
                    <label className="colu1" > {t("SPECIES")}:</label>

                        <h6 class='datosCur2'>{especimen?.especie?especimen.especie:'Sin especificar'}</h6>
                    </div>
                 
                   <CajaDetalle tipo='espe' elementos={especimen?.especimennumero}
                        />
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
                    
                     <div  class='info1'>
                                      
               
                     </div>  
                </div>
                <div className="col1">
                <div  class='info1'>
                <label >{t("FIELD")}:</label>
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
   
                  
                <div  class='info1'>
                <label >{t("PREPARADOR")}:</label>
                <h6 class='datosCur'>{especimen?.preparador}</h6>
        
   
                </div>
                <div  class='info1'>
                <label >{t("FECHAPRE")}:</label>
                <h6 class='datosCur'>{especimen?.preparacionfecha}</h6>
      
     
                </div >
                <div  class='info1'>
                <label >{t("FRAGMENTOS")}:</label>
                <h6 class='datosCur'>{especimen?.cantidadfrag}</h6>
           
                </div>
                <div  class='info1'>
                     <label >{t("HOLOTIPO")}:</label>
                     <h6 class='datosCur'>{especimen?.holotipo.toUpperCase()}</h6>
                    
                  </div>

                  <div  class='info1coment'>
                <label >{t("COMENT")}:</label>
                <textarea type='text' class='textar'name='comentario' defaultValue={especimen?.comentario}/>
       
                </div>
               
             
                </div>
                <div className="col4-detalle">
                <div className="info3-detalle1">
                       
                            <div className="cabeza5-detalle1">
                              
                                <h6 class='datos66'>{t("ARMARIO")} {especimen?.armario1}</h6>
                 
                            </div>
                            <div className="estante-detalle">
                            <h6 class='datos'>{t("ESTANTE") +' '+especimen?.estante1desde+' '+t("UNTIL").toLowerCase() +' '+especimen?.estante1hasta} </h6>
                    
                            </div>
                                 
                            
            </div>
            <div className="info3-detalle1">
                       
                       <div className="cabeza5-detalle1">
                       <h6 class='datos66'>{t("ESTANTE")} {especimen?.armario2}</h6>
            
                       </div>
                       <div className="estante-detalle">
                       <h6 class='datos'>{t("CAJON")} {especimen?.estante2desde} {t("OF")} {especimen?.estante2hasta} </h6>
               
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
                     <Carousel variant= 'dark'>
                         {especimen?.imagen?.map(el => { 
                             return <Carousel.Item>
                             <div class='div-imagen'>
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
                         
                             </div>
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
                        <>
                        <Link  className="pie2" to={`/modificar/bochon/${especimen?.bochonnumero}`}>
                        {t("MODIF")}
                        </Link>
                        {
                            especimen?.especimennumero == '0' ?
                            <a  className="pie2" onClick={(e)=> bochonAespeciemen(e)}>{t("GENERAESP")}</a>
                            : null
                        }
                       </>
            } 
                            
            </div>
        </div>
</div>
            )
}