let fs = require('fs');
let cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


async function getPage(link) {
  let test = [];
  const regex = new RegExp('^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+).com');
  await Promise.all(link.map(async (link) => {
    try {
      const browser = await puppeteer.launch({ headless: true, });
      const page = await browser.newPage();
      await page.goto(link);
      data = await page.content();
      domain = link.match(regex)[1];
      const item = {
        data,
        domain
      }
      test.push(item);
      await browser.close();
    }
    catch (e) {
      console.log(e);
    }
  }))
  return test;
}

function getDataTokopedia(page) {
  let items = [];
  const $ = cheerio.load(page);
  let firstDiv = $('div .css-1g20a2m');
  firstDiv.each((i, item) => {
    const $item = $(item)
    const link = $item.find('a').attr('href');
    const title = $item.find('span.css-1bjwylw').text().trim();
    const price = $item.find('span.css-o5uqvq').text();
    let nameAndLocation = [];
    $item.find('div.css-vbihp9 span.css-1kr22w3').each((i, data) => {
      const $data = $(data);
      nameAndLocation.push($data.text());
    });
    const oneItem = {
      title,
      price,
      link,
      location: nameAndLocation[0],
      seller: nameAndLocation[1],
      result: "Tokopedia"
    }
    items.push(oneItem);
  });
  return items;
}

function getDataBukalapak(page) {
  const $ = cheerio.load(page);
  let firstDiv = $('.col-12--2');
  let items = [];
  firstDiv.each((i, item) => {
    const $item = $(item)
    const title = $item.find('.product-description h3 a').text();
    const link = $item.find('.product-description h3 a').attr('href');
    const price = $item.find('.amount').text();
    const seller = $item.find('.user__name a').text();
    const location = $item.find('.user-city__txt').text();
    if (title) {
      const oneItem = {
        title,
        price,
        link,
        seller,
        location,
        result: 'bukalapak'
      } 
      items.push(oneItem);
    }
  });
  return items;
}

async function getData(query) {
  const tokopedia_url = 'https://www.tokopedia.com/search?st=product&q=' + query;
  const bukalapak_url = 'https://www.bukalapak.com/products?utf8=%E2%9C%93&source=navbar&from=omnisearch&search_source=omnisearch_organic&from_keyword_history=false&search%5Bkeywords%5D=' + query;
  let all_url = [tokopedia_url, bukalapak_url];
  let pages = null;
  try {
    pages = await getPage(all_url);
  }
  catch (e) {
    console.log(e);
  }

  result = pages.map((page) => {
    switch (page.domain) {
      case 'bukalapak':
        return getDataBukalapak(page.data);
      default:
        return getDataTokopedia(page.data);
    }
  });
  return result; 
}


module.exports = {
  getData
}
