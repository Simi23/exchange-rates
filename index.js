const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const fetch = require('node-fetch')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})


/*
[
  {
    countries: [
      {
        countryName = "Denmark"
        flagUrl = "url-to-flag"
      },
      ...
    ],
    currencyCode: 'DKK',
    conversionRate: 7.45
  },
  ...
]
*/
app.get('/api/conversionData', async(req, res) => {
    await fetchData()
    const dataCache = await readFile('dataCache.json')
    const countryInfo = await readFile('countryInfo.json')
    let jsonResponse = []
    for (let currencyCode in dataCache.rates) {
        let dataRow = {}
        dataRow.currencyCode = currencyCode
        dataRow.conversionRate = Number(dataCache.rates[currencyCode])
        dataRow.countries = countryInfo[currencyCode]
        jsonResponse.push(dataRow)
    }
    res.send(jsonResponse)
})

app.listen(3000)

async function fetchData() {
    const data = await readFile('dataCache.json')
    const currentDate = getDate()

    if (data.latestFetch === currentDate) {
        return
    }

    const response = await fetch('https://api.exchangeratesapi.io/latest')
    let webData = await response.json()
    webData.latestFetch = currentDate
    await writeFile('dataCache.json', webData)
}

function getDate() {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${yyyy}-${mm}-${dd}`
}

function readFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(`./data/${fileName}`, (err, file) => {
            resolve(JSON.parse(file))
        })
    })
}

function writeFile(fileName, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`./data/${fileName}`, JSON.stringify(data), () => {
            resolve(true)
        })
    })
}