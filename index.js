

const puppeteer = require('puppeteer');

(async () => {
    // 1. Launch the browser
    // headless: false means you can actually see the browser open and watch it work!
    // slowMo: 50 slows down the bot's typing/clicking by 50ms so you can see what it's doing.
    const browser = await puppeteer.launch({ 
        headless: true, 
        slowMo: 50,
        defaultViewport: null, // Opens browser in full size
        args: ['--no-sandbox',
               '--disable-setuid-sandbox',
            '--disable-notifications' // This prevents the popup from ever appearing
    ]
    });

    // 2. Open a new tab
    const page = await browser.newPage();

    console.log("Navigating to the website...");
    
    // 3. Go to the website
    // 'networkidle2' means wait until the page is mostly done loading its JavaScript
    await page.goto('https://preny.ai', { waitUntil: 'networkidle2' });

    // --- INTERACTING WITH DYNAMIC JAVASCRIPT CONTENT ---
    
    console.log("Waiting for the login button to appear...");
    await page.waitForSelector('button::-p-text(Log in)');
    await page.click('button::-p-text(Log in)');
    console.log("Waiting for login form to load...");
    // 5. Wait for the username input box to appear on the screen
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');

    console.log("Typing credentials...");
    // 6. Type into the username and password fields
    await page.type('input[name="email"]', 'namtienhocmon@gmail.com', {delay:100});
    await page.type('input[name="password"]', '!Nam@Tien@123');
    console.log("Clicking the login button...");
    await page.click('button[type="submit"]');
    console.log("Waiting for the dashboard/content to load...");
    await page.waitForSelector('button::-p-text(Chat đa kênh)');
    console.log("Prepare to Click Chat đa kênh");
    await page.click('button::-p-text(Chat đa kênh)');
    console.log("Have already clicked Chat đa kênh");
    console.log("Ready to click - Tích hợp nền tảng")
    await page.waitForSelector('a::-p-text(Tích hợp nền tảng)');
    await page.click('a::-p-text(Tích hợp nền tảng)');
    console.log ("Have already clicked Tích hợp nền tảng")
    console.log ("Prepare to click Chờ kích hoạt");
    await page.waitForSelector('a[href="/quan-ly/tich-hop-nen-tang/cho-kich-hoat"]');
    await page.click ('a[href="/quan-ly/tich-hop-nen-tang/cho-kich-hoat"]');
    console.log ("Already clicked Chờ kích hoạt");

    async function activatePagesMultipleTimes(page, numberOfTimes) {
    for (let i = 0; i < numberOfTimes; i++) {
        console.log(`--- Starting loop number ${i + 1} ---`);
        // 1. Check the box    
    try {
        console.log("Waiting for the select-all checkbox...");
        await page.waitForSelector('#select-all', { timeout: 15000 }); // Wait 15 seconds max
        await page.click('#select-all');
        console.log("Checked the box!");
    } catch (error) {
        console.log("ERROR: Could not find #select-all. Taking a screenshot to see what's wrong...");
        // Take a picture of the screen and save it
        await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
        throw error; // Stop the script
    }
        console.log("Checked 'Chọn tất cả'");

        // 2. Click Activate
        await page.waitForSelector('svg[class="lucide lucide-zap"]', { visible: true });
        await page.click('svg[class="lucide lucide-zap"]');
        console.log("Clicked 'Kích hoạt trang'");

        // 3. Click Confirm
        await page.waitForSelector('button::-p-text(Xác nhận)', { visible: true });
        await page.click('button::-p-text(Xác nhận)');
        console.log("Clicked 'Xác nhận'");

        // ---------------------------------------------------------
        // 4. CRITICAL STEP: Wait for the action to finish!
        // You must wait for the popup to disappear or the page to reload 
        // before the loop restarts, otherwise it will find the old buttons.
        // ---------------------------------------------------------
        
        // Option A: Wait for the "Xác nhận" button to DISAPPEAR
        await page.waitForSelector('button::-p-text(Xác nhận)', { hidden: true });
        
        // Option B: If the page shows a success toast notification, wait for it
        // await page.waitForSelector('.success-message-class'); 

        // Option C: A simple hard pause just to be safe (waits 3 seconds)
        // Only use this if the other options are too hard to select
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        
        console.log(`--- Finished loop ${i + 1}, ready for the next one ---`);
    }
}

    // Run function
    await activatePagesMultipleTimes(page, 2);
    
    
    console.log("Successfully !");

    
    const extractedData = await page.evaluate(() => {
        // This code runs INSIDE the actual browser console
        const quoteElement = document.querySelector('.text');
        return quoteElement ? quoteElement.innerText : 'No quote found';
    });

    console.log("Extracted Data: ", extractedData);

    // 10. Close the browser
    console.log("Closing browser in 2 seconds...");
    setTimeout(async () => {
        await browser.close();
    }, 2000);

})();
