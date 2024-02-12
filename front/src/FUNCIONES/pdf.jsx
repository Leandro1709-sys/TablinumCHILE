import axios from "axios"
import { url } from '../URL'
import { jsPDF } from "jspdf";
import { subespecimen, fechaActual } from "../store/action";
import logoMuseo from '../componentes/img/logomuseogrande.png';





const printCatalogo = async (e,especimenFiltradoSort,tipo) => {
    var numeros = []
    let data
    
    if(tipo==="e"){
        if (e=='filtrado' ) {
            especimenFiltradoSort.map(el => numeros.push(el.especimennumero))
            var result = await axios.get(`${url}especimenRoute/infoPDF/?numero=${numeros}`)
            data = result.data
      
          } else if(e=='catalogo') {
            var result = await axios.get(`${url}especimenRoute/infoPDF`)
      
            data = result.data
          }
    } else if(tipo==="b"){
        if (e == 'filtrado') {
            especimenFiltradoSort.map(el => numeros.push(el.bochonnumero))
            var result = await axios.get(`${url}bochonRoute/bochon/infoPDF/?numero=${numeros}`)
            data = result.data
            console.log(data)
          } if (e == 'catalogo') {
            var result = await axios.get(`${url}bochonRoute/bochon/infoPDF`)
      
            data = result.data
      
          }
    }
    

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
    tipo==="e"?doc.text('LISTADO DE ESPECIMENES', 90, 30):doc.text('LISTADO DE BOCHONES', 90, 30);
    doc.line(10, 42, 185, 42); // horizontal line
    data?.map(el => {
      if (x < 280) {
        doc.setFontSize(8)
        doc.setFont(undefined, 'bold');
        tipo==="e"?doc.text('PVSJ ' + subespecimen(el.especimennumero), 10, x):doc.text('PVBSJ ' + el.bochonnumero, 10, x);
        doc.setFont(undefined, 'italic');
        doc.text(el.genero + '  ' + el.especie, 35, x)
        doc.setFont(undefined, 'regular');
        doc.text('Campaña: ' + el.campana, 89, x)
        doc.setFont(undefined, 'regular')
        doc.text('Nro campo:' + el.nrocampo, 165, x)
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
        x = x + 40;
      } else {
        x = 30;
        doc.addPage()
        doc.line(10, 22, 185, 22); // horizontal line
        doc.setFont(undefined, 'bold');
        tipo==="e"?doc.text('PVSJ ' + subespecimen(el.especimennumero), 10, x):doc.text('PVBSJ ' + el.bochonnumero, 10, x);
        doc.setFont(undefined, 'italic');
        doc.text(el.genero + '  ' + el.especie, 35, x)
        doc.setFont(undefined, 'regular');
        doc.text('Campaña: ' + el.campana, 89, x)
        doc.setFont(undefined, 'regular')
        doc.text('Nro campo:' + el.nrocampo, 165, x)
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
        x = x + 40;
      }
    })
    doc.setFont(undefined, 'regular');
    tipo==="e"? doc.save(`${fechaActual()} Catalogo de Especimenes.pdf`): doc.save(`${fechaActual()} Catalogo de Bochones.pdf`);
   
  }


  export default printCatalogo
  

/*
  const printCatalogo = async (e) => {
    var numeros = []
    let data

    if (e == 'filtrado') {
      bochonesFiltrados.map(el => numeros.push(el.bochonnumero))
      var result = await axios.get(`${url}bochonRoute/bochon/infoPDF/?numero=${numeros}`)
      data = result.data
      console.log(data)
    } if (e == 'catalogo') {
      var result = await axios.get(`${url}bochonRoute/bochon/infoPDF`)

      data = result.data

    }


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
    doc.text('LISTADO DE BOCHONES', 90, 30)


    doc.line(10, 42, 185, 42); // horizontal line


    data?.map(el => {

      if (x < 280) {
        doc.setFontSize(8)
        doc.setFont(undefined, 'bold');
        doc.text('PVBSJ ' + el.bochonnumero, 10, x);
        doc.setFont(undefined, 'italic');
        doc.text('Genero: ' + el.genero + ' Especie: ' + el.especie, 35, x)
        doc.setFont(undefined, 'regular');
        doc.text('Campaña: ' + el.campana, 89, x)
        doc.setFont(undefined, 'regular')
        doc.text('Nro campo:' + el.nrocampo, 165, x)
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



        x = x + 40;


      } else {
        x = 30;
        doc.addPage()

        doc.line(10, 22, 185, 22); // horizontal line
        doc.setFont(undefined, 'bold');
        doc.text('PVBSJ ' + el.bochonnumero, 10, x);
        doc.setFont(undefined, 'italic');
        doc.text('Genero: ' + el.genero + ' Especie: ' + el.especie, 35, x)
        doc.setFont(undefined, 'regular');
        doc.text('Campaña: ' + el.campana, 89, x)
        doc.setFont(undefined, 'regular')
        doc.text('Nro campo:' + el.nrocampo, 165, x)
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

        x = x + 40;
      }

    })

    doc.setFont(undefined, 'regular');

    doc.save(`${fechaActual()} Catalogo de Bochones.pdf`);

  }*/