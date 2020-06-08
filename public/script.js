let state = {
    currencyData: {},
    sortBy: '',
    sortAsc: true
}

async function fetchCurrencies() {
    const data = await getData('/api/conversionData')
    state.currencyData = data
    populateCurrencyArea()
    assignSortHandlers()
}
window.onload = fetchCurrencies

let htmlArea = document.getElementById('currency-table')

async function populateCurrencyArea() {
    let htmlText = ``
    for (let i = 0; i < state.currencyData.length; i++) {
        const dataRow = state.currencyData[i]
        let countries = ''
        for (let j = 0; j < dataRow.countries.length; j++) {
            const country = dataRow.countries[j]
            countries += generateImgTag(country.countryName, country.flagUrl)
        }

        htmlText += `
    <tr>
      <td>${countries}</td>
      <td>${dataRow.currencyCode}</td>
      <td class="bold">${dataRow.conversionRate}</td>
    </tr>
    `
    }
    htmlArea.innerHTML = htmlText
}

function generateImgTag(countryName, flagUrl) {
    return `
  <img src="${flagUrl}" width="20">
  <span class="country-name">${countryName}</span><br>
  `
}

async function getData(route) {
    const response = await fetch(route)
    const data = await response.json()
    return data
}

function assignSortHandlers() {
    const tableHeaders = document.querySelectorAll('#currencies-area th')
    for (let i = 0; i < tableHeaders.length; i++) {
        const element = tableHeaders[i];
        element.addEventListener('click', () => {
            setSortCriteria(element.dataset.sortName)
            clearSortClasses()
            addClass(element, state.sortAsc ? 'sortasc' : 'sortdesc')
            sortState()
            populateCurrencyArea()
        })
    }
}

function setSortCriteria(sortBy) {
    if (state.sortBy === sortBy) {
        state.sortAsc = !state.sortAsc
        return
    }
    state.sortBy = sortBy
    state.sortAsc = true
}

function sortState() {
    switch (state.sortBy) {
        case 'country':
            state.currencyData.sort((a, b) => {
                const nameA = a.countries[0].countryName.toUpperCase() // ignore upper and lowercase
                const nameB = b.countries[0].countryName.toUpperCase() // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }

                return 0
            })
            break
        case 'curr-code':
            state.currencyData.sort((a, b) => {
                const nameA = a.currencyCode.toUpperCase() // ignore upper and lowercase
                const nameB = b.currencyCode.toUpperCase() // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }

                return 0
            })
            break
        case 'conv-rate':
            state.currencyData.sort((a, b) => {
                return a.conversionRate - b.conversionRate
            })
            break
        default:
            break
    }
    if (!state.sortAsc) state.currencyData.reverse()
}

function clearSortClasses() {
    const tableHeaders = document.querySelectorAll('#currencies-area th')
    for (let i = 0; i < tableHeaders.length; i++) {
        const element = tableHeaders[i];
        removeClass(element, 'sortasc')
        removeClass(element, 'sortdesc')
    }
}

function addClass(element, className) {
    // arr = element.className.split(" ");
    // if (arr.indexOf(name) == -1) {
    //   element.className += " " + className;
    // }
    element.classList.add(className)
}

function removeClass(element, className) {
    // const regex = new RegExp(`\\b${className}\\b`, 'g') 
    // element.className = element.className.replace(regex, "");
    element.classList.remove(className)
}