"use client"

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Loading } from "./components/loading";

type WSResults = {
  priceMin: string;
  priceMed: string;
  priceMax: string;
  title: string;
  imageUrl: any;
};

export default function Home() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchPromptNext, setSearchPromptNext] = useState(1);
  const [searchResults, setSearchResults] = useState<WSResults[]>([]);
  const [searchResultsNext, setSearchResultsNext] = useState<WSResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 20 && searchResultsNext.length > 0 && !isLoading) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchResultsNext, isLoading]);

  const fetchData = async (searchParam: string, nextPage?: number) => {
    setIsLoading(true);

    const response = await fetch("/searchprodligamagic", {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchResults([]);
    setSearchPromptNext(1);

    const products = await fetchData(searchPrompt);
    setSearchResults(products);
    setSearchPrompt("");
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    setIsLoading(true);

    const productsNext = await fetchData(searchPrompt, searchPromptNext);
    setSearchResults((prevResults) => [...prevResults, ...productsNext]);
    setSearchPromptNext((prevNext) => prevNext + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    setSearchResults((prevResults) => [...prevResults, ...searchResultsNext]);
    setSearchResultsNext([]);
    setIsLoading(false);
  }, []);

  return (
    <main className="max-w-5xl mx-auto flex flex-col mt-2 justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-2 my-4">
        <input
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          type="text"
          placeholder="Product to be searched..."
          className="px-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none"
        />
        <button
          disabled={searchPrompt === ""}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-blue-500/40 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {isLoading && <Loading />}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
        {searchResults.map((prod, i) => (
          <div key={i} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg grid grid-cols-2 gap-2 justify-center">
            <div className="relative h-100 w-60 mt-2" >
              <Image
                src={prod.imageUrl.startsWith("//") ? "https:" + prod.imageUrl : prod.imageUrl}
                alt={prod.title}
                fill
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-white text-center mt-1">Liga Magic</p>
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

      <div ref={loadMoreRef}>Exibir</div>
    </main>
  );
}
