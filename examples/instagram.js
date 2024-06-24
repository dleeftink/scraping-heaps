const puppeteer = require('puppeteer');
const phs = require('puppeteer-heap-snapshot');

async function main() {
    const browser = await puppeteer.launch({ 
      headless:false
    });
    const page = await browser.newPage();
    await page.goto("https://www.instagram.com/verge/");
    const heapSnapshot = await phs.captureHeapSnapshot(page.target());

    const objects = phs.findObjectsWithProperties(heapSnapshot, ["newStories"]);
    console.log("Trying,", objects);

    await browser.close();

}

main()