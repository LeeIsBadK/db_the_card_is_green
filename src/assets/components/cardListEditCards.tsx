


function cardListEditCards(card : any) {
  return (
    console.log(card),
    

    <div key={card.id} className="my-3 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-400 dark:hover:bg-gray-400" >
      <div className="w-full flex justify-center">
        <img src={card.image_url} alt={card.name} className="h-40 content-center" />
      </div>
      <p className="text-white pt-1 object-fill">{card.name}</p>
      <p className="text-white">{card.type}</p>
    </div>
  );
}

export default cardListEditCards;