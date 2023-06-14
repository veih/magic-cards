const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
const port = 3000;

app.get("/", async (request, response) => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // Corrigido o nome do parâmetro "hearless" para "headless"
      defaultViewport: null, // Corrigido o valor do parâmetro "false" para "null"
      userDataDir: "./tmp"
    });
    const page = await browser.newPage();

    await page.goto("https://www.ligamagic.com.br/?view=cards/edicoes");

    const productsHandles = await page.$$("div.boxshadow .conteudo .box-interna");

    for (const productHandle of productsHandles) {
      try {
        const element = await productHandle.textContent; // Corrigido para usar o identificador correto "productHandle"

        const price = await page.evaluate(
          (e) => e.querySelector(".dataTables_length > value").textContent
        );

        console.log(element);
      } catch (error) {}
    }

    //await browser.close();

    response.send("Processo concluído"); // Enviando uma resposta para o cliente
  } catch (error) {
    console.error(error);
    response.status(500).send("Ocorreu um erro no servidor"); // Enviando uma resposta de erro para o cliente
  }
});

app.listen(port, () => {
  console.log(`Logado na porta: http://localhost:${port}/`);
});
