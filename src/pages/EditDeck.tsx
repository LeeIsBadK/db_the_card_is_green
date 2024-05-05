import supabase from "../server/App";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/components/navbar";
import { useState } from "react";

function EditDeck() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')
    const [description, setDescription] = useState('')
    const [currentDescription, setCurrentDescription] = useState('')
    const [isEdit, setIsEdit] = useState(false)

    const [cards, setCards] = useState<object[]>([])
    const [formError, setError] = useState<string | null>(null)
    const [isLoad, setIsLoad] = useState(false)

    const [searchName, setSearchName] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [SearchError, setSearchError] = useState<string | null>(null)

    const handleEditDeckDetail = async (e: any) => {
        e.preventDefault()
        setError('')
        console.log(currentTitle)

        if (!currentTitle || !currentDescription) {
            setError('Please fill out all fields')
            return
        }

        const { error } = await supabase
            .from('Decks')
            .update({ name: currentTitle, description: currentDescription })
            .eq('id', id)

        if (error) {
            console.error(error)
            setError('Could not update deck')
            return
        }
        else {
            alert('Deck updated successfully')
            window.location.href = `/${id}`;
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

    // Delete card
    const handleDeleteCard = async (card_id: any) => {
        setIsLoad(true)
        const { error } = await supabase
            .from('Cards')
            .delete()
            .eq('deck_id', card_id)

        if (error) {
            console.log(error)
            setError('Could not delete card')
            setIsLoad(false)
            return
        }
        else {

        }
    }

    // Add card
    const handleAddCard = async (card: any) => {
        console.log(card)
        setIsLoad(true)
        // const { error } = await supabase
        //     .from('Cards')
        //     .insert([{ deck_id: id }])

        // if (error) {
        //     console.log(error)
        //     setError('Could not add card')
        //     setIsLoad(false)
        //     return
        // }
        // else {
        //     setIsLoad(false)
        // }
        setIsLoad(false)
    }

    const handleSearchCard = async (e: any) => {
        e.preventDefault()
        setSearchResult(null) // Change the initial state from null to an empty array
        setSearchError(null)
        console.log(searchName)
        const req = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&num=10&offset=0&fname=${searchName}`)
        const res = await req.json()
        if (res.error) {
            setSearchError('No card found')
            return
        }
        setSearchResult(res.data)
        console.log(res.data)
    }

    useEffect(() => {
        console.log(id)
        const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null")
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
                setTitle(data.name)
                setCurrentTitle(data.name)
                setDescription(data.description)
                setCurrentDescription(data.description)
            }
            const { data: cards, error: cardError } = await supabase
                .from('Cards')
                .select()
                .eq('deck_id', id)
                .order('name', { ascending: true })

            if (cardError) {
                console.log(cardError)
                return
            }
            if (cards) {
                console.log(cards)
                setCards(cards)
            }
        }

        fetchDeck()
    }, [id, navigate, isLoad])
    return (
        <>
            <Navbar />
            {/* {Conetent} */}
            <div className="w-[100%] px-[4%] lg:px-[10%] pt-8 sm:pt-6">
                {/* {Breadcrum} */}
                <nav aria-label="Breadcrumb" className="pb-6">
                    <ol className="flex items-center gap-1 text-sm text-gray-600">
                        <li>
                            <a href="/" className="block transition hover:text-gray-700">
                                <span className="sr-only"> Home </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </a>
                        </li>

                        <li className="rtl:rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </li>

                        <li>
                            <div className="block transition hover:text-gray-700 cursor-pointer" onClick={_e => navigate(`/${id}`)}> {title} </div>
                        </li>

                        <li className="rtl:rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </li>

                        <li>
                            <p className="block transition hover:text-gray-700"> Edit </p>
                        </li>
                    </ol>
                </nav>

                {/* {Detail} */}
                <div className="flow-root lg:w-[80%] " id="detail">
                    <label htmlFor="detail" className="block text-medium font-medium text-gray-900 pb-3"> Detail deck ID:{id}</label>
                    <dl className="-my-3 divide-y divide-gray-100 text-sm">
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 ah-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Title</dt>
                            <dd className="text-gray-700 sm:col-span-4">{title}</dd>
                            {isEdit && <div className="grid grid-rows"> New description: <input type="text" className="border rounded-md" defaultValue={title} onChange={(e) => setCurrentTitle(e.target.value)} /> </div>}
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Description</dt>
                            <dd className="text-gray-700 sm:col-span-4">
                                {description}
                            </dd>
                            {isEdit && <div className="grid grid-rows"> New description:
                                <input type="text" className="border  h-full rounded-md" defaultValue={description} onChange={(e) => setCurrentDescription(e.target.value)} />
                            </div>}

                        </div>
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Number of cards</dt>
                            <dd className="text-gray-700 sm:col-span-4">{cards.length}</dd>
                        </div>
                        <div className="grid grid-cols-3 py-3 sm:grid-cols-6 sm:gap-2">
                            <button className=" shadow-sm cursor-pointer transition-all duration-500 hover:translate-y-0.5 delay-50 border-2 border-gray-300 hover:bg-gray-300 hover:text-white w-16 rounded col-span-1 px-2" type="submit" onClick={() => setIsEdit(!isEdit)}>Edit</button>
                            {isEdit && <button className=" shadow-sm cursor-pointer transition-all duration-500 hover:translate-y-0.5 delay-50 border-2 border-yellow-300 hover:bg-yellow-300 hover:text-white w-16 rounded col-span-1 px-2" type="submit" onClick={handleEditDeckDetail}>Update</button>}
                            {isEdit && <button className=" shadow-sm cursor-pointer transition-all duration-500 hover:translate-y-0.5 delay-50 border-2 border-red-300 hover:bg-red-600 hover:border-red-600 hover:text-white w-16 rounded col-span-1 px-2" type="submit" onClick={handleDelete}>Delete</button>}
                        </div>
                        {formError && <p>{formError}</p>}
                    </dl>
                </div>


                <div className="my-1 sm:my-8 grid grid-cols-1 py-3 sm:grid-cols-5 sm:gap-2">
                    <div className="py-2 col-span-3">
                        <p className="font-semibold">{title}'s card</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Card Name</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Frametype</th>
                                        <th className="px-4 py-2"></th>
                                    </tr>
                                </thead>
                                {/* {Map card here} */}
                                <tbody className="divide-y divide-gray-200" key={"text"}>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Exodia</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Normal Monster</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Normal</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">$120,000</td>
                                        <td className="whitespace-nowrap px-4 py-2">
                                            <button
                                                className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                                onClick={() => handleDeleteCard("text")}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="py-2 col-span-2 w-full rounded round-large bg-gray-200 px-[2%] gap-2">
                        <h1 className="font-semibold">Search & Add card</h1>
                        <div className="relative py-3">
                            {/* {Searchbox} */}
                            <label htmlFor="Search" className="sr-only"> Search </label>

                            <input
                                type="text"
                                id="Search"
                                placeholder="Search for..."
                                className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
                                onChange={(e) => setSearchName(e.target.value)}
                            />

                            <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
                                <button type="button" className="text-gray-600 hover:text-gray-700" onClick={(e) => handleSearchCard(e)}>
                                    <span className="sr-only">Search</span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </div>
                        {/* {Search Card list} */}
                        {SearchError ? <p>{SearchError}</p> : null}
                        <div className="grid grid-cols-2 xl:grid-cols-3 px-3 gap-2">
                            {searchResult && Array.isArray(searchResult) && (searchResult as any[]).map((card: any) => (
                                <div key={card.id} className="my-1 w-full p-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-400 dark:hover:bg-gray-400" >
                                    <div className="w-full flex justify-center">
                                        <img src={card.card_images[0].image_url} alt={card.name} className="content-center" />
                                    </div>
                                    <div className="grid grid-rows-1 align-center row-end-auto">
                                        <p className="text-white text-sm pt-1 row-span-1 truncate">{card.name}</p>
                                        <div className="text-white text-xs pt-1 h-full row-span-1 size-fit justify-center" >{card.type}</div>
                                        <button className="transition delay-50  h-10 w-full row-span-1 border-2 border-gray-300 bg-gray-200 hover:bg-green-600 hover:border-green-600 hover:text-white rounded col-span-1 px-2" type="submit" onClick={_e => handleAddCard(card)}>Add</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditDeck;