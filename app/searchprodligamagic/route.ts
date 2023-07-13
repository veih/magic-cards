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

    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.ligamagic.com.br");
    await page.type("#mainsearch", userSearch);
    await page.keyboard.press("Enter");

    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    const products: any = [];

    const mtgSingle = $(".mtg-single")
      .map((index, element) => {
         
        const title = $(element).find(".mtg-info");
        const price = $(element).find(".mtg-prices");
        const imgs = $(element).find("img.main-card");

        const items = {
          price: $(price[0]).text(),
          title: $(title[0]).text(),
          imageUrl: $(imgs[0]).attr("data-src"),
        }

        products.push(items)

        return $(element).text();
      })

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
