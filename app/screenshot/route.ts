import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // TO GET THE SCREENSHOT IN BINARY FORMAT
    const screenshotBuffer = await page.screenshot({ type: "png" });

    // set headers for binary response
    const init = {
      headers: {
        "Content-Type": "image/png",
      },
    };

    return new Response(screenshotBuffer, init);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
