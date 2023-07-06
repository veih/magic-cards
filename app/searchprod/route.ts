import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function POST(request: Request): Promise<Response> {
	const { searchPrompt: userSearch } = await request.json();

	if (!userSearch) {
		return NextResponse.json(
			{ error: "Search parameter not provided" },
			{ status: 400 }
		);
	}

	let browser: any;

	try {
		await new Promise((resolve) => setTimeout(resolve, 5000)); // Aguarda 10 segundos

		browser = await puppeteer.launch({ headless: "new" });
		const page = await browser.newPage();
		await page.goto("https://www.ligamagic.com.br");
		await page.type("#mainsearch", userSearch);
		await page.keyboard.press("Enter");
		await page.waitForNavigation();

		const html = await page.content(); //obtém o conteúdo HTML completo
		const $ = cheerio.load(html); //carrega o conteúdo HTML

		const products: { price: string; title: string; imageUrl: string }[] = [];

		$(".mtg-prices").each((_index, element) => {
			const price = $(element).text().trim();
			products.push({ price, title: "", imageUrl: "" });
		});

		const imageUrls: string[] = [];

		$("img.main-card").each((_index, element) => {
			const imageUrl = $(element).attr("src");
			imageUrls.push(imageUrl || "");
		});

		const titles: string[] = [];

		$(".mtg-info").each((_index, element) => {
			const title = $(element).text().trim();
			titles.push(title);
		});

		for (let i = 0; i < products.length; i++) {
			products[i].imageUrl = imageUrls[i] || "";
			products[i].title = titles[i] || "";
		}

		return NextResponse.json({ products });
	} catch (error: any) {
		return NextResponse.json(
			{ error: `An error occurred: ${error.message}` },
			{ status: 200 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
