
import './detalleMobil.css'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Carousel } from 'react-bootstrap';
import {url} from '../../URL.js'
import tablinum from "../img/verte.png"
import museo from "../img/logomuseogrande.png"
import {subespecimen} from '../../store/action/index.js'

export function DetalleMobil(){
    let id = useParams()
    let ids = id.id
    const [especimen, setEspecimen] = useState(null)
     useEffect(() => {
        axios.get(`${url}especimenRoute/especimen/id?id=${ids}`)
        .then((response) => {
            setEspecimen(response.data) 
        })
        return () => {
            setEspecimen(null)
        }
    }, []) 

    return (
        <div class='padre432'>
            <div class='hijo3'> 
               <img src={tablinum} alt="logo" height='35px'/>
               <h1 className='espe'>Especimen {especimen?.especimennumero?subespecimen(especimen?.especimennumero):''}</h1>
            </div>
            <div class='hijo1'> 
                {/* <label class='italicNO'>Especimen Nro:</label>
                <label>{ especimen?.especimennumero ? subespecimen(especimen?.especimennumero.toString()): ''}</label> */}
            </div>
            <div class='hijo1'> 
                <div className="hijo11">
                <label class='italicNO'>Genero</label>
                </div>
                <div className="hijo12">
                    <label class='italic'>{especimen?.genero}</label>
                </div>
                
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
                  <label class='italicNO'>Especie</label>
                  </div>
                <div className="hijo12">
                <label class='italic'>{especimen?.especie}</label>
                </div>
                 
            </div>
           
            <div class='hijo1'> 
            <div className="hijo11">
                <label class='italicNO'>Posicion Filogenética</label>
              
                {especimen?.posicionfilo.length>0?especimen?.posicionfilo.map(e=>{
                    return <p class='caca'>{e}</p>
                }): <label >Sin posición</label>}
               
            </div>
            </div>
            <div class='hijo1'> 
            <div className="hijo12">
                <label class='italicNO'>Partes Esqueletales</label>
             
                {especimen?.partesesqueletales.length>0?especimen?.partesesqueletales.map(e=>{
                    return <p class='caca'>{e}</p>
                }):<label >Sin posición</label>}
              
            </div>
            </div>
            <div class='hijo1'> 
                <div className="hijo11">
                <label class='italicNO'>Periodo</label>
                </div>
                <div className="hijo12">
                <label>{especimen?.periodo}</label>
                </div>
               
                
            </div>
            <div class='hijo1'>
                <div className="hijo11">
                <label class='italicNO'>Epoca</label>
                </div>
                <div className="hijo12">
                <label>{especimen?.epoca}</label>
                </div>
                
               
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Piso</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.piso}</label>
            </div>
              
              
            </div>
         
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Cuenca</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.cuenca}</label>
            </div>
                
                
            </div>
           
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Formacion</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.formacion}</label>
            </div>
              
              
            </div>
            <div class='hijo1'>
           
            <div className="hijo11">
            <label class='italicNO'>Miembro</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.miembro}</label>
            </div> 
              
           
            </div>
      
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Localidad</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.localidad}</label>
            </div>
                
            </div>
      
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Coordenadas</label>
            </div>
            <div className="hijo13">
            <label>{especimen?.coordlat}</label>
            <label>{especimen?.coordlong}</label>
            </div>
            <div className="hijo13">
            <a className="" href={'https://www.google.com/maps/place/'+especimen?.coordlat+','+especimen?.coordlong} target='_blank'>ver en maps</a>
            </div>
         
             
               
            </div>
            {
            especimen?.camapana?
            <div class='hijo1'> 
                <div className="hijo11">
                <label class='italicNO'>Campaña</label>
                </div>
                <div className="hijo12">
                <label>{especimen?.camapana}</label>
            </div>
            </div>:''
        }
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Descubridor</label>
            </div>
            <div className="hijo12">
            <label>{especimen?.descubridor}</label>
                </div>
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Fecha Descubrimiento</label>
</div>
<div className="hijo12">
<label>{especimen?.fechadescubrimiento}</label>
    </div>
                
                
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Número de Campo</label>
</div>
<div className="hijo12">
<label>{especimen?.nrocampo}</label>
    </div>
                
                
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Preparador</label>
</div>
<div className="hijo12">
<label>{especimen?.preparador}</label>
    </div>
               
              
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Fecha Preparación</label>
</div>
<div className="hijo12">
<label>{especimen?.preparacionfecha}</label>
    </div>
               
               
            </div>
           
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Cantidad de Fragmentos</label>
</div>
<div className="hijo12">
<label>{especimen?.cantidadfrag}</label>
    </div>
                
          
            </div>
            <div class='hijo1'> 
            <div className="hijo11">
            <label class='italicNO'>Comentarios</label>
</div>
<div className="hijo12">
<label>{especimen?.comentario}</label>
    </div>
               
              
            </div>
            <div class='hijo1'> 
            <div className="hijo11">

</div>

         
            </div>
            
        </div>
    )

}