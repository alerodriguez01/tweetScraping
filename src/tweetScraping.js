import puppeteer from 'puppeteer';
import fs from 'fs';

const deleteRepeatedObjects = (arr) => {
    
    const uniqueObjects = []; // stores not repeated objects
    const tweetsSeen = [] // store text tweets already seen

    for (const objeto of arr) {

        if (!tweetsSeen.includes(objeto.tweet)) {
            // if tweet is not included, then add it to the tweetsSeen and add the object to uniqueObjects
            tweetsSeen.push(objeto.tweet);
            uniqueObjects.push(objeto);
        }
    }

    return uniqueObjects
}

const scrapping = async (query, minTweets) => {
    // Launch browser
    const browser = await puppeteer.launch({ headless: false });

    // Create a page
    const page = await browser.newPage();

    // Go to twitter
    await page.goto(`https://twitter.com/search?q=${query}&f=live`);

    // Wait for mail or user input
    const inputMail = await page.waitForSelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu');
    // Type user
    await inputMail.type(process.argv[2], { delay: 100 });

    // Press enter
    await page.keyboard.press('Enter');

    // Wait for password input
    const inputPassword = await page.waitForSelector('.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu');
    // Type password
    await inputPassword.type(process.argv[3], { delay: 100 });

    // Press enter
    await page.keyboard.press('Enter');

    // Wait for tweet container
    await page.waitForSelector('[data-testid="cellInnerDiv"]')

    let dataSet = []

    for (let i = 0; i < minTweets / 10; i++) {

        let tweets = await page.$$eval('div[data-testid="cellInnerDiv"]', divs => {

            return divs.map(div => {

                const time = div.querySelector('time')?.getAttribute("datetime"); // <time datetime="2023-09-05T15:41:59.000Z">1m</time>
                const tweet = div.querySelector('div[data-testid="tweetText"]')?.textContent;
                const username = div.querySelector('div.css-901oao.css-1hf3ou5.r-1bwzh9t.r-18u37iz.r-37j5jr.r-1wvb978.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0')?.textContent;

               return {
                    username: username ?? "",
                    time: time ?? "",
                    tweet: tweet ?? "",
                }
            })

        });

        dataSet = [...dataSet, ...tweets]

        // Scrolldown to fetch more tweets
        await page.mouse.wheel({ deltaY: 3000 });
        // and wait for loading them
        await new Promise(r => setTimeout(r, 1500));
    }

    //console.log(dataSet)
    //console.log(dataSet.length)

    // Delete repeted tweets
    const dataSetConjunto = deleteRepeatedObjects(dataSet);
    console.log("Total tweets scrapped: " + dataSetConjunto.length)

    // Close browser
    await browser.close();

    return dataSetConjunto
}

const makeQuery = (query) => {
    return query.replace(" ", "%20")
}

const makeCSV = (data) => {

    let tweetsCSV = "Username;Datetime;Tweet;\n";

    data.forEach(tweetObj => {

        let tweetSinSaltoLinea = tweetObj.tweet.replace(/\n/g, " ") // Delete enter
        tweetSinSaltoLinea = tweetSinSaltoLinea.replaceAll(";", ".") // Delete ;
        tweetsCSV = tweetsCSV + tweetObj.username + ";" + tweetObj.time + ";" + tweetSinSaltoLinea + ";\n" // Username;Datetime;Tweet;\n

    });

    fs.writeFileSync("tweets.csv", tweetsCSV);
}

const main = (async () => {

    const query = process.argv[4] || "elon musk"
    const minTweets = process.argv[5] || 200

    const data = await scrapping(makeQuery(query), minTweets);

    makeCSV(data)
})();
