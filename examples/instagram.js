const puppeteer = require('puppeteer-extra');
const phs = require('puppeteer-heap-snapshot');
const fs = require('fs');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const sleep = ms => new Promise(res => setTimeout(res, ms));

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: true}).then(async browser => {
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/verge/p/C8PSn5zCeCm/");
  await sleep(4600);
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  const heapSnapshot = await phs.captureHeapSnapshot(page.target());

  //const objects = phs.findObjectsWithProperties(heapSnapshot, ["newStories","timestamp"]);
  //console.log("Trying,", objects);

  // Serialize the heapSnapshot object to JSON
  const serializedHeapSnapshot = JSON.stringify(heapSnapshot.strings, null, 2); // The second parameter (null) is for replacer function, third parameter (2) is for spacing
 
  // Save the serialized heapSnapshot to a.json file
  await fs.promises.writeFile('./data/heapSnapshotInstagram.json', serializedHeapSnapshot, (err) => {
    if (err) throw err;
    console.log('The heapSnapshot has been saved!');
  });

  await browser.close()
})