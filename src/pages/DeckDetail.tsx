import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../server/App";
import Navbar from "../assets/components/navbar";

function DeckEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [cards, setCards] = useState<any[]>([])

    const [cardsDetail, setCardsDetail] = useState<any[]>([])




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
                        <div className="py-2 col-span-3">
                            <p className="font-semibold mb-4 text-2xl">{title}'s card</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )



}
export default DeckEdit;