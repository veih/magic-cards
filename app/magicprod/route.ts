import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
	let browser;
	try {
		browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(
			"https://www.ligamagic.com.br/"
		);
		const html = await page.content(); 
		const $ = cheerio.load(html); 

		const products: { price: string; title: string; imageUrl: string }[] = [];

		$(".mtg-prices").each((_index, element) => {
			const price = $(element).text().trim();
			products.push({ price, title: "", imageUrl: "src" });
		});

		$("a > img > data-src").each((_index, element) => {
			const imageUrl = $(element).attr("src");
			imageUrls.push(imageUrl || "");
		});

		const titles: string[] = [];

		$(".mtg-info").each((_index, element) => {
			const title = $(element).text().trim();
			titles.push(title);
		});

			const imageUrls = $(".main-card")
			.each((_index, element) => {
				return $(element).attr("src");
			})
			.get();

		const data = [];

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
