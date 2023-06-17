const express = 'express';
const puppeteer = 'puppeteer';

const app = express();
const port = 3000;

let cachedHtml = null;

app.get('/', async (request, response) => {
  try {
    if (cachedHtml) {
      response.send(cachedHtml);
      return;
    }

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: './tmp'
    });
    const page = await browser.newPage();

    await page.goto('https://www.ligamagic.com.br/?view=cards/search&card=edid=480196%20ed=ltr');

    const htmlContent = await page.evaluate(() => {
      const element = document.querySelector('div > .card-grid');
      return element ? element.outerHTML : null;
    });

    cachedHtml = htmlContent;

    response.send(htmlContent || 'Elemento não encontrado');
  } catch (error) {
    console.error(error);
    response.status(500).send('Ocorreu um erro no servidor');
  }
});

app.listen(port, () => {
  console.log(`Logado na porta: http://localhost:${port}/`);
});

export default app;
