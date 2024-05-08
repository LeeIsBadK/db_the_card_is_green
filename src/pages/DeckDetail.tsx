import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../server/App";
import Navbar from "../assets/components/navbar";
import Footer from "../assets/components/footer";

function DeckDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<any[]>([]);
    const [cardsDetail, setCardsDetail] = useState<any[]>([]);
    const [monsterCards, setMonsterCards] = useState<any[]>([]);
    const [spellCards, setSpellCards] = useState<any[]>([]);
    const [trapCards, setTrapCards] = useState<any[]>([]);
    const [cardViews, changeTableView] = useState("card");


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
                    setDescription(data.description);

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
                        setCardsDetail(cardDetails);
                        const categorizedCards = {
                            Monster: [] as any[],
                            Spell: [] as any[],
                            Trap: [] as any[]
                        };

                        cardDetails.forEach((card: any) => {
                            if (card.type.includes('Monster')) {
                                categorizedCards.Monster.push(card);
                            } else if (card.type === 'Spell Card') {
                                categorizedCards.Spell.push(card);
                            } else if (card.type === 'Trap Card') {
                                categorizedCards.Trap.push(card);
                            }
                        });

                        setMonsterCards(categorizedCards.Monster);
                        setSpellCards(categorizedCards.Spell);
                        setTrapCards(categorizedCards.Trap);

                        // Fetch additional details for Monster cards
                        const fetchMonsterDetails = async () => {
                            try {
                                console.log(categorizedCards.Monster)
                                const monsterDetailsPromises = categorizedCards.Monster.map(async (card) => {
                                    const { data: monsterData, error: monsterError } = await supabase
                                        .from('Monster_Cards')
                                        .select()
                                        .eq('api_card_id', card.api_card_id)
                                        .single();

                                    if (monsterError) {
                                        console.error(`Error fetching details for monster card ID ${card.id}:`, monsterError);
                                        throw new Error('Could not fetch monster card details');
                                    }
                                    return { ...card, ...monsterData };
                                });

                                const monsterDetails = await Promise.all(monsterDetailsPromises);
                                setMonsterCards(monsterDetails);
                                console.log(monsterCards);
                            } catch (error) {
                                console.error('Error fetching monster card details:', error);
                            }
                        };
                        fetchMonsterDetails();

                        // Fetch additional details for Spell cards
                        const fetchSpellDetails = async () => {
                            try {
                                const spellDetailsPromises = categorizedCards.Spell.map(async (card) => {
                                    const { data: spellData, error: spellError } = await supabase
                                        .from('Spell_Cards')
                                        .select()
                                        .eq('api_card_id', card.api_card_id)
                                        .single();

                                    if (spellError) {
                                        console.error(`Error fetching details for spell card ID ${card.id}:`, spellError);
                                        throw new Error('Could not fetch spell card details');
                                    }
                                    console.log(spellData);
                                    return { ...card, ...spellData };
                                });

                                const spellDetails = await Promise.all(spellDetailsPromises);
                                setSpellCards(spellDetails);
                            } catch (error) {
                                console.error('Error fetching spell card details:', error);
                            }
                        };
                        fetchSpellDetails();

                        // Fetch additional details for Trap cards
                        const fetchTrapDetails = async () => {
                            try {
                                const trapDetailsPromises = categorizedCards.Trap.map(async (card) => {
                                    const { data: trapData, error: trapError } = await supabase
                                        .from('Trap_Cards')
                                        .select()
                                        .eq('api_card_id', card.api_card_id)
                                        .single();

                                    if (trapError) {
                                        console.error(`Error fetching details for trap card ID ${card.id}:`, trapError);
                                        throw new Error('Could not fetch trap card details');
                                    }
                                    return { ...card, ...trapData };
                                });

                                const trapDetails = await Promise.all(trapDetailsPromises);
                                setTrapCards(trapDetails);
                            } catch (error) {
                                console.error('Error fetching trap card details:', error);
                            }
                        };
                        fetchTrapDetails();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDeck();
    }, [navigate, id]);





    return (
        <>
            <Navbar />
            <div className=" px-[4%] lg:px-[10%] pt-6">
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
                            <p className="block transition hover:text-gray-700"> {title} </p>
                        </li>


                    </ol>
                </nav>


                <div className="flow-root" id="detail">
                    <label htmlFor="detail" className="block text-medium font-medium text-gray-900 pb-3"> Detail deck ID:{id}</label>
                    <dl className="-my-3 divide-y divide-gray-100 text-sm">
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 ah-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Title</dt>
                            <dd className="text-gray-700 sm:col-span-4">{title}</dd>

                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Description</dt>
                            <dd className="text-gray-700 sm:col-span-4">
                                {description}
                            </dd>

                        </div>
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-8 sm:gap-6 h-auto">
                            <dt className="font-medium text-gray-900 col-span-2">Number of cards</dt>
                            <dd className="text-gray-700 sm:col-span-4">{cards.length}</dd>
                        </div>
                        <div className="grid grid-cols-3 py-3 sm:grid-cols-6 sm:gap-2">
                            <Link to="./edit">
                                <button className="transition shadow-md cursor-pointer duration-500 hover:translate-y-0.5 delay-50 border-2 border-gray-300 hover:bg-gray-300 hover:text-white w-60 h-10 rounded col-span-1 px-2" type="submit">Edit or Add/Delete card</button>
                            </Link>
                        </div>


                    </dl>
                </div>

                <span className="relative flex justify-center lg:pt-12">
                    <div
                        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"
                    ></div>

                    <span className="relative z-10 bg-white px-6"></span>
                </span>


                {/* {Card section} */}

                <div className="w-full">
                    <div className="my-1 sm:my-8 grid grid-cols-1 py-3 sm:grid-cols-5 sm:gap-2">
                        <div className="py-2 col-span-5">
                            <p className="font-semibold mb-4 text-3xl">{title}'s card</p>
                            <div className="overflow-x-auto">

                                {/* button for select view mode */}
                                <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                                    <button
                                        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                                        title="Card View"
                                        onClick={() => changeTableView("card")}
                                        disabled={cardViews === "card"}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-4 w-4"
                                        >

                                            <path d="M8.4 3H4.6C4.03995 3 3.75992 3 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3 3.75992 3 4.03995 3 4.6V8.4C3 8.96005 3 9.24008 3.10899 9.45399C3.20487 9.64215 3.35785 9.79513 3.54601 9.89101C3.75992 10 4.03995 10 4.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4V4.6C10 4.03995 10 3.75992 9.89101 3.54601C9.79513 3.35785 9.64215 3.20487 9.45399 3.10899C9.24008 3 8.96005 3 8.4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19.4 3H15.6C15.0399 3 14.7599 3 14.546 3.10899C14.3578 3.20487 14.2049 3.35785 14.109 3.54601C14 3.75992 14 4.03995 14 4.6V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10H19.4C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V4.6C21 4.03995 21 3.75992 20.891 3.54601C20.7951 3.35785 20.6422 3.20487 20.454 3.10899C20.2401 3 19.9601 3 19.4 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M19.4 14H15.6C15.0399 14 14.7599 14 14.546 14.109C14.3578 14.2049 14.2049 14.3578 14.109 14.546C14 14.7599 14 15.0399 14 15.6V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21H19.4C19.9601 21 20.2401 21 20.454 20.891C20.6422 20.7951 20.7951 20.6422 20.891 20.454C21 20.2401 21 19.9601 21 19.4V15.6C21 15.0399 21 14.7599 20.891 14.546C20.7951 14.3578 20.6422 14.2049 20.454 14.109C20.2401 14 19.9601 14 19.4 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8.4 14H4.6C4.03995 14 3.75992 14 3.54601 14.109C3.35785 14.2049 3.20487 14.3578 3.10899 14.546C3 14.7599 3 15.0399 3 15.6V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H8.4C8.96005 21 9.24008 21 9.45399 20.891C9.64215 20.7951 9.79513 20.6422 9.89101 20.454C10 20.2401 10 19.9601 10 19.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                                        </svg>
                                    </button>

                                    <button
                                        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative cardViews===card ? 'bg-gray-50' : 'bg-white'"
                                        title="Table view"
                                        onClick={() => changeTableView("table")}
                                        disabled={cardViews === "table"}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-4 w-4"
                                        >
                                            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 9L21 9M9 3L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </svg>
                                    </button>
                                </span>

                                {/* {Table view} */}
                                {cardViews === "table" && (
                                    <table className="mt-4 min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead className="ltr:text-left rtl:text-right">
                                            <tr>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Card Name</th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Type</th>
                                            </tr>
                                        </thead>
                                        {/* {Map card here} */}
                                        {cardsDetail && Array.isArray(cardsDetail) && cardsDetail.map((card: any) => (
                                            <tbody className="divide-y divide-gray-200" key={`${card.id}`}>
                                                <tr className="odd:bg-gray-50">
                                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{card.name}</td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{card.type}</td>
                                                </tr>
                                            </tbody>

                                        ))}
                                    </table>
                                )}
                                {/* {Card view} */}
                                {cardViews === "card" && (
                                    <>
                                        <p className="text-xl pt-4 font-semibold">Monster</p>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1">
                                            {monsterCards && Array.isArray(monsterCards) && monsterCards.map((card: any) => (
                                                <div className="bg-amber-50 shadow-md rounded-md p-2" key={card.id}>
                                                    <img src={card.card_images} alt={card.name} className=" object-cover" />
                                                    <p className="text-sm font-semibold">{card.name}</p>
                                                    <p className="text-xs text-gray-600">{card.type}</p>
                                                    <p className="text-xs text-gray-600">{card.level} {card.attribute}</p>
                                                    {/* <p className="text-xs text-gray-600">{card.desc}</p> */}
                                                    <p className="text-xs text-gray-600">{card.attack}/{card.defense}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xl pt-4 font-semibold">Spell</p>
                                        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 my-1">
                                            {spellCards && Array.isArray(spellCards) && spellCards.map((card: any) => (
                                                <div className="bg-emerald-50 shadow-md rounded-md p-2" key={card.id}>
                                                    <img src={card.card_images} alt={card.name} className=" object-cover" />
                                                    <p className="text-sm font-semibold">{card.name}</p>
                                                    <p className="text-xs text-gray-600">{card.type}</p>
                                                    <p className="text-xs text-gray-600">{card.race}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xl pt-4 font-semibold">Trap</p>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8
                                        my-2">
                                            {trapCards && Array.isArray(trapCards) && trapCards.map((card: any) => (
                                                <div className="bg-rose-50 shadow-md rounded-md p-2" key={card.id}>
                                                    <img src={card.card_images} alt={card.name} className=" object-cover" />
                                                    <p className="text-sm font-semibold">{card.name}</p>
                                                    <p className="text-xs text-gray-600">{card.type}</p>
                                                    <p className="text-xs text-gray-600">{card.race}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )



}
export default DeckDetail;