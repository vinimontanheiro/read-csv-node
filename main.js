const csv = require('async-csv');
const fs = require('fs').promises;
const path = require('path');
const { getDynamoDBDocumentClient } = require(`./aws`);

const addCities = async () => {
  try {
    console.log(__dirname);
    const PATH = path.resolve('./file.csv');
    console.log(`#################### path > `);
    console.log(PATH);
    const csvString = await fs.readFile(PATH, 'utf-8');
    console.log(`################# csvString `);
    console.log(csvString);
    const rows = await csv.parse(csvString);
    console.log(`################# rows `);

    console.log(rows);

    const docClient = await getDynamoDBDocumentClient();

    const cities = rows.reduce((acc, row) => {
      if (row && !!row.length) {
        const [idCityIbge, uf, name] = row;
        return [
          ...acc,
          ...[{
            idCityIbge,
            uf,
            name
          }]
        ];
      }
      return acc;
    }, []);

    console.log(`cities >>> `, cities.length);

    const promisses = [];

    for (let index = 0; index < cities.length; index++) {
      const city = cities[index];

      console.log(`city >> `, index);

      const { idCityIbge, uf, name } = city;
      const params = {
        TableName: `KomecoIotPlatformTableStack32-CityTableAE3FD0E5-1XHOZTLP9IWZT`,
        Item: {
          idCityIbge,
          uf,
          name
        },
      };
      promisses.push(docClient.put(params).promise());
    }


    console.log(`promisses >> `, promisses.length);


    if (promisses.length) {
      const result = await Promise.all(promisses);
      console.log(`result >>> `, result);
    }

  } catch (error) {
    console.log(error);
  }
}

addCities();