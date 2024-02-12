import axios from 'axios';
import { useSelector } from 'react-redux';
import React, { useEffect, useState} from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import './setting.css'
import Menu from '../NAVBAR/menu';
import { FiCheck} from "react-icons/fi";
import {url} from '../../URL.js'
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { BiQuestionMark,BiData,BiPrinter } from "react-icons/bi";
 import Swal from 'sweetalert2' 
import {Toast,subespecimen, fechaActual} from '../../store/action/index.js'
import {useTranslation} from "react-i18next"

import { jsPDF } from "jspdf";



export function Setting(){
    const { isAuthenticated, user} = useAuth0();
    const usuario1 = useSelector((state)=> state.usuario)
    const [usuarioList, setUsuarioList] = useState(null)
    const [modificacionesList, setModificacionesList] = useState([])
    const [users, setUsers] = useState(null)
    const [estado, setEstado] = useState(false)
    const [nombreNew, setNombreNew] = useState('')
    const [pin, setPin] = useState(0)
    const [reload, setReload] = useState(0)
    const ids = useParams()
    const [t, i18n] = useTranslation("global")
   
    useEffect(() => {
       axios.get(`${url}usuariosRoute/usuario`)
       .then(res => {
        setUsuarioList(res.data)
       })
       axios.get(`${url}usuariosRoute/usuario?id=`+ user.sub)
       .then(user => {
        setUsers(user.data)
       })
      
        }, [reload])

    function modificarNivel(e, elemento){
        let newLevel = e.target.value
        let idUser = elemento.id
        let obj = {
            id: idUser,
            nivel: newLevel
        }
        axios.put(`${url}usuariosRoute/modificarUsuario`, obj)
        .then(res=> Toast.fire({
            icon: 'success',
            title: 'Nivel de Usuario modificado'
          }) )
          setReload(reload +1 )
        axios.get(`${url}usuariosRoute/usuario`)
        .then(res => {
         setUsuarioList(res.data)
        })

    }
   
    function cambiarNombre(e){
        if(e.target.value){
            setNombreNew({nombre:e.target.value, id: user.sub})
        }
        else{
            setNombreNew('')
        }
    }
    function submitNombre(e){
        e.preventDefault()
        /* const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          }) */
        axios.put(`${url}usuariosRoute/modificarUsuario`, nombreNew).then(Toast.fire({
            icon: 'success',
            title: 'Cambio de Nombre exitoso'
          }))
        document.getElementById('nombre').value = nombreNew.nombre
        setNombreNew('')
    }
    let usuariosListFinaly = usuarioList
   
    let styleImg = {
        width: '46px',
        borderRadius: '50px'
    }
    function SortArray(x, y){
        if (x.nivel < y.nivel) {return -1;}
        if (x.nivel > y.nivel) {return 1;}
        return 0;
    }
    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">{t("DIF")}</Popover.Header>
          <Popover.Body>
         
                   <strong>Nivel-1 : </strong>{t("TOTAL")}<br/>
                   <strong>Nivel-2 : </strong>{t("CREA")} <br/>
                   <strong>Nivel-3 : </strong>{t("SOLO")} <br/>
                   <strong>Nivel-4 : </strong>{t("MINI")}<br/>
          </Popover.Body>
        </Popover>
      );
    
    let usuariosListFinalySort = usuariosListFinaly?.sort(SortArray)
    function activePIN(){
        setPin(1)
    }
    function cambiarPIN(e){
        e.preventDefault()
       var pinActual = users?.contrasena;
       var pinViejo = document.getElementById('pinViejo').value
       var pinNuevo = document.getElementById('pinNuevo').value
   
        if(pinActual == pinViejo && pinNuevo.length == 4){
            Swal.fire({
                title: t("CONFI"),
                toast: true,
              
                showDenyButton: true,
                confirmButtonText:  t("SI"),
                denyButtonText: t("CAN"),
              }).then((result) => {
              
                if (result.isConfirmed) {
                    var cambio = {id: user.sub, contrasena: pinNuevo }
                    axios.put(`${url}usuariosRoute/modificarUsuario`, cambio).then(
                          Toast.fire({
                            icon: 'success',
                            title:  t("+CONFI")
                          })
                    )
                    setPin(0)
                } 
              })
                
            

        } else if (pinActual != pinViejo) {
            Toast.fire({
                icon: 'error',
                title:  t("NOPIN")
              })
            
            document.getElementById('pinViejo').value = '';
            document.getElementById('pinNuevo').value = '';
        } else {
            Toast.fire({
                icon: 'alert',
                title:  t("AGAIN")
              })
        }
    }
   

    return(
        <div class='container34'>
             <Menu activo={5}/>

            <div className="contenido342">
            <div className="cabecera">
               
                <div className="apre">
                    {t("AJUSER")}
                
               </div>
               {
            users?.nivel === 1? <span tooltip={t("DES")} flow='left'><a class='backup'href={`${url}backup/`} download='back' target='_blank'><BiData/></a></span>:null
                    }
              
           </div>
            <div className='cambia-nom'>
                <h5 className='hhh'>{t("CAM")}:</h5>
                 <input type='text' name='nombre' id='nombre'className='inputing' placeholder={users?.nombre} onChange={(e)=> cambiarNombre(e)}></input>
                 {
                    nombreNew.nombre ? <button class='pin-nuevo-s' onClick={(e)=> submitNombre(e)}><FiCheck/></button> :null
                 }
                 
            </div>
            
                 {
                    pin === 1  ?
                    <div class='nuevoPin'> 
                    <form type='submit' onSubmit={(e)=> cambiarPIN(e)}>
                       <div className="conte-div">
                    <label>{t("PIN")}:</label>
                    <input type='password' id='pinViejo' className="sdsd55"   maxlength='4' pattern="[0-9]*" required inputmode="numeric"/>
                    </div>
                    <div className="conte-div">
                    <label>{t("+PIN")}:</label>
                    <input type='password'  id='pinNuevo' className="sdsd55"  autoComplete='off' maxlength='4' required pattern="[0-9]*" inputmode="numeric" />
                    </div>
                    <button class='pin-nuevo-s' type='submit'><FiCheck/></button>
                    
                       
                        </form>
                        </div> : <div class='nuevo-pin'><button class='pin-nuevo-s'onClick={(e)=> activePIN(e)}>{t("-PIN")}</button> </div>
                 }
        {
            users?.nivel === 1? 
            
            <div className='todi'>
            <div className="control-u">
                <div className='ttti'>
              <p className="ni">{t("NIVEL")}:</p> 
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                        <Button size='sm' variant='outline-dark' className='butoto'><BiQuestionMark size="20px" /></Button>
                    </OverlayTrigger>
                </div>
                     
           
            </div>
            
           
            
                <div id="main-container21">
                    <div className='tablita'>
                <table class="rwd_auto fontsize">
		<thead className='head-set'>
		<tr>
			<th>{t("NAME")}</th>
            <th></th>
			<th>{t("MAIL")}</th>
			<th>{t("LEVEL")}</th>
			<th>{t("+LEVEL")}</th>
		</tr>
		</thead>
		<tbody>
      
        { 
               usuariosListFinalySort?.map((elemento) => {
                    return (
                        <tr key={elemento.id} className='pase'>
                        <td><img src={elemento.imagen} style={styleImg}></img></td>
                        <td>{elemento.nombre}</td>
                        <td>{elemento.correo}</td>
                        <td>{elemento.nivel}</td>
                        <td> 
                  

                         <select onChange={(e)=> modificarNivel(e, elemento)}>
                                <option>{t("+LEVEL").toLocaleLowerCase()}</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                            </select>
                            
                            </td>
                        
                      </tr>
                    );
                  })
               }
              
		</tbody>
	</table>
    </div>
          
        </div>
            </div> 
            
            : <></>
           
        }
            </div>
       
        </div>
    )
}