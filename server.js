const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;


app.get('/getTimeStories', async (req, res) => {
    try {
        const latestStories = await getLatestStories();
        res.json(latestStories);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function getLatestStories() {
    try {
        const response = await axios.get('https://time.com/');
        const html = response.data;
        const $ = cheerio.load(html);
        
        const latestStories = [];

        
        const partialLatestStories = $('div.partial.latest-stories');

        
        const storyElements = partialLatestStories.find('li.latest-stories__item');


        storyElements.each((index, element) => {
            const title = $(element).find('h3.latest-stories__item-headline').text().trim();
            const link = $(element).find('a').attr('href'); 
           
            latestStories.push({ title, link});
        });

        return latestStories;
    } catch (error) {
        console.error('Error fetching and parsing latest stories:', error);
        throw error;
    }
}


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
