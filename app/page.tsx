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

		const res = await fetch("/searchprod", {
			method: "POST",
			body: JSON.stringify({ searchPrompt }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const { products } = await res.json();

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

			{isLoading && <p className="text-white">Loading...</p>}

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
