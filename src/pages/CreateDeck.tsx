import { useEffect, useState } from "react"
import supabase from "../server/App"
import { useNavigate } from "react-router-dom"


function Create () {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string|null>(null)
    const [info, setInfo] = useState("")
    const token = sessionStorage.getItem('token')
    const usertoken = JSON.parse(token || '{}')
    const user_id = usertoken.user.id


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
            navigate('/home')
            alert("Deck updated successfully")
        }
        
    }

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true })
            return
        }
    }, [token, navigate])
    

  return (
    <>
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