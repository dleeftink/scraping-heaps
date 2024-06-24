const puppeteer = require('puppeteer');
const phs = require('puppeteer-heap-snapshot');

async function main() {
    const browser = await puppeteer.launch({ 
      //executablePath: '/usr/bin/chromium-browser', args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] 
      headless:false
    });
    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/watch?v=L_o_O7v1ews");
    const heapSnapshot = await phs.captureHeapSnapshot(page.target());

    const objects = phs.findObjectsWithProperties(heapSnapshot, ["channelId", "viewCount","keywords"]);
    console.log("Trying,", objects);

    await browser.close();

}

main()