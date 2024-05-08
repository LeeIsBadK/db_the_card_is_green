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

    const [cards, setCards] = useState<any[]>([])
    const [formError, setError] = useState<string | null>(null)
    const [isLoad, setIsLoad] = useState(false)

    const [cardsDetail, setCardsDetail] = useState<any[]>([])

    const [searchName, setSearchName] = useState('')
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [SearchError, setSearchError] = useState<string | null>(null)


    const handleEditDeckDetail = async (e: any) => {
        e.preventDefault()
        setError('')

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
            console.error(error)
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
            .from('DeckCards')
            .delete()
            .eq('id', card_id)

        if (error) {
            console.error(error)
            setError('Could not delete card')
            setIsLoad(false)
            return
        }
        setIsLoad(false)
    }

    // Add card
    const handleAddCard = async (card: any) => {
        setIsLoad(true)
        setSearchError(null)
        try {
            if (!card.api_card_id || card.api_card_id === "null") {
                console.error("Invalid card ID:", card.api_card_id);
                setSearchError("Invalid card ID");
                return;
            }
            const { data: existingCards, error: fetchError } = await supabase
                .from('DeckCards')
                .select('id')
                .eq('deck_id', id)
                .eq('api_card', card.api_card_id);

            if (fetchError) {
                console.error(fetchError);
                setSearchError('Error checking existing cards');
                return;
            }

            if (existingCards && existingCards.length >= 3) {
                setSearchError('You cannot add more than 3 instances of the same card to the deck');
                return;
            }

            const { error } = await supabase
                .from('DeckCards')
                .insert([{ deck_id: id, api_card: parseInt(card.api_card_id) }]); // Ensure `card.id` is parsed as a number

            if (error) {
                console.error(error);
                setError('Could not add card');
                return;
            }

            // Optionally, update local state or perform additional actions upon successful insertion
            console.log('Card added successfully');
            setIsLoad(false);
        } catch (error) {
            console.error('Error adding card:', error);
            setError('An error occurred while adding the card');
        }
    };


    const handleSearchCard = async (e: any) => {
        e.preventDefault()
        setSearchError(null)
        const res = await supabase
            .from('Cards')
            .select()
            .ilike('name', `%${searchName}%`)
            .limit(20)
        if (res.error) {
            console.error(res.error)
            setSearchError('Could not fetch cards')
            return
        }
        if (res.data.length === 0) {
            setSearchError('No result found')
            return
        }
        setSearchResult(res.data)
    }

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const auth = JSON.parse(localStorage.getItem('sb-ildgjnmfhjmzeimzaqfx-auth-token') || "null");
                const user_id = auth.user.id;

                const { data, error } = await supabase
                    .from('Decks')
                    .select()
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error(error);
                    navigate('/', { replace: false });
                    return;
                }

                if (data) {
                    if (data.user_id !== user_id) {
                        navigate('/', { replace: true });
                        return;
                    }

                    setTitle(data.name);
                    setCurrentTitle(data.name);
                    setDescription(data.description);
                    setCurrentDescription(data.description);

                    const { data: fetchedCards, error: cardError } = await supabase
                        .from('DeckCards')
                        .select()
                        .eq('deck_id', id);

                    if (cardError) {
                        console.error(cardError);
                        return;
                    }

                    if (fetchedCards) {
                        setCards(fetchedCards);
                        console.log(fetchedCards);
                        const cardDetailsPromises = fetchedCards.map(async (card) => {
                            const { data: cardData, error: cardFetchError } = await supabase
                                .from('Cards')
                                .select()
                                .eq('api_card_id', card.api_card)
                                .single();

                            if (cardFetchError) {
                                console.error(cardFetchError);
                                throw new Error('Could not fetch cards');
                            }

                            if (cardData) {
                                return { ...cardData, id: card.id };
                            }
                        });

                        const cardDetails = await Promise.all(cardDetailsPromises);
                        setCardsDetail(cardDetails.sort((a, b) => a.name.localeCompare(b.name)));
                    }
                }
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching deck details');
            }
        };

        fetchDeck();
    }, [navigate, id, isLoad]);

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
                        <p className="font-semibold mb-4 text-2xl">{title}'s card</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead className="ltr:text-left rtl:text-right">
                                    <tr>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Card Name</th>
                                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                        <th className="px-4 py-2"></th>
                                    </tr>
                                </thead>
                                {/* {Map card here} */}
                                {cardsDetail && Array.isArray(cardsDetail) && cardsDetail.map((card: any) => (
                                    <tbody className="divide-y divide-gray-200" key={`${card.id}`}>
                                        <tr className="odd:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{card.name}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.type}</td>
                                            <td className="whitespace-nowrap px-4 pt-3 pb-2 justify-items-center place-content-center justify-center">
                                                {/* <button
                                                    type="button" // Add the type attribute with a value of "button"
                                                    className="inline-block rounded bg-pink-600 px-4 py-2 text-xs font-medium text-white hover:bg-pink-700"
                                                    onClick={() => handleDeleteCard(card.id)}
                                                >
                                                    Delete
                                                </button> */}
                                                <button className="text-gray-600 transition hover:text-red-600" onClick={() => handleDeleteCard(card.id)}>
                                                    <span className="sr-only ">Remove item</span>

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-5 w-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>

                                ))}
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
                                className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm px-1"
                                onChange={(e) => setSearchName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchCard(e);
                                    }
                                }}
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

                        {SearchError ? <div className="bg-red-600 px-4 py-3 text-white">
                            <p className="text-center text-sm font-medium">
                                ⚠️ {SearchError}
                            </p>
                        </div> : null}
                        <div className="grid grid-cols-2 xl:grid-cols-3 px-3 gap-2">
                            {searchResult && Array.isArray(searchResult) && (searchResult as any[]).map((card: any) => (
                                <div key={`${card.api_card_id}_search`} className="my-1 w-full p-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-400 dark:hover:bg-gray-400" >
                                    <div className="w-full flex justify-center">
                                        <img src={card.card_images} alt={card.name} className="content-center" />
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