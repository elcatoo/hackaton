const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'news.csv';
const jsonFilePath = 'data.json';

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        fs.writeFile(jsonFilePath, JSON.stringify(jsonObj, null, 2), (err) => {
            if (err) throw err;
            console.log('JSON файл успешно сохранён.');
        });
    })
    .catch((err) => {
        console.error('Ошибка конвертации CSV в JSON:', err);
    });
