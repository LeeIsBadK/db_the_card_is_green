import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


import Home from "./pages/home";
import Create from "./pages/Create";
import Update from "./pages/Update";

function App() {
  return (
    <BrowserRouter>
      <nav className="Box w-full h-20 bg-emerald-600">
        <ul className="flex justify-center items-center h-full">
          <li className="mx-4 ">
            <Link to="/" className="text-white">
              Home
            </Link>
          </li>
          <li className="mx-4">
            <Link to="/create" className="text-white">
              Create
            </Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;