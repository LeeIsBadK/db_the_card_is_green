import supabase from "../server/App";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditDeck() {
    const { id } = useParams()
    const navigate = useNavigate()

    // const [title, setTitle] = useState('')
    // const [description, setDescription] = useState('')
    // const [formError, setError] = useState<string | null>(null)
    // const [searchName, setSearchName] = useState('')
    // const [searchResult, setSearchResult] = useState(null)
    // const [SearchError, setSearchError] = useState<string | null>(null)

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/login', { replace: true })
        }
        if (!id) {
            navigate('/', { replace: true })
            return
        }
        const fetchDeck = async () => {
            const { data, error } = await supabase
                .from('Cards')
                .select()
                .eq('id', id)

            if (error) {
                alert('Could not fetch card')
                navigate('/', { replace: true })
            }
            if (data){

            }
        }

        fetchDeck()
    })
    return (
        <>
        </>
    )
}

export default EditDeck;