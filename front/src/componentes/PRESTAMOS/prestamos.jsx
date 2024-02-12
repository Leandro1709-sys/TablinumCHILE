import Menu from "../NAVBAR/menu";
import logoMuseo from '../img/logomuseogrande.png';
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import './prestamos.css'
import { getDatos2, subespecimen, Toast } from "../../store/action";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import axios from "axios"
import { BiPrinter } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import { url } from '../../URL.js'
import { jsPDF } from "jspdf";
import {useTranslation} from "react-i18next"

export function Prestamos() {
    const navigate = useNavigate()
    let dispatch = useDispatch()
    let especimenes = useSelector((state) => state.especimenes)
    let usuario = useSelector((state) => state.usuario)

    let espec = especimenes;
    const { isAuthenticated, user } = useAuth0();
    const [prestamo, setPrestamo] = useState({ tipoprestamo: 'Préstamo' })
    let fecha = obtenerFecha()
    const [listapres, setListapres] = useState()
    const [prestamoFilter, setPrestamoFilter] = useState()
    const [numb, setNumb] = useState(0)
    const [espeSelect, setEspectSelect] = useState()
    const [numerosEspe, setNumerosEspe] = useState([])
    const [t, i18n] = useTranslation("global")

    function traerPrestamos() {
        axios.get(`${url}prestamosRoute/prestamos`)
            .then(res => setListapres(res.data))
    }
    useEffect(() => {
        dispatch(getDatos2())
        traerPrestamos()

    }, [numb])

  

    function obtenerFecha() {
        let fechaActual
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        if (month < 10) {
            fechaActual = year + '-0' + month + '-' + day /* day + '/0' + month + '/' + year */
        } else {
            fechaActual = year + '-' + month + '-' + day
        }
        if (day < 10) {
            fechaActual = year + '-0' + month + '-' + '0' + day
        }
        return fechaActual
    }
    function detallePrestamo(e, elemento) {
        let fecha1 = obtenerFecha()
        let put = { especimennumero: elemento.numeroespecimen, prestado: false }
        let update = { id: elemento.id, fechadevolucion: fecha1, devuelto: true }
        let idPrestamo = elemento.id
        if (elemento.devuelto) {
            const { value: formValues } = Swal.fire({
                title: `${elemento.tipoprestamo}`,
                html:
                    `<p>Prestado por : ${elemento.emisor}</p>` +
                    `<p>Investigador: ${elemento.investigador}</p>` +
                    `<p>Correo: ${elemento.correo}</p>` +
                    `<p>Contacto: ${elemento.contacto}</p>` +
                    `<p>Institución: ${elemento.institucion}</p>` +
                    `<p>Nro espécimen : ${elemento.numeroespecimen.map(el => { return (subespecimen(el)) })}</p>` +
                    `<p>Fecha de préstamo: ${elemento.fechaprestamo}</p>` +
                    `<p>Fecha devolución estimada: ${elemento.fechadevolucionest}</p>` +
                    `<p>Comentario: ${elemento.comentarios != null ? elemento.comentarios : 'Sin comentarios'}`,
                showCloseButton: true,
                showDenyButton: true,
                showConfirmButton: true,
                denyButtonText: t("VOLVER"),
                confirmButtonText: t("ELI"),
                preConfirm: () => {

                    return [
                        axios.delete(`${url}prestamosRoute/eliminarPrestamos?id=` + idPrestamo)
                            .then(res => {
                                if (res.status == 200) {
                                    Swal.fire(
                                        t("-PRESTA"),
                                        t("VOLVER"),
                                        'success'
                                    )
                                    setTimeout(() => { traerPrestamos() }, "1000")
                                    traerPrestamos()
                                } else { Swal.fire('Algo salio mal, vuelve a intentarlo ', '', 'warning') }
                            })

                    ]
                }
            })
            if (formValues) {
                Swal.fire(JSON.stringify(formValues))
            }

        } else {
            const { value: formValues } = Swal.fire({
                title: `${elemento.tipoprestamo}`,
                html:
                    `<p>Prestado por : ${elemento.emisor}</p>` +
                    `<p>Investigador: ${elemento.investigador}</p>` +
                    `<p>Correo: ${elemento.correo}</p>` +
                    `<p>Contacto: ${elemento.contacto}</p>` +
                    `<p>Institución: ${elemento.institucion}</p>` +
                    `<p>Nro espécimen : ${elemento.numeroespecimen.map(el => { return (subespecimen(el)) })}</p>` +
                    `<p>Fecha de préstamo: ${elemento.fechaprestamo}</p>` +
                    `<p>Fecha devolución estimada: ${elemento.fechadevolucionest}</p>` +
                    `<p>Comentario: ${elemento.comentarios != null ? elemento.comentarios : 'Sin comentarios'}`,
                    
                

                showCloseButton: true,
                showDenyButton: true,

                denyButtonText: t("VOLVER"),

                confirmButtonText:  t("DEVO"),
                preConfirm: () => {
                    Swal.fire(
                        t("PREACT"),
                        t("VOLVER"),
                        'success'
                    )
                    return [
                        axios.put(`${url}prestamosRoute/prestamos`, update),
                        axios.put(`${url}modificarespre`, put),
                        setTimeout(() => { traerPrestamos() }, "1000"),
                        traerPrestamos(),

                    ]
                }
            })
            if (formValues) {
                Swal.fire(JSON.stringify(formValues))
            }
        }

    }

    // console.log(listapres)
    function changeInput(e) {
        setPrestamo({
            ...prestamo,
            [e.target.name]: e.target.value
        })
    }

    function submitPrestamo(e) {

        let obj = {
            emisor: user?.name,
            fechaprestamo: fecha,
            tipoprestamo: prestamo.tipoprestamo,
            investigador: prestamo.investigador,
            correo: prestamo.correo,
            contacto: prestamo.contacto,
            numeroespecimen: numerosEspe,
            institucion: prestamo.institucion,
            comentarios: prestamo.comentarios,
            fechadevolucionest: prestamo.fechadevolucionest,

        }

        let investi = document.getElementById('investigador').value
        let put = { especimennumero: numerosEspe, prestado: true }
        if (!numerosEspe) {
            Toast.fire({ icon: 'warning', title: t("-NUM")  })

        }

        else {
            axios.post(`${url}prestamosRoute/prestamos`, obj)
                .then(res => { Toast.fire({ icon: 'success', title: t("+PRESTA") }) })
            axios.put(`${url}modificarespre`, put)
            traerPrestamos()
            setPrestamo(null)
            setNumb(numb + 1)
        }

    } let back = 'white'


    function filtrarPrestamo(e) {
        e.preventDefault()
        if (e.target.value.length === 0) {
            setPrestamoFilter(listapres)
        } else {
            if (!e.target.value.includes('-')) {
                console.log(e.target.value,listapres)

                let result = listapres?.filter(el => el.numeroespecimen.includes(e.target.value + '000'))
                
                setPrestamoFilter(result)
            } else {
                console.log(e.target.value)
                let result = listapres?.filter(el => el.numeroespecimen.includes(e.target.value.replace('-', '')))
                setPrestamoFilter(result)
            }

        }

    }

    function prestamoORconsulta(e) {
        setPrestamo({
            ...prestamo,
            tipoprestamo: e.target.value
        })
    }
    function filtrarEspecimen(e) {
        setNumerosEspe([...numerosEspe, e.target.value])
        if (e.target.value.length === 0) {
            setEspectSelect()
        }
        else {
            let especimenSelect = espec.filter(el => el.especimennumero === e.target.value)
            setEspectSelect(especimenSelect)
        }

    }

    let style = {
        color: "green",
        fontStyle: "oblique"
    }
    function eliminarNumero(el, e) {
        e.preventDefault()
        let cambio = numerosEspe.filter(occ => occ !== el)
        setNumerosEspe(cambio)


    }
    let numeroEspecimenes = espec?.map(el => el.especimennumero)

    function SortArray(x, y) {
        if (Number(x) < Number(y)) { return -1; }
        if (Number(x) > Number(y)) { return 1; }
        return 0;
    }

    function imprimirPDF(e){
        //console.log(e)
        var select = []

        var params2=listapres.filter(el=>el.id==e)
        var params=params2[0]
        if(especimenes.length> 0){
   
            params.numeroespecimen?.map(el => {
   var x = especimenes?.filter(eleme => eleme.especimennumero == el)
   return select.push(x[0])
   
})
}
        //console.log(params)
        var x=80;
        
            const doc = new jsPDF();
            doc.addImage(logoMuseo,10,10,60,25)
            doc.setFontSize(12)
            doc.text("INSTITUTO Y MUESO DE CIENCIAS NATURALES", 65, 12);
            doc.setFontSize(10)
            doc.text("CATÁLOGO DE PALEOVERTEBRADOS", 83, 17);
            doc.setFontSize(10)
            doc.text(formato(fecha), 168, 23);
            doc.rect(70, 23, 90, 10); // empty square
            doc.setFontSize(11)
            doc.text(params.tipoprestamo==='Préstamo'? 'Préstamo de especímenes': 'Consulta de especímenes',90,30 )
            doc.rect(30, 40, 150, 30); // empty square
            doc.setTextColor(100);
            doc.text('Investigador:',32,45 )
            doc.setTextColor(0,0,0);
            doc.text(55,45,params.investigador )
            doc.setTextColor(100);
            doc.text('Institución:',32,55 )
            doc.setTextColor(0,0,0);
            doc.text(params.institucion,52,55 )
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
            !params.comentarios?doc.text('Sin observaciones ',32,x+10 ):doc.text('Observaciones: '+params.comentarios,32,x+10 );
            doc.text('Fecha de devolución: '+formato(params?.fechadevolucionest),32,x+20 );
        
            doc.text('_ _ _ _ _ _ _ _ _ _ _ _                                                         _ _ _ _ _ _ _ _ _ _ _ _ ',32,x+45 )
            doc.text(params.emisor,30,x+55 )
            doc.text(params.investigador,135,x+55 )
        
            doc.save(params.tipoprestamo==='Préstamo'? 'Prestamo Especímenes '+params.investigador+'.pdf': 'ConsultaEspecimenes'+params.investigador+'.pdf');
        
         
        }
        

    let numerosSort = numeroEspecimenes?.sort(SortArray12)
    
    function formato(texto) {
        return texto.replace(/^(\d{4})-(\d{2})-(\d{2}||\d{1})$/g, '$3-$2-$1');
    }
    function SortArray(x, y) {
        if (x.updatedAt > y.updatedAt) { return -1; }
        if (x.updatedAt < y.updatedAt) { return 1; }
        return 0;
    }
    function SortArray12(x, y) {
        if (Number(x) < Number(y)) { return -1; }
        if (Number(x) > Number(y)) { return 1; }
        return 0;
    }
    let listPrestamosOrder = listapres?.sort(SortArray)
    let prestamoFilterOrder = prestamoFilter?.sort(SortArray)


    return (
        <div class='container34'>

            <datalist id='prestamo-numero-especimen'>
                {
                    listapres?.map(eleme => { return <option>{eleme.numeroespecimen}</option> })
                    //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

                }

            </datalist>
            <datalist id='numeroespecimen'>
                {
                    espec?.map(eleme => { return <option>{eleme.especimennumero}</option> })
                    //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

                }

            </datalist>
            <Menu activo={4} />
            <div className="contenido34">
                <div className="cabecera">
                    <div className="apre">
                        {t("PRELIS")}
                    </div>
                </div>
                <div class='cont'>
                    <div class='crear-prest'>
                        <div className="cab-pres">
                            <h4 className="hhh">{t("INPRE")}</h4>
                        </div>

                        <form type='submit' onSubmit={(e) => { submitPrestamo(e) }} class='formulario-prestamo'>
                            <div class='form-prest'>
                                <div class='conte-div'>
                                    <label>{t("TYPE")}:</label>
                                    <select className="sdsd" onChange={(e) => prestamoORconsulta(e)} required>
                                        <option >seleccionar</option>
                                        <option value='Préstamo' selected>Préstamo</option>
                                        <option value='Consulta'>consulta</option>
                                    </select>
                                </div>
                                <div className="conte-div">
                                    <label>{t("INVES")}:</label>
                                    <input type='text' required name='investigador' id='investigador' className="sdsd" onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("MAIL")}:</label>
                                    <input className="sdsd" type='text' name='correo' id='correo' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("CONT")}:</label>
                                    <input className="sdsd" type='text' name='contacto' id='contacto' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("INSTI")}:</label>
                                    <input className="sdsd2" type='text' name='institucion' id='institucion' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div2">
                                    <label>{t("ESPECNRO")}:</label>
                                    <select onChange={(e) => { filtrarEspecimen(e) }} required>
                                        <option value=''>{t("SEL")}</option>
                                        {
                                            numerosSort?.map(eleme => { return <option value={eleme}>{subespecimen(eleme)}</option> })
                                        }
                                    </select>
                                    <div class='gen-selected'>
                                        {
                                            espeSelect ? <p style={style}>{espeSelect[0]?.genero + " " + espeSelect[0]?.especie}</p> : null
                                        }
                                    </div>
                                    {/* <input  className="sdsd" type='text' list='numeroespecimen' id='especimennumero'name='numeroespecimen' required onChange={(e)=> {filtrarEspecimen(e)}}/> */}
                                </div>
                                <div class='numeros-de-especimen'>
                                    {
                                        numerosEspe ? numerosEspe?.map(el => { return <div onClick={(e) => eliminarNumero(el, e)} class='caca-prestamos'><span tooltip="click para eliminar" >{subespecimen(el)}</span></div> }) : null
                                    }
                                </div>





                                <div className="conte-div">
                                    <label >{t("EST")}</label>
                                    <input className="sdsd" type='date' required name='fechadevolucionest' id='fechadevolucionest' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <p>{t("COMENT")}</p>
                                <textarea type='text' class='text-pres' placeholder='detalle de entrega/cantidad de fragmentos' name='comentarios' onChange={(e) => { changeInput(e) }} />
                                <button type="submit" class='boton-prest'>{t("+PRES")}</button>
                            </div>
                        </form>
                    </div>
                    <div class='lista-prest'>
                        <div class='buscar-prestamo'>

                            <h4 className="hhh">{t("BUS")}:</h4>
                            <input type="text" id='num-prestamo' placeholder={t("INGRE")} onChange={(e) => { filtrarPrestamo(e) }} class='buscar-prestamo-input' list='prestamo-numero-especimen'></input>

                        </div>


                        <div id="main-container234">
                            {
                                !listapres ? <div class='spiner'><div class="spinner-border text-success" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                </div> :

                                    <table class="rwd_auto fontsize2" className="papa1">
                                        <thead className="tabli-headP">
                                            <tr className="trHead">
                                                <th width='17%'>{t("FEPRE")}</th>
                                                <th width='13%'>{t("TYPE")}</th>
                                                <th width='17%'>{t("ESPECNRO")}</th>

                                                <th width='19%'>{t("INVES")}</th>
                                                <th width='15%'>{t("FEDEV")}</th>
                                                <th width='8%'>{t("DEVO")} </th>
                                                <th width='5%'>PDF</th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {

                                                prestamoFilterOrder?.length > 0 ? prestamoFilterOrder?.map((elemento) => {

                                                    if (elemento.fechadevolucionest < fecha && elemento.devuelto === false) {
                                                        back = 'tr2Rojo'

                                                    } else {
                                                        back = 'tr2'
                                                    }
                                                    var cont = 0;
                                                    return (
                                                        <div className="papa">
                                                               <div className="trHijo" >
                                                             <tr key={elemento?.id} onClick={(e) => detallePrestamo(e, elemento)} class={back} >
                                                            <td  width='17%'>{formato(elemento?.fechaprestamo)}</td>
                                                            <td  width='15%'>{elemento.tipoprestamo}</td>
                                                            <td  width='17%'>{elemento?.numeroespecimen.map(el => {
                                                                 cont++;
                                                                 if (cont < elemento?.numeroespecimen.length) {
                                                                     return (subespecimen(el) + " / ")
                                                                 } else {
                                                                     return (subespecimen(el))
                                                                 }
                                                                })}
                                                                </td>
                                                            <td  width='19%'>{elemento?.investigador}</td>
                                                            <td  width='15%'>{formato(elemento?.fechadevolucionest)}</td>
                                                            {
                                                                elemento?.fechadevolucion ? <td width='11%'>{formato(elemento?.fechadevolucion)}</td> : <td  width='10%'>Pendiente</td>
                                                            }
                                                            
                                                        </tr>
                                                        </div>
                                                        <div className="printer" >
                                                            <span tooltip={t("PRINT")}><BiPrinter fontSize='20px' onClick={(e)=>imprimirPDF(elemento?.id)} /></span>
                                                            </div>
                                                        </div>
                                                        

                                                    );
                                                }) : listPrestamosOrder?.map((elemento) => {
                                                    if (elemento?.fechadevolucionest < fecha && elemento?.devuelto === false) {


                                                        back = 'tr2Rojo'

                                                    } else {

                                                        back = 'tr2'
                                                    }
                                                    var cont = 0;
                                                    return (

                                                        <div className="papa">
                                                            <div className="trHijo" >
                                                                <tr key={elemento?.id} onClick={(e) => detallePrestamo(e, elemento)} class={back} >
                                                                    <td width='17%'>{formato(elemento?.fechaprestamo)}</td>
                                                                    <td  width='13%'>{elemento.tipoprestamo}</td>
                                                                    <td  width='17%'>{elemento?.numeroespecimen.map(el => {
                                                                        cont++;
                                                                        if (cont < elemento?.numeroespecimen.length) {
                                                                            return (subespecimen(el) + " / ")
                                                                        } else {
                                                                            return (subespecimen(el))
                                                                        }
                                                                    })}</td>

                                                                    <td  width='18%'>{elemento?.investigador}</td>
                                                                    <td  width='15%'>{formato(elemento?.fechadevolucionest)}</td>

                                                                    {
                                                                        elemento?.fechadevolucion ? <td  width='10%'>{formato(elemento?.fechadevolucion)}</td> : <td width='8%'>Pendiente</td>
                                                                    }


                                                                </tr>
                                                            </div>
                                                            <div className="printer" >
                                                            <span tooltip={t("PRINT")} ><BiPrinter fontSize='20px' onClick={(e)=>imprimirPDF(elemento?.id)} /></span>
                                                            </div>

                                                        </div>


                                                    );
                                                })


                                            }
                                        </tbody>
                                    </table>



                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}