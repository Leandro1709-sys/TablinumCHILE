

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './plantillaqr.css'
import { useParams } from "react-router";
import { subespecimen } from "../../store/action";
export function Plantillaqr(){
    const codigos = useSelector((state)=> state.qrs)
    const params = useParams()
    
    const navigate = useNavigate()
    function func() {
        return ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
        }
        let parametro = params.qr
        let array2 = parametro.split(",")
        let array = array2.filter((item,index)=>{
            return array2.indexOf(item) === index;
          })
    return(
        <div>
            <div class='div-qr' id='div-imprimir'>
                { 
                array?.map(el => {
                    let UUID = (func() + func() + "-" + func() + "-3" + func().substr(0,2) + "-" + func() + "-" + func() + func() + func()).toLowerCase();
                    return <div class='qr'>
                            <h5>especimen: {subespecimen(el)}</h5>
                            <img src={`http://api.qrserver.com/v1/create-qr-code/?data=https://pv.tablinum.host/home/qr/${UUID}/${el}&size=150x150`}></img>
                    </div>
                })
                }
            </div>
        </div>
    )
}