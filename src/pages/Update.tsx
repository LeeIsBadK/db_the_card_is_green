import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../server/App";

function Update() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [formError, setError] = useState<string|null>(null)

    useEffect(() => {
        const fetchGacha = async () => {
            const { data, error } = await supabase
            .from('decks')
            .select()
            .eq('id', id)
            .single()

            if (error) {
                navigate('/', {replace: true})
            }
            if (data) {
                setTitle(data.title)
                setDescription(data.description)
                setAmount(data.amount)
            }
        }

        fetchGacha()


    }, [id, navigate])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')

        if (!title || !description || !amount) {
            setError('Please fill out all fields')
            return
        }
        if (amount < 0) {
            setError('Amount cannot be negative')
            return
        }

        const { data, error } = await supabase
        .from('Gacha')
        .update({title, description, amount})
        .eq('id', id)

        if (error) {
            console.log(error)
            setError('Could not update Gacha')
            return
        }
        else{
            console.log(data)
            alert('Gacha updated successfully')
            navigate('/', {replace: true})
        }
    }

    const handleDelete = async () => {
        const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', id)

        if (error) {
            console.log(error)
            setError('Could not delete Gacha')
            return
        }
        else{
            alert('Gacha deleted successfully')
            navigate('/home', {replace: true})
        }
    }

    return(
        <>
            <p>ID-{id}</p>
            <div className="form">
            <form className="grid p-5 gap-2" onSubmit={handleSubmit}>
                <label className="grid-cols-2 gap-2">
                    Title:
                    <input type="text" className="border" defaultValue={title}/>
                </label>
                <label>
                    Description:
                    <input type="text" className="border" defaultValue={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                    <button  className="border border-black"type="submit">Update</button>
            </form>
        </div>
        <button onClick={handleDelete} className="border border-black">Delete</button>
        {formError && <p>{formError}</p>}
        {/* {info && <p>{info}</p>} */}
        </>
    )
}
export default Update;