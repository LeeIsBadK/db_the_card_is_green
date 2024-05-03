import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./pages/Homepage";
import Create from "./pages/CreateDeck";
import DeckDetail from "./pages/DeckDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EditDeck from "./pages/EditDeck";




function App() {
  useEffect(() => {
    if (['/login', '/signup'].includes(window.location.pathname)) return
    const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token')|| "null")
    if (!auth) {
      window.location.href = '/login'
      return
    }
   
  
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<DeckDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/:id/edit" element={<EditDeck />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;