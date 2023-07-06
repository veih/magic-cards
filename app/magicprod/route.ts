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
		const html = await page.content(); //get the entire html content
		const $ = cheerio.load(html); //load the html content

		const prices = $(".mtg-prices")
			.each((_index: any, element: any) => {
				return $(element).text();
			})
			.get();

		const titles = $(".mtg-info")
			.each((_index, element) => {
				return $(element).text();
			})
			.get();

		// const reviews = $("span.a-size-base.s-underline-text")
		// 	.each((index, element) => {
		// 		return $(element).text();
		// 	})
		// 	.get();

			const imageUrls = $(".main-card")
			.each((_index, element) => {
				return $(element).attr("src");
			})
			.get();

		const data = [];

		for (let i = 0; i < titles.length; i++) {
			const item = {
				price: prices[i],
				title: titles[i],
				// review: reviews[i],
				imageUrl: imageUrls[i],
			};
			data.push(item);
		}

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 200 }
		);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
