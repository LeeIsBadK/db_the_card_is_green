const gachaCard = (decks: any) => {
    return (
        <div
            className="cursor-pointer transition-all duration-500 hover:translate-y-2 hover:bg-stone-600 h-40 bg-stone-400 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-4 px-4" key={decks.id}
            onClick={() => window.location.href = `/${decks.id}`}
        >
            <img src='.\src\assets\components\YGO-backcard.png' alt="deck" className="w-20" />
  
            <div className="w-36">
                <span className="font-bold text-teal-950 text-xl">{decks.name}</span>
                <p className="line-clamp-3">
                    Description: {decks.description}
                </p>
            </div>
        </div>

    );
}
export default gachaCard;