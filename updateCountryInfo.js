const fetch = require('node-fetch')
const fs = require('fs')

function main() {
  let countryFlags = {}
  fs.readFile('./data/dataCache.json', async (err, file) => {
    const data = JSON.parse(file)
    for(let key in data.rates) {
      const response = await fetch(`https://restcountries.eu/rest/v2/currency/${key}`)
      const data = await response.json()
      for(let index = 0; index < data.length; index++) {
        console.log(`Resolved ${data[index].name}`)
        if(countryFlags[key] == undefined) countryFlags[key] = []
        const objectToPush = {
          flagUrl: data[index].flag,
          countryName: data[index].name
        }
        countryFlags[key].push(objectToPush)
      }
    }
    fs.writeFile('./data/countryInfo.json', JSON.stringify(countryFlags), _ => {
      console.log('Gathering data successful.')
    })
  })
}

main()