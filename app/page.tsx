"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Loading } from "../components/Loading";

type WSResults = {
  priceStarCity: String;
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

export default function Home(props: { cards: any; searchResults: WSResults[] }) {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchResults, setSearchResults] = useState<WSResults[]>([]);
  const [searchResultsStarcity, setSearchResultsStarcity] = useState<WSResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (searchParam: string, nextPage?: number) => {
    setIsLoading(true);

    const response = await fetch("/searchproducts", {
      method: "POST",
      body: JSON.stringify({
        searchPrompt: searchParam,
        searchPromptNext: nextPage,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { products } = await response.json();
    return products;
  };

  const fetchDataStarCity = async (searchParam: string, nextPage?: number) => {
    setIsLoading(true);

    const response = await fetch("/searchproductsStarCity", {
      method: "POST",
      body: JSON.stringify({
        searchPrompt: searchParam,
        searchPromptNext: nextPage,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { productsStarCity } = await response.json();
    return productsStarCity;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchResults([]);

    const products: any = await fetchData(searchPrompt);
    const productsStarCitys: any = await fetchDataStarCity(searchPrompt);

    setSearchResultsStarcity(productsStarCitys)
    setSearchResults(products);
    setIsLoading(false);
  };

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

  const handleChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSearchPrompt(value);
  };

  return (
    <main className="max-w-5xl mx-auto flex flex-col mt-4 justify-center">
      <div>
        <p className="text-white mt-2 text-center text-2xl">Digite o nome completo da carta para facilitar sua busca</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-2 my-4">
        <input
          value={searchPrompt}
          onChange={handleChange}
          type="text"
          placeholder="Cartas de magic..."
          className="px-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none"
        />
        <button
          disabled={searchPrompt === ""}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-500/40 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Magic"}
        </button>
      </form>

      {isLoading && <Loading />}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 mb-3">
        {searchResults.map((prod, i) => (
          <div key={i} className="bg-gray-700 p-5 rounded-lg grid grid-cols-2 gap-2 justify-center">
            <div className="relative h-60 w-40 mt-2" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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
        {searchResultsStarcity.map((prod, i) => (
          <div className="text-white text-right" key={i}><p className="text-white text-center mt-1">Star City</p>
              {/* <p className="text-white text-center mt-2">{prod.nameAux}</p> */}
              <table className="mt-1">
                <tbody>
                  <tr>
                    <td className="text-white">Preço</td>
                    <td className="text-white text-right">{prod.priceStarCity}</td>
                  </tr>
                </tbody>
              </table></div>
        ))}
      </div>
    </main>
  );
}
