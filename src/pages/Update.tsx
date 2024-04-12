import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../server/App";

function Update() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string|null>(null)

    useEffect(() => {
        const fetchGacha = async () => {
            const { data, error } = await supabase
            .from('decks')
            .select()
            .eq('id', id)
            .single()

            if (error) {
                alert('Could not fetch Gacha')
                navigate('/', {replace: true})
            }
            if (data) {
                setTitle(data.name)
                setDescription(data.description)
            }
        }

        fetchGacha()


    }, [id, navigate])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')

        if (!title || !description) {
            setError('Please fill out all fields')
            return
        }

        const { data, error } = await supabase
        .from('decks')
        .update({name:title, description:description})
        .eq('id', id)

        if (error) {
            console.log(error)
            setError('Could not update deck')
            return
        }
        else{
            console.log(data)
            alert('Deck updated successfully')
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
            setError('Could not delete deck')
            return
        }
        else{
            alert('deck deleted successfully')
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