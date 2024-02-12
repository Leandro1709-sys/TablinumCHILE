import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
//var global = require('../../Resto/global.module.css')

export const Perfil = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div> Loading...</div>;
  }
 console.log(user.sub)
 let style = {
  borderRadius: "60px",
 }
  
  return (
      isAuthenticated && (
          <div>
            {user.picture ? 
            <>
            <h4>{user.name}</h4>
            <img src={user.picture} style={style}/>
            </>
            :
            <>
            <img src='https://w7.pngwing.com/pngs/741/68/png-transparent-user-computer-icons-user-miscellaneous-cdr-rectangle-thumbnail.png' alt={user.name}/>
            <h4>{user.name}</h4>
            </>

          }
          </div>
      )
  )
};