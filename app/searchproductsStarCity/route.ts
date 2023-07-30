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
      await page.goto("https://starcitygames.com");

      await page.type("#search_query", userSearch);
      await page.keyboard.press("Enter");

    if (nextPage !== undefined) {
      const paginationButtons = await page.$$(".result-paginacao > span > a");
      await paginationButtons[nextPage].click();
    }

    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    const productsStarCity: any = [];

    const mtgSingleStarCity = $(".ui-sortable").map((index, element) => {
      const price = $(element).find(".hawk-results-item__options-table-cell--price");

      const items = {
        priceStarCity: $(price[0]).text(),
      };

      const productStarCity = { ...items };

      productsStarCity.push(productStarCity);
      return $(element).text();
    });

    const folderName = "./data";
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    const fileName = `cardsStarCIty.json`;
    const filePath = `${folderName}/${fileName}`;

    let existingData: any = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(fileData);
    }

    let updatedData: any[];

    if (nextPage !== undefined) {
      updatedData = [...existingData, ...productsStarCity];
    } else {
      updatedData = productsStarCity;
    }

    const uniqueProductsStarCity = updatedData.reduce((unique: any[], item: any) => {
      const found = unique.find((prod) => prod.name === item.name);
      if (!found) {
        unique.push(item);
      }
      return unique;
    }, []);

    const jsonData = JSON.stringify(uniqueProductsStarCity, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return NextResponse.json({ productsStarCity: uniqueProductsStarCity });
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
