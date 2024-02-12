import { useParams } from "react-router";
import { useEffect} from "react";
import logoMuseo from '../img/logomuseogrande.png';
import { useDispatch, useSelector } from "react-redux";
import './plantillaPrestamos.css';
import { jsPDF } from "jspdf";
import { getDatos2, subespecimen } from "../../store/action";

export function PlanillaPrestamo(){
    const dispatch = useDispatch();
    const params = useParams()
    useEffect(() => {
        dispatch(getDatos2())
 
                },[])           
     const especimenes = useSelector((state)=> state.especimenes)
    var arraynumero = params.nro.split(',')


var select = []
if(especimenes.length> 0){
   
            arraynumero?.map(el => {
   var x = especimenes?.filter(eleme => eleme.especimennumero == el)
   return select.push(x[0])
   
})
}

   function formato(texto){
    return texto.replace(/^(\d{4})-(\d{2})-(\d{2}||\d{1})$/g,'$3-$2-$1');
  }

function imprimirPDF(){
var x=80;

    const doc = new jsPDF();
    doc.addImage(logoMuseo,10,10,60,25)
    doc.setFontSize(12)
    doc.text("INSTITUTO Y MUESO DE CIENCIAS NATURALES", 65, 12);
    doc.setFontSize(10)
    doc.text("CATÁLOGO DE PALEOVERTEBRADOS", 83, 17);
    doc.setFontSize(10)
    doc.text(formato(params?.fecha), 168, 23);
    doc.rect(70, 23, 90, 10); // empty square
    doc.setFontSize(11)
    doc.text(params.tipo==='Préstamo'? 'Préstamo de especímenes': 'Consulta de especímenes',90,30 )
    doc.rect(30, 40, 150, 30); // empty square
    doc.setTextColor(100);
    doc.text('Investigador:',32,45 )
    doc.setTextColor(0,0,0);
    doc.text(55,45,params.receptor )
    doc.setTextColor(100);
    doc.text('Institución:',32,55 )
    doc.setTextColor(0,0,0);
    doc.text(params.insti,52,55 )
    doc.setTextColor(100);
    doc.text('Aval:',32,65 )
    doc.setTextColor(0,0,0);
    doc.text(params.emisor,42,65 )
    
    select?.map(el => {
        doc.setFont(undefined, 'regular');
        doc.text('Especimen PVSJ '+subespecimen(el.especimennumero),32,x );
        doc.setFont(undefined, 'italic');
        doc.text(el.genero+' / '+el.especie,80,x )
       
        x=x+10;
        
    })
    doc.line(20, x, 185, x); // horizontal line
    doc.setFont(undefined, 'regular');
    params.comen=='null'?doc.text('Sin observaciones ',32,x+10 ):doc.text('Observaciones: '+params.comen,32,x+10 );
    doc.text('Fecha de devolución: '+formato(params?.fechade),32,x+20 );

    doc.text('_ _ _ _ _ _ _ _ _ _ _ _                                                         _ _ _ _ _ _ _ _ _ _ _ _ ',32,x+45 )
    doc.text(params.emisor,30,x+55 )
    doc.text(params.receptor,135,x+55 )

    doc.save(params.tipo==='Préstamo'? 'Prestamo Especímenes '+params.receptor+'.pdf': 'ConsultaEspecimenes'+params.receptor+'.pdf');

 
}



    return(
        <div>
            <div class='prestamo-completo'>
                <div class='prestamo-cabeza'>
                    <div class='prestamo-imagen'>
                    <img src={logoMuseo} width="300px" height="130px"></img>
                    </div>
                    <div class='prestamo-centro'>
                        <div className="">
                            <h5>INSTITUTO Y MUSEO DE CIENCIAS NATURALES</h5>
                            
                      
                            <h6>CATALOGO DE PALEOVERTEBRADOS</h6>
                        </div>
                        <div class='div1234'>
                            <h5>{params.tipo==='Préstamo'? 'Préstamo': 'Consulta'} de especímenes</h5>
                        </div>
                    </div>
                    <div class='prestamo-fecha'>
                    <h6>{formato(params?.fecha)}</h6>
                    </div>
                </div>
                <div class='prestamo-info'>
                <div  class='info1-prestamo'>
                        <label >Investigador:</label>
                        <h6 class='datosCur'>{params.receptor}</h6>
                    </div>
                    <div  class='info1-prestamo'>
                        <label >Institución:</label>
                        <h6 class='datosCur'>{params.insti}</h6>
                    </div>
                    <div  class='info1-prestamo'>
                        <label >Aval:</label>
                        <h6 class='datosCur'>{params.emisor}</h6>
                    </div>
                </div>
            <div class='esp-prestamos'>
            {
               select?.map(el => {
                    return (
                        <div class='prestamo-div-esp'>
                                <h6>Especimen N°: {subespecimen(el.especimennumero)}</h6>
                                <h6 class='datosCur2'>{el.genero + ' ' +  el.especie}</h6>    
                        </div>
                    )
                })
            }
            </div>    
                <div class='observa'>
                { params.comen != 'null' ? <>
             <h6>Observaciones: {params.comen}</h6>
             </> : null}

             <h6>Fecha de devolución: {formato(params?.fechade)}</h6>
                </div>

                <div class='firma'>
                
                <div><p>_________________</p>
                <p>{params.emisor}</p>
                </div>
                <div><p>_________________</p>
                <p>{params.receptor}</p>
                </div> 
             
                </div>
                <div>
                    <h1 className="limpiar" onClick={e=>imprimirPDF()}>PDF!</h1>
                </div>
            </div>
        </div>
    )
}