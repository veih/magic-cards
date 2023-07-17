import Image from "next/image";

type LigamagicCardsProps = {
  prod: any;
  handleMouseMove: (e: any) => void;
  handleMouseLeave: (e: any) => void;
};

export function LigamagicCards({ prod, handleMouseMove, handleMouseLeave }: LigamagicCardsProps) {
  return (
    <div key={prod.title} className="bg-gray-700 p-5 rounded-lg grid grid-cols-2 gap-2 justify-center">
      <div className="relative h-120 w-60 mt-2" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <Image
          src={prod.imageUrl.startsWith("//") ? "https:" + prod.imageUrl : prod.imageUrl}
          alt={prod.title}
          fill
          className="rounded-lg card-image"
        />
      </div>
      <div className="flex flex-col">
        <a className="text-white text-center mt-1" href="https://www.ligamagic.com.br/">Liga Magic</a>
        <div className="mt-1">
          <div>
            <div>
              <div className="text-white">Preço mínimo</div>
              <div className="text-white text-right">{prod.priceMin}</div>
            </div>
            <div>
              <div className="text-white">Preço médio</div>
              <div className="text-white text-right">{prod.priceMed}</div>
            </div>
            <div>
              <div className="text-white">Preço máximo</div>
              <div className="text-white text-right">{prod.priceMax}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
