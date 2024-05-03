import { useState } from "react"
import supabase from "../server/App"
import { useNavigate } from "react-router-dom"
import Navbar from "../assets/components/navbar"


function Create () {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string|null>(null)
    const [info, setInfo] = useState("")
    const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token')|| "null")
    const user_id = auth.user.id


    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setInfo("")
        setError("")
        
        if (!name || !description) {
            setError("Please fill out all fields")
            return
        }
        const { error } = await supabase
            .from('Decks')
            .insert([{user_id,name, description}])
        
        if (error) {
            console.log(error)
            setError("Please fill out all fields")
        }
        else{
            setError(null)
            navigate('/')
            alert("Deck updated successfully")
        }
    }

    

  return (
    <>  
        <Navbar />
        <div className="form">
            <form className="grid p-5 gap-2" onSubmit={handleSubmit}>
                <label className="grid-cols-2 gap-2">
                    Title:
                    <input type="text" className="border" value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <label>
                    Description:
                    <input type="text" className="border" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <button  className="border border-black"type="submit">Create</button>
            </form>
        </div>
        {formError && <p>{formError}</p>}
        {info && <p>{info}</p>}
    </>
  );
}
export default Create;