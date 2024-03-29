import React from "react";
import {useAuth0} from '@auth0/auth0-react'


export const LogOutButton = () => {
    const { logout } = useAuth0();
 
    return (
    <button onClick={() => logout({returnTo: window.location.origin})} class="btn btn-primary btn-sm w-40">Logout</button>
    
    )
}