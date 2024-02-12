import React, { useEffect } from "react";
import { LogOutButton } from "./logout";
import { LoginButton } from "./login";
import { Perfil } from "./perfil";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import './landingPage.css'
import { Link } from "react-router-dom";
import { crearUsuario } from "../../store/action";
import tablinum from "../img/tablinumBlanco.png";
import {url} from '../../URL.js'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";

export default function LandingPageTablinum() {
  const navigate = useNavigate()
  const { isAuthenticated, user} = useAuth0();
  const usuario1 = useSelector((state)=> state.usuario)
  const dispatch = useDispatch()
 
  const ruta = `/home`

  useEffect (() => {
       if(isAuthenticated){
      dispatch(crearUsuario({
        id: user.sub,
        correo: user.email,
        imagen: user.picture,
        nombre : user.name
      
      }))
    }
    
  },[isAuthenticated])
  let styleDiv = {
    marginTop: "25px"
  }
  let styleBotones = {
    marginTop: "25px",
    padding: "10px",
    display: 'flex',
    justifyContent: 'space-around',
  }
 
  function setPassWord(e){
 e.preventDefault();



 Swal.fire({
  title: 'Desea guardar el PIN',
  toast: true,
  position: 'bottom-end',
  showDenyButton: true,
  confirmButtonText: 'Guardar',
  denyButtonText: `Cancelar`,
}).then((result) => {

  if (result.isConfirmed) {
    var pass = Number(e.target[0].value)
    var obj = {id:usuario1.id, contrasena: pass}
    axios.put(`${url}usuariosRoute/modificarUsuario`, obj).then(navigate(`/home`))
          
  } 
})
 
  }
  function ingresar(e){
    var pass = document.getElementById('pass').value
 
  if(pass.length>0 && pass == usuario1.contrasena){
      pass = ''
      navigate(`/home`)
    } else if(pass.length === 4 && pass != usuario1.contrasena){
      document.getElementById('resultado').innerHTML = 'PIN incorrecto';
    } else if(pass.length === 0){
      document.getElementById('resultado').innerHTML = '';
    }
    

  }
  return (
    <div>    
    <div class="containers">
      <div class='marco'> 
        <div class='boton-login-div' >
      
     
      {isAuthenticated? (
        <>        
        <div>
        <img src={tablinum} width="70%" ></img>
          
           </div>
          <Perfil />
          {
            usuario1?.contrasena==null?
            <form type='submit' onSubmit={(e)=> {setPassWord(e)} }>
             <div><label class='label-pin'>Debe crear PIN (4 digitos numericos)</label><input type='password'class='input-pin' autoComplete='false' name='password' maxlength='4' pattern="\d*"required></input>
             <button class='buton-pin' type='submit'>crear</button></div> 
             </form>
            :<div>
            <label>PIN:</label>
            <input class='input-pin' type='password' name='password' id='pass' maxlength='4' pattern="\d*"required onChange={(e)=> ingresar(e)}></input>
            <p id='resultado' class='resultado1'></p>
            </div>
          }
          <div style={styleBotones}>
          <LogOutButton />
          </div>
        </>
      ) 
        :
      (
        <div>
          <img src={tablinum} width="70%"></img>
            <div class='text'>
            
            <LoginButton />
            </div>
        <br/>
        <br/>
        <br/>
        </div>
      )}
        </div>
      </div>
    </div>
    </div>
  );
}