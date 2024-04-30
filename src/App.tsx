import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import Create from "./pages/CreateDeck";
import DeckDetail from "./pages/DeckDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EditDeck from "./pages/EditDeck";
import Navbbar from "./assets/components/navbar";




function App() {
  const [token, setToken] = useState<any>({})
  useEffect(() => {
    if (['/login', '/signup'].includes(window.location.pathname)) return
    const token = JSON.parse(localStorage.getItem('token')|| "null")
    if (!token) {
      window.location.href = '/login'
    }
    setToken(token)
  
  },[])
  return (
    <BrowserRouter>
      <Navbbar token={token} setToken={setToken}/>
      <Routes>
        <Route path="/" element={<Homepage token={token}/>} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<DeckDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:id/edit" element={<EditDeck />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;