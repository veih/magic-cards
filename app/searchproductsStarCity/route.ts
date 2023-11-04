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
    await page.goto("https://starcitygames.com/search");

    await page.type("#search_query", userSearch);
    await page.keyboard.press("Enter");

    if (nextPage !== undefined) {
      const paginationButtons = await page.$$(".result-paginacao.ui-sortable item-list.list-layout");
      await paginationButtons[nextPage].click();
    }

    await page.waitForNavigation();

    const html = await page.content();
    const $ = cheerio.load(html);

    const productsStarCitys: any = [];
    
    const myStacity = $(".item-body.hawk-results-item__body").each((index, element) => {

      const priceStarCity = $(element).find(".hawk-results-item__options-table-cell--price.childAttributes");


      const items = {

        priceStarCity: $(priceStarCity[0]).text().trim(),

      };

      productsStarCitys.push(items);

      return $(element).text();
    });

    console.log(myStacity)

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
      updatedData = [...existingData, ...productsStarCitys];
    } else {
      updatedData = productsStarCitys;
    }

    const uniqueProductsStarCitys = updatedData.reduce((unique: any[], item: any) => {
      const found = unique.find((prod) => prod.priceStarCity === item.priceStarCity);
      if (!found) {
        unique.push(item);
      }
      return unique;
    }, []);

    const jsonData = JSON.stringify(uniqueProductsStarCitys, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return NextResponse.json({ productsStarCity: uniqueProductsStarCitys });

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
