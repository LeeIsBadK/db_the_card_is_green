import { useState } from "react"
import supabase from "../server/App"

function Create () {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [formError, setError] = useState<string|null>(null)
    const [info, setInfo] = useState("")

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setInfo("")
        setError("")
        if (!title || !description || !amount ) {
            setError("Please fill out all fields")
            return
        }
        if (amount < 0) {
            setError("Amount cannot be negative")
            return
        }
        const { data, error } = await supabase
            .from('Gacha').insert([{title, description, amount}])
        
        if (error) {
            console.log(error)
            setError("Please fill out all fields")
        }
        else{
            if (data) {
                setError(null)
            }
            setInfo("Gacha created")
        }
        

    }
    

  return (
    <>
        <div className="form">
            <form className="grid p-5 gap-2" onSubmit={handleSubmit}>
                <label className="grid-cols-2 gap-2">
                    Title:
                    <input type="text" className="border" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </label>
                <label>
                    Description:
                    <input type="text" className="border" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <label>
                    Amount:
                    <input type="number" className="border" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}/>
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