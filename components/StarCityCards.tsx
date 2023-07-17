type StarCityCardProps = {
    prod:any;
  };
  
  export function StarCityCard({ prod }: StarCityCardProps) {
    return (
      <div className="bg-gray-700 p-5 rounded-lg grid grid-cols-2 gap-2 justify-center">
        <div className="text-white text-center mt-1">Star City</div>
        <div>
          <div className="text-white">Preço</div>
          <div className="text-white text-right">{prod.priceOne}</div>
        </div>
      </div>
    );
  }
  