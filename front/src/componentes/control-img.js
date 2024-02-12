import Resizer from "react-image-file-resizer";
import axios from "axios";
import {url} from '../URL.js'

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1200,
      1200,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
export async function subirImg (file){

    const image = await resizeFile(file);
    const data = new FormData();
    data.append('archivo', image);
    
   let resultado = await axios.post(`${url}subir-archivo-img`, data)
   
   
    return resultado.data
}

/* 
const handleImg = async (e) => {
    e.preventDefault()
  
    var file = e.target.files[0];
    let result =  await subirImg(file)
    let image = result.path
            setImagenes([...imagenes,image])
            setCrear({
                ...crear,
                imagen: [...imagenes, image]
            })
            if (file) {
                
                setImagenSelected(image);
            }       
        }

          <span tooltip={t("CLICK")}  className="butono">
                                                        {
                                                            el.length < 40 ? 
                                                            <img src={`${url}getImg/` + el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                            :
                                                            <img src={el} height="60px" width="80px" alt="image" onClick={(e)=> eliminarImagen(el, e)}></img>
                                                        }
                                                        </span>
    
*/