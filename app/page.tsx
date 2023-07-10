"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type WSResults = {
  price: string;
  title: string;
  imageUrl: any;
};

export default function Home() {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchResults, setSearchResults] = useState<WSResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const ligaMagic = await fetch("/searchprodligamagic", {
      method: "POST",
      body: JSON.stringify({ searchPrompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const starCity = await fetch("/searchprodstarcity", {
      method: "POST",
      body: JSON.stringify({ searchPrompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { products } = await ligaMagic.json();

    console.log(products)
    setSearchResults(products);
    setSearchPrompt("");
    setIsLoading(false);
  };

  return (
    <main className="max-w-5xl mx-auto flex flex-col mt-5 justify-center">
      <form onSubmit={handleSubmit} className="flex justify-center space-x-2 my-4">
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

      {isLoading &&
        <svg
          version="1.1"
          id="L1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 100 100"
          xmlSpace="preserve"
        >
          <circle fill="none" stroke="#fff" stroke-width="6" stroke-miterlimit="15" stroke-dasharray="14.2472,14.2472" cx="50" cy="50" r="47" >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="5s"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite" />
          </circle>
          <circle fill="none" stroke="#fff" stroke-width="1" stroke-miterlimit="10" stroke-dasharray="10,10" cx="50" cy="50" r="39">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="5s"
              from="0 50 50"
              to="-360 50 50"
              repeatCount="indefinite" />
          </circle>
          <g fill="#fff">
            <rect x="30" y="35" width="5" height="30">
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.1" />
            </rect>
            <rect x="40" y="35" width="5" height="30" >
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.2" />
            </rect>
            <rect x="50" y="35" width="5" height="30" >
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.3" />
            </rect>
            <rect x="60" y="35" width="5" height="30" >
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.4" />
            </rect>
            <rect x="70" y="35" width="5" height="30" >
              <animateTransform
                attributeName="transform"
                dur="1s"
                type="translate"
                values="0 5 ; 0 -5; 0 5"
                repeatCount="indefinite"
                begin="0.5" />
            </rect>
          </g>
        </svg>
      }

      <div className="grid grid-cols-3 gap-4">
        {searchResults?.map((prod, i) => (
          <div key={i} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <div className="relative h-[380px]">
              <Image
                src={prod.imageUrl.startsWith("//") ? "https:" + prod.imageUrl : prod.imageUrl}
                alt={prod.title}
                fill
                className="rounded-lg"
              />
            </div>
            <div className="flex justify-between">
              <div className="mt-2">
                <p className="text-white">{prod.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
