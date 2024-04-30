import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../server/App";

function DeckEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [formError, setError] = useState<string | null>(null)
    const [searchName, setSearchName] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [SearchError, setSearchError] = useState<string | null>(null)
    const [cards, setCards] = useState<any[]>([])

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token')|| "")
        const jsonToken = token ? token : null
        console.log(jsonToken)

        const fetchDeck = async () => {
            const { data, error } = await supabase
                .from('Decks')
                .select()
                .eq('id', id)
                .single()

            if (error) {
                alert('Could not fetch deck')
                console.log(error)
                navigate('/', { replace: false })
            }
            if (data) {
                if (data.user_id !== jsonToken.user.id) {
                    navigate('/', { replace: true })
                    return
                }
                setTitle(data.name)
                setDescription(data.description)
            }
        }

        const fetchCards = async () => {
            const { data, error } = await supabase
                .from('Cards')
                .select()
                .eq('deck_id', id)

            if (error) {
                console.log(error)
                setError('Could not fetch cards')
                return
            }
            if (data) {
                console.log("Card",data)
                setCards(data)
            }
        }

        fetchDeck()
        fetchCards()


    }, [id, navigate])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')

        if (!title || !description) {
            setError('Please fill out all fields')
            return
        }

        const { error } = await supabase
            .from('Decks')
            .update({ name: title, description: description })
            .eq('id', id)

        if (error) {
            console.error(error)
            setError('Could not update deck')
            return
        }
        else {
            alert('Deck updated successfully')
            navigate('/', { replace: true })
        }
    }

    const handleDelete = async () => {
        const { error } = await supabase
            .from('Decks')
            .delete()
            .eq('id', id)

        if (error) {
            console.log(error)
            setError('Could not delete deck')
            return
        }
        else {
            alert('deck deleted successfully')
            navigate('/home', { replace: true })
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault()
        setSearchResult([])
        setSearchError(null)
        console.log(searchName)
        const req = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${searchName}`)
        const res = await req.json()
        if (res.error){
            setSearchError('No card found')
            return
        }
        setSearchResult(res.data)
    }


    return (
        <>
            <p>ID-{id}</p>
            <div className="bg-slate-400 flex w-fit rounded-md mx-10">
                <form className="grid p-5 gap-2" onSubmit={handleSubmit}>
                    <label className="grid-cols-2 gap-2">
                        Title:
                        <input type="text" className="border" defaultValue={title}  onChange={(e) => setTitle(e.target.value)}/>
                    </label>
                    <label>
                        Description:
                        <input type="text" className="border" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <div className="w-full grid-cols-8">
                        <button className="border border-black col-span-6" type="submit">Update</button>
                        <button onClick={handleDelete} className="border border-black col-span-2">Delete</button>
                    </div>
                    
                </form>
            </div>
            {formError && <p>{formError}</p>}
            <div>
                My Deck:
            </div>

            <div>
                <Link to={`./edit`}> Edit deck </Link>
            </div>
            <div>
                    <p> Number of cards: {cards.length} </p>
                </div>
            <div>
                <form className="grid p-5 gap-2">
                <label className="grid-cols-2 gap-2">
                        Name:
                        <input type="text" className="border" onChange={(e) => setSearchName(e.target.value)}/>
                    </label>
                    <button className="border border-black" type="submit" onClick={handleSearch}>Search</button>
                </form>
                <div className="grid grid-cols-8 px-10 gap-2">
                    {searchResult && Array.isArray(searchResult) && searchResult.map((card: any) => (
                        <div key={card.id} className="my-3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-400 dark:hover:bg-gray-400" >
                            <div className="w-full flex justify-center">
                                <img src={card.card_images[0].image_url} alt={card.name} className="h-40 content-center" />
                            </div>
                            <p className="text-white pt-1 object-fill">{card.name}</p>
                            {/*<p className="text-white" >Card type:{card.type}</p>
                            {/*<p className="text-white text-[0.5rem]" >Description: {card.desc}</p> */
                            }
                        </div>
                    ))}
                    {SearchError && <p>{SearchError}</p>}
                </div>
            </div>
        </>
    )
}
export default DeckEdit;