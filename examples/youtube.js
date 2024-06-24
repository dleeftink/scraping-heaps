const puppeteer = require('puppeteer');
const phs = require('puppeteer-heap-snapshot');

const fs = require('fs');

async function main() {
  const browser = await puppeteer.launch({
    //executablePath: '/usr/bin/chromium-browser', args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] 
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("https://www.youtube.com/watch?v=L_o_O7v1ews");
  
  //await page.screenshot({path: 'screenshot.png'});

  const heapSnapshot = await phs.captureHeapSnapshot(page.target());
  
  const objects = phs.findObjectsWithProperties(heapSnapshot, ["channelId", "viewCount", "keywords"]);
  console.log("Trying,", objects);

  // Serialize the heapSnapshot object to JSON
  /*const serializedHeapSnapshot = JSON.stringify(heapSnapshot.strings,null,2); // The second parameter (null) is for replacer function, third parameter (2) is for spacing

  // Save the serialized heapSnapshot to a.json file
  await fs.promises.writeFile('./data/heapSnapshotYoutube.json', serializedHeapSnapshot, (err) => {
    if (err) throw err;
    console.log('The heapSnapshot has been saved!');
  });*/


  await browser.close();

}

main()