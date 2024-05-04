import { Link } from "react-router-dom";

const gachaCard = (decks: any) => {
    return (
        <Link to={`/${decks.id}`} key={decks.id}>
            <div
            className="cursor-pointer transition-all duration-500 hover:translate-y-2 hover:bg-stone-600 hover:text-white h-40 bg-stone-400 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-4 px-4"
        >
            <img src="public\YGO-backcard.png" alt="deck" className="w-20" />
  
            <div className="w-36">
                <span className="font-bold text-teal-950 text-xl">{decks.name}</span>
                <p className="line-clamp-3">
                    Description: {decks.description}
                </p>
            </div>
        </div>
        </Link>

    );
}
export default gachaCard;