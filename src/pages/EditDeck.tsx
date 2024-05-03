import supabase from "../server/App";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/components/navbar";

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
        console.log(id)
        const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token')|| "null")
        const user_id = auth.user.id
        const fetchDeck = async () => {
            const { data, error } = await supabase
                .from('Decks')
                .select()
                .eq('id', id)
                .single()

            if (error) {
                console.log(error)
                navigate('/', { replace: false })
            }
            if (data) {
                console.log(data)
                if (data.user_id !== user_id) {
                    navigate('/', { replace: true })
                    return
                }
                // setTitle(data.name)
                // setDescription(data.description)
            }
            const { data: cards, error: cardError } = await supabase
                .from('Cards')
                .select()
                .eq('deck_id', id)
            if (cardError) {
                console.log(cardError)
                return
            }
            if (cards) {
                console.log(cards)
            }
        }

        fetchDeck()
    })
    return (
        <>
            <Navbar />
        </>
    )
}

export default EditDeck;