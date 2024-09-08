// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Simulation } from "./pages/Simulation";
import { Game } from "./pages/Game";
import { Dice } from "./pages/Dice";
import { Footer, Navbar } from "./components";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/game" element={<Game />} />
        <Route path="dice" element={<Dice />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
