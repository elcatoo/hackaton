
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://pkzsk.info/category/news/'; // Замените на URL сайта с новостями вашего города

axios.get(url).then(response => {
    console.log('Страница успешно загружена');
    const html = response.data;
    const $ = cheerio.load(html);
    const data = [];

    $('.vl-post-wrapper').each((i, element) => { // Измените '.news-item' на соответствующий селектор на вашем сайте
        const title = $(element).find('h2').text().trim();
        const summary = $(element).find('a').text().trim();
        const imageUrl = $(element).find('img').attr('src'); // Извлекаем URL изображения

        if (title && summary && imageUrl) {
            console.log(`Title: ${title}`);
            console.log(`Summary: ${summary}`);
            console.log(`Image URL: ${imageUrl}`);
            data.push({ title, summary, imageUrl });

            // Загрузка изображения
            downloadImage(imageUrl, `images/image_${i}.jpg`);
        }
    });

    if (data.length > 0) {
        const { Parser } = require('json2csv');
        const fields = ['title', 'summary', 'imageUrl'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        // Добавление BOM в начало CSV файла для правильного распознавания UTF-8 в Excel
        const csvWithBom = "\uFEFF" + csv;
        fs.writeFile('news.csv', csvWithBom, 'utf8', (err) => {
            if (err) throw err;
            console.log('CSV файл успешно сохранён.');
        });
    } else {
        console.log('Нет данных для сохранения.');
    }
}).catch(err => console.error('Ошибка при загрузке страницы:', err));

function downloadImage(url, filepath) {
    axios({
        url,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath));
        });
    }).then(filepath => console.log(`Изображение сохранено: ${filepath}`))
      .catch(err => console.error(`Ошибка загрузки изображения: ${err}`));
}
