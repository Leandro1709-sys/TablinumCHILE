import './menu.css';
import {FiSettings} from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import tablinum from "../img/verte.png"
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { BiQrScan,BiLogOut } from "react-icons/bi";
import React, { useEffect, useState} from "react";
import {useTranslation} from "react-i18next"
import esp from '../img/espana.png'
import eng from '../img/reino-unido.png'



export default function Menu({activo}) {
    const { isAuthenticated, user,isLoading, logout} = useAuth0();
    const [t, i18n] = useTranslation("global")
    const userD = useSelector((state)=> state.usuario)
    const navigate = useNavigate()
    const usuario1 = useSelector((state)=> state.usuario)
    const codigo = useSelector((state)=> state.qrs)
      
    const btnContainer = document.getElementById("botones");
        // Get all buttons with class="btn" inside the container
    if(btnContainer) { var btns = btnContainer.getElementsByClassName("botonCito");

   if(activo===5){
    var current = document.getElementsByClassName("active2");
    if (current.length > 0) {
             current[0].className = current[0].className.replace(" active2", "");
           }
   
   }else{
    var current = document.getElementsByClassName("active2");
    if (current.length > 0) {
             current[0].className = current[0].className.replace(" active2", "");
           }

    btns[activo].className=btns[activo].className += " active2";
   
   }
      
    }

    return (
        <div class='padre'>
            { isAuthenticated ? 
                <div>
            <div class='nav-Bar1'>
                <div class='logo-home'>
                    <img src={tablinum} width="100%" height="100%" className='imag' onClick={() => navigate(`/home`) }/>
                </div>
                    {
                        userD.nivel>=3 ?
                <div class='botones' id='botones'>
                     <h4  class="botonCito"  onClick={() => navigate(`/home`) } ><p className='pboton'>Catalogo Especímenes</p></h4>
                </div> :
                <div class="botones" id='botones'>
                
                <h4 class="botonCito" onClick={() => navigate(`/home`) } ><p className='pboton'>{t("SPECIMENS")}</p></h4>
               
                <h4  class="botonCito"  onClick={() => navigate(`/home/bochon`) } > <p className="pboton">{t("BOCHONS")}</p> </h4>
              
                <h4  class="botonCito"  onClick={() => navigate(`/home/crear/especimen`) }>  <p className="pboton">+ {t("CREATE.SPECIMENS")}</p> </h4>

                <h4  class="botonCito"  onClick={() => navigate(`/home/crear/bochon`) } > <p className="pboton">+ {t("CREATE.BOCHONS")}</p> </h4>
               
                <h4  class="botonCito"  onClick={() => navigate(`/home/prestamos`) } > <p className="pboton">{t("LOANS")}</p> </h4>
               
                {
                 codigo[0] ?<span tooltip='Códigos QR' flow='left'><a href={`/home/plantillaqr/${codigo}`}target='_blank'  > <BiQrScan color='white' width='80px' /> </a></span> : null
                }
                </div>

                    }
                <div className='lang'>
                  <div className='langTXT'>
                  Idioma / Language
                  </div>
                  <div className='langbot'>
                  <button onClick={() => i18n.changeLanguage("es")} class='icon-lng'>
                  <img src={esp} width='30px' height='30px' class='icon-lng'></img>
                </button>
                <button onClick={() => i18n.changeLanguage("en")} class='icon-lng'>
                <img src={eng} width='30px' height='30px'class='icon-lng' ></img>

                </button>

                  </div>
             
                </div>
                <div class='perfil'>
                  <div>
                    {user?.picture ? <img src={user?.picture} class='img-perfil' width='70%' height='50%'></img> : <></>}
                      </div>
                            <div>
                              <div>
                                <span tooltip={t("USER")} flow='left'>
                           <FiSettings size='20px' class='boton-icono'  onClick={() => navigate(`/home/setting/${usuario1.id}`) }/>
                           </span>
                           </div>
                           
                            <div>
                            <span tooltip={t("LOG")} flow='left'>
                            <BiLogOut size='20px'  class='boton-icono'onClick={() => logout({returnTo: window.location.origin})}/>
                            </span>
                            </div>
                            </div>
                            </div>
                    </div>   
                </div>: navigate('/')
  }
           </div>
    )
}