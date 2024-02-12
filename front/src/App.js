import "./App.css";
import Detalle from "./componentes/DETALLE/detalle.jsx";
import { Routes, Route } from "react-router-dom";
import Menu from "./componentes/NAVBAR/menu.jsx";
import dino from "./componentes/img/dinoGif.gif";
import Buscar from "./componentes/BUSCAR/buscar";
import ActualizarEspecimen from "./componentes/MODIFICACIONES/actualizarEspecimen";
import CrearEspecimen from "./componentes/CREAR/crearEspecimen.jsx";
import LandingPageTablinum from "./componentes/LANDING/landingPage";
import { Setting } from "./componentes/USER/setting";
import { Prestamos } from "./componentes/PRESTAMOS/prestamos";
import { Plantillaqr } from "./componentes/QR/plantillaqr";
import { DetalleMobil } from "./componentes/MOBIL/detalleMobil";
import { useAuth0 } from "@auth0/auth0-react";
import { crearUsuario, usuarioup } from "./store/action";
import { useDispatch } from "react-redux";
import BuscarBochon from "./componentes/BUSCAR/buscarbochon";
import DetalleBochon from "./componentes/DETALLE/detalleBochon";
import ActualizarBochon from "./componentes/MODIFICACIONES/modificarBochon";
import { PlanillaPrestamo } from "./componentes/PRESTAMOS/planillaPrestamo";

function App() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const dispatch = useDispatch();

  if (isLoading) {
    return (
      <div class="spiner">
        <img src={dino} width="250px"></img>
      </div>
    );
  }
  if (isAuthenticated) {
    dispatch(
      crearUsuario({
        id: user.sub,
        correo: user.email,
        imagen: user.picture,
        nombre: user.name,
      })
    );
  }
  return (
    <div class="App">
      {isAuthenticated ? (
        <Routes>
          <Route exact path="/" element={<LandingPageTablinum />} />
          <Route exact path="/menu" element={<Menu />} />
          <Route exact path="/home/:id" element={<Detalle />} />
          <Route exact path="/home/bochon/:id" element={<DetalleBochon />} />
          <Route exact path="/home" element={<Buscar />} />
          <Route exact path="/home/bochon" element={<BuscarBochon />} />
          <Route
            exact
            path="/modificar/:id"
            element={<ActualizarEspecimen />}
          />
          <Route
            exact
            path="/modificar/bochon/:id"
            element={<ActualizarBochon />}
          />
          <Route exact path="/home/crear/:que" element={<CrearEspecimen />} />
          <Route exact path="/home/setting/:id" element={<Setting />} />
          <Route exact path="/home/prestamos" element={<Prestamos />} />
          <Route exact path="/home/plantillaqr/:qr" element={<Plantillaqr />} />
          <Route
            exact
            path="/home/prestamo/plantilla/:emisor/:fecha/:tipo/:receptor/:contacto/:nro/:insti/:comen/:fechade"
            element={<PlanillaPrestamo />}
          />
          <Route path="/home/qr/:UUID/:id" element={<DetalleMobil />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/" element={<LandingPageTablinum />} />
          <Route path="/home/qr/:UUID/:id" element={<DetalleMobil />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
