import { jsPDF } from "jspdf";
import { subespecimen, fechaActual } from "../store/action";
import logoMuseo from '../componentes/img/logomuseogrande.png';





const printFicha= async (el,tipo) => {
    console.log('imprimienso catalofo',el)
    var x = 50;
    const doc = new jsPDF();
    doc.addImage(logoMuseo, 10, 10, 60, 25)
    doc.setFontSize(12)
    doc.text("INSTITUTO Y MUESO DE CIENCIAS NATURALES", 65, 12);
    doc.setFontSize(10)
    doc.text("CATÁLOGO DE PALEOVERTEBRADOS", 83, 17);
    doc.setFontSize(10)
    doc.text('Fecha', 169, 18);
    doc.setFont('verdana', 'bold');
    doc.text(fechaActual(), 168, 23);
    doc.rect(70, 23, 90, 10); // empty square
    doc.setFontSize(11)
    doc.setFont('impact', 'bold');
    tipo==="e"?doc.text('FICHA ESPECIMEN: PVSJ'+subespecimen(el.especimennumero), 90, 30):doc.text('FICHA BOCHÓN: PVBSJ '+el.bochonnumero , 90, 30);
    doc.line(10, 42, 185, 42); // horizontal line
    doc.setFontSize(8)
    doc.setFont(undefined, 'bold');
 
    doc.setFont(undefined, 'italic');
        doc.text(el.genero + '  ' + el.especie, 10, x)
        doc.setFont(undefined, 'regular');
        doc.text('Campaña: ' + el.campana, 69, x)
        doc.setFont(undefined, 'regular')
        doc.text('Nro campo:' + el.nrocampo, 125, x)
        doc.text('Partes esqueletales: ' + el.partesesqueletales, 10, x + 4)
        doc.text('Posición Filogenética: ' + el.posicionfilo, 10, x + 8)
        doc.text('Cuenca: ' + el.cuenca, 10, x + 12)
        doc.text('Formación: ' + el.formacion, 50, x + 12)
        doc.text('miembro: ' + el.miembro, 90, x + 12)
        doc.text('Localidad: ' + el.localidad, 130, x + 12)
        doc.text('Fragmentos: ' + el.cantidadfrag, 170, x + 12)
        doc.text('Coord: ' + el.coordlat + ' / ' + el.coordlong, 10, x + 16);
        doc.text('Periodo: ' + el.periodo, 70, x + 16);
        doc.text('Época: ' + el.epoca, 110, x + 16);
        doc.text('Piso: ' + el.piso, 150, x + 16);
        doc.text('Descubridor: ' + el.descubridor, 10, x + 20);
        doc.text('Fecha Desc.: ' + el.fechadescubrimiento, 60, x + 20);
        doc.text('Armario: ' + el.armario1 + ' desde estante ' + el.estante1desde + ' hasta ' + el.estante1hasta, 96, x + 20);
        doc.text('y armario: ' + el.armario2 + ' desde estante ' + el.estante2desde + ' hasta ' + el.estante2hasta, 138, x + 20);
        doc.text('Comentario: ' + el.comentario, 10, x + 24);
        doc.line(10, x + 30, 185, x + 30);
     
    
    doc.setFont(undefined, 'regular');
    tipo==="e"? doc.save(`${fechaActual()} Ficha_especimen.pdf`): doc.save(`${fechaActual()} Catalogo de Bochones.pdf`);
   
  }


  export default printFicha
  