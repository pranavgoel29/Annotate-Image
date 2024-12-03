import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Annotate from "./pages/Annotate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/annotate" element={<Annotate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
