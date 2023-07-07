import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
const cheerio = require("cheerio");

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
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("https://www.ligamagic.com.br");
    await page.type("#mainsearch", userSearch);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    const prices: string[] = [];
    const titles: string[] = [];
    const imageUrls: string[] = [];

    $(".mtg-prices").each((_index: any, element: any) => {
      const price = $(element).text().trim();
      prices.push(price);
    });

    $(".card-item > a > img").each((_index: any, element: any) => {
      const imageUrl = $(element).attr("src");
      imageUrls.push(imageUrl || "");
    });

    $(".mtg-info").each((_index: any, element: any) => {
      const title = $(element).text().trim();
      titles.push(title);
    });

    const products = [];

    for (let i = 0; i < prices.length; i++) {
      products.push({
        price: prices[i],
        imageUrl: imageUrls[i] || "",
        title: titles[i] || "",
      });
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
