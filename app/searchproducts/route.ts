import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import fs from "fs";

export async function POST(request: Request): Promise<Response> {
  const { searchPrompt: userSearch, searchPromptNext: nextPage } = await request.json();

  if (!userSearch && nextPage === undefined) {
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

    if (userSearch) {
      await page.type("#mainsearch", userSearch);
      await page.keyboard.press("Enter");
    }

    if (nextPage !== undefined) {
      const paginationButtons = await page.$$(".result-paginacao > span > a");
      await paginationButtons[nextPage].click();
    }

    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    const products: any = [];

    const mtgSingle = $(".mtg-single").map((index, element) => {
      const id = $(element).find("");
      const name = $(element).find(".mtg-name");
      const nameAux = $(element).find(".mtg-name-aux");
      const priceMin = $(element).find(".price-min");
      const priceMed = $(element).find(".price-avg");
      const priceMax = $(element).find(".price-max");
      const imgs = $(element).find("img.main-card");

      const items = {
        name: $(name[0]).text(),
        nameAux: $(nameAux[0]).text(),
        priceMin: $(priceMin[0]).text(),
        priceMed: $(priceMed[0]).text(),
        priceMax: $(priceMax[0]).text(),
        imageUrl: $(imgs[0]).attr("data-src"),
      };

      const product = { ...items };

      products.push(product);

      return $(element).text();
    });

    const folderName = "./data";
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    const fileName = `cards.json`;
    const filePath = `${folderName}/${fileName}`;

    let existingData: any = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileData);
    }

    let updatedData: any[];

    if (nextPage !== undefined) {
      updatedData = [...existingData, ...products];
    } else {
      updatedData = products;
    }

    const uniqueProducts = updatedData.reduce((unique: any[], item: any) => {
      const found = unique.find((prod) => prod.name === item.name);
      if (!found) {
        unique.push(item);
      }
      return unique;
    }, []);

    const jsonData = JSON.stringify(uniqueProducts, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return NextResponse.json({ products: uniqueProducts });
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
