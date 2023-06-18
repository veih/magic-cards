
const puppeteer = require('puppeteer');
const fs = require('fs/promises')

async function magic() {
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.ligamagic.com.br/?view=cards/search&card=edid=480196%20ed=ltr/');

    const names = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div > .card-grid')).map(x => x.textContent)
    });
    await fs.writeFile("names.txt", names.join("/r/n"))
    
    const photos =  await page.$$eval('img', imgs => {
      return imgs.map(x.src)
    })

    for (const photo of photos) {
      const imagepage = await page.goto(photo)
      await fs.writeFile(photo.split('/').pop(), await imagepage.buffer())
    }
    
    await browser.close
  }
 
magic()