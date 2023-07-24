import Image from "next/image";
import { Key, useState } from "react";

type WSResults = {
  props: any;
  id: string;
  name: string;
  nameAux: string;
  priceMin: string;
  priceMed: string;
  priceMax: string;
  title: string;
  imageUrl: any;
};

export function LigamagicCards(products: WSResults) {

  const [searchResults, setSearchResults] = useState<WSResults[]>([products]);


  const handleMouseMove = (e: { currentTarget: { querySelector: (arg0: string) => any }; clientX: number; clientY: number }) => {
    const cardImage = e.currentTarget.querySelector(".card-image");
    const rect = cardImage.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (mouseY - centerY) / 10;
    const rotateY = (mouseX - centerX) / 10;

    cardImage.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: { currentTarget: { querySelector: (arg0: string) => any } }) => {
    const cardImage = e.currentTarget.querySelector(".card-image");
    cardImage.style.transform = "none";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
        {searchResults.map((prod, i: Key | null | undefined) => (
          <div key={i} className="bg-gray-700 p-5 rounded-lg grid grid-cols-2 gap-2 justify-center">
            <div className="relative h-120 w-80 mt-2" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <Image
                src={prod.imageUrl.startsWith("//") ? "https:" + prod.imageUrl : prod.imageUrl}
                alt={"Sem imagem"}
                fill
                className="rounded-lg card-image"
              />
            </div>
            <div className="flex flex-col">
              <a className="text-white text-center mt-1" href="https://www.ligamagic.com.br/">
                Liga Magic
              </a>
              <p className="text-white text-center mt-2">{prod.nameAux}</p>
              <table className="mt-1">
                <tbody>
                  <tr>
                    <td className="text-white">Preço mínimo</td>
                    <td className="text-white text-right">{prod.priceMin}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço médio</td>
                    <td className="text-white text-right">{prod.priceMed}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço máximo</td>
                    <td className="text-white text-right">{prod.priceMax}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-white text-center mt-1">Star City</p>
              <p className="text-white text-center mt-2">{prod.nameAux}</p>
              <table className="mt-1">
                <tbody>
                  <tr>
                    <td className="text-white">Preço mínimo</td>
                    <td className="text-white text-right">{prod.priceMin}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço médio</td>
                    <td className="text-white text-right">{prod.priceMed}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço máximo</td>
                    <td className="text-white text-right">{prod.priceMax}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-white text-center mt-1">Magic Domen</p>
              <p className="text-white text-center mt-2">{prod.nameAux}</p>
              <table className="mt-1">
                <tbody>
                  <tr>
                    <td className="text-white">Preço mínimo</td>
                    <td className="text-white text-right">{prod.priceMin}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço médio</td>
                    <td className="text-white text-right">{prod.priceMed}</td>
                  </tr>
                  <tr>
                    <td className="text-white">Preço máximo</td>
                    <td className="text-white text-right">{prod.priceMax}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
  );
}
