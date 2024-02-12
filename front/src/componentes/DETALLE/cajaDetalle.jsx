
import {useTranslation} from "react-i18next"
import { subespecimen } from "../../store/action"



export default function CajaDetalle({tipo, elementos}){

    
    const [t, i18n] = useTranslation("global")
    console.log(elementos)
    return(
        <>
        <div className="info3-detalle">
                    <div className="mostradorDet">
                                <div className="cabeza">
                                    {
                                        tipo == 'esqueletal' ? 
                                        <label className="lab">{t("PARTS")}</label>
                                        : tipo=='filo'?
                                        <label className="lab">{t("PHYLOGENETICS")}</label>
                                        :<label className="lab">{t("ESPECNRO")}</label>
                                    }

                                                </div>
                                            {
                                            elementos?.length===0?<><p className="sin"> {tipo == 'esqueletal' ?  t("NOPAR") : tipo == 'esqueletal' ?  t("NOFILO"):t("NONUM")}</p></>:elementos?.length<9?elementos?.map(el => {return <div className="caca32">{tipo==='espe'? <a href={`/home/${el}`} target='_blank' class='href-detalle'>{subespecimen(el)}</a>:el}</div> }):elementos?.map(el => {return <div className="caca32B">{tipo==='espe'?subespecimen(el):el}</div> })

                                          }
                                            
                                        </div>               
                </div>
        </>
    )
}