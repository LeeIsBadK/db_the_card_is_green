import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./pages/Homepage";
import Create from "./pages/CreateDeck";
import DeckDetail from "./pages/DeckDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EditDeck from "./pages/EditDeck";
import Navbbar from "./assets/components/navbar";




function App() {
  useEffect(() => {
    if (window.location.pathname in ['/login', '/signup']) return 
    const token = JSON.parse(localStorage.getItem('token')|| '')
    if (!token) {
      window.location.href = '/login'
    }
  
  },[])
  return (
    <BrowserRouter>
    {Navbbar()}
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<DeckDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:id/edit" element={<EditDeck />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;