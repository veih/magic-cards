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

  let browser;

  try {
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.ligamagic.com.br");
    await page.type("#mainsearch", userSearch);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    
    const prices = $(".mtg-prices")
			.map((index, element) => {
				return $(element).text();
			})
			.get();

    const imageUrls = $("img.main-card")
      .map((index, element) => {
        return $(element).attr("src");
      })
      .get();

    const titles = $(".mtg-info")
			.map((index, element) => {
				return $(element).text();
			})
			.get();

    const products = [];

    for (let i = 0; i < imageUrls.length; i++) {
			const items = {
				price: prices[i],
				title: titles[i],
				imageUrl: imageUrls[i],
			};
			products.push(items);
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
