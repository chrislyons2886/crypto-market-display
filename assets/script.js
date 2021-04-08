var amount = JSON.parse(localStorage.getItem('buttonAmount')) + 1
var searchHistory = document.getElementById('searchHistory')
var searchButton = document.getElementById('searchButton')
var searchBar = document.getElementById('searchBar')
var cryptoTitle = document.getElementById('cryptoTitle')
var currentPrice = document.getElementById('currentPrice')
var percentChange = document.getElementById('percentChange')
var searchTerm = localStorage.getItem('lastSearch')
var footersTag = document.getElementById('footerTags')
var count = 0
var myLineChart

$(document).foundation();
if (searchTerm == null) {
    searchTerm = 'bitcoin'
}
var marketInfoUrl = ("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + searchTerm)

// current time function for graph display
var currentTime = moment().format('YYYY-MM-DD')
var currentTimeMinusTen = moment().subtract(10, 'days').format('YYYY-MM-DD')

// get market info
fetch(marketInfoUrl, {
    headers: {
        'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
    }
})
    .then(response => response.json())
    .then(viewMarketData);

// populate box with info
function viewMarketData(data) {
    console.log(data)
    data
    objectId = JSON.parse(Object.keys(data.data))
    cryptoTitle.innerHTML = (data.data[objectId].name)
    percentChange.innerHTML = (data.data[objectId].quote.USD.percent_change_24h + '%')
    // sets percent change red or green
    if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == 1) {
        percentChange.classList.add('percentChangePos')
        percentChange.classList.remove('percentChangeNeg')
    } else if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == -1) {
        percentChange.classList.add('percentChangeNeg')
        percentChange.classList.remove('percentChangePos')
    }
    // rounds to nearest hundredth if above 10 dollars
    if (data.data[objectId].quote.USD.price > 10) {
        roundedPrice = JSON.parse(data.data[objectId].quote.USD.price.toFixed(2)).toLocaleString()
    } else {
        roundedPrice = data.data[objectId].quote.USD.price
    }
    currentPrice.innerHTML = ("Price: $" + roundedPrice)
    currentPrice.innerHTML += ("<br>Symbol: " + data.data[objectId].symbol)
    currentPrice.innerHTML += ("<br>Total Supply: " + data.data[objectId].total_supply)
    var indexAmount = (data.data[objectId].tags).length
    if(indexAmount > 5){
        footersTag.innerHTML = ("Tags: ")
        for (var i = 0; i < 5; i++){
            footersTag.innerHTML += (data.data[objectId].tags[i])
            if(i < 4){
                footersTag.innerHTML += ', '
            }
        }
    } else{
        footersTag.innerHTML = ("Tags: ")
        for (var i = 0; i < indexAmount; i++){
            footersTag.innerHTML += (data.data[objectId].tags[i])
            indexAmount -= 1
            if(i < indexAmount){
                footersTag.innerHTML += ', '
            }
        }
    }


    // fetch 10 days for graph
    fetch('https://upenn-cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/sparkline?key=0ba82a9f9fa85bb428d7659d337cc3d6&ids=' + data.data[objectId].symbol + '&start=' + currentTimeMinusTen + 'T00%3A00%3A00Z&end=' + currentTime + 'T00%3A00%3A00Z')
        .then(response => response.json())
        .then(function produceArray(data) {
            var ctx = document.getElementById('myChart').getContext('2d');
            console.log(data)
            priceArray = data[0].prices
            const labels = [moment().subtract(10, 'days').format('M/DD'), moment().subtract(9, 'days').format('M/DD'), moment().subtract(8, 'days').format('M/DD'), moment().subtract(7, 'days').format('M/DD'), moment().subtract(6, 'days').format('M/DD'), moment().subtract(5, 'days').format('M/DD'), moment().subtract(4, 'days').format('M/DD'), moment().subtract(3, 'days').format('M/DD'), moment().subtract(2, 'days').format('M/DD'), moment().subtract(1, 'days').format('M/DD'), moment().format('M/DD')]

            var chartData = {
                labels: labels,
                datasets: [{
                    label: 'Price',
                    data: [
                        JSON.parse(priceArray[0]),
                        JSON.parse(priceArray[1]),
                        JSON.parse(priceArray[2]),
                        JSON.parse(priceArray[3]),
                        JSON.parse(priceArray[4]),
                        JSON.parse(priceArray[5]),
                        JSON.parse(priceArray[6]),
                        JSON.parse(priceArray[7]),
                        JSON.parse(priceArray[8]),
                        JSON.parse(priceArray[9]),
                        JSON.parse(priceArray[10])],
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };

            if (myLineChart) {
                myLineChart.destroy()
            }

            window.myLineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            ctx.canvas.parentNode.style.height = '100%';
            ctx.canvas.parentNode.style.width = '100%';
        });
    // sets search to memory
    localStorage.setItem('lastSearch', (data.data[objectId].name).toLowerCase())
}

// search button event listener
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    cryptocurrencyCurrency = (searchBar.value).toLowerCase()
    fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency, {
        headers: {
            'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
        }
    })
        .then(response => response.json())
        .then(viewMarketData)
    createButton();
    if (cryptocurrencyCurrency.length < 3) {
        $('#exampleModal1').foundation('open')
    }
    searchBar.value = ''
});

// form event listener
document.addEventListener('submit', function (event) {
    event.preventDefault();
    cryptocurrencyCurrency = (searchBar.value).toLowerCase()
    fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency, {
        headers: {
            'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
        }
    })
        .then(response => response.json())
        .then(viewMarketData)
    createButton();
    if (cryptocurrencyCurrency.length < 3) {
        $('#exampleModal1').foundation('open')
    }
    searchBar.value = ''
});

// populate search history
for (var i = 1; i < amount; i++) {
    newButton = document.createElement('button')
    newButton.classList.add('hollow')
    newButton.classList.add('button')
    newButton.classList.add('buttonStuff')
    childrenNumber = searchHistory.childElementCount + 1;
    newButton.id = ("search" + childrenNumber)
    appendedItem = localStorage.getItem('search' + i)
    newButton.textContent = appendedItem
    searchHistory.appendChild(newButton)
}

// adding buttons to search history
function createButton() {
    newButton = document.createElement('button')
    newButton.classList.add('hollow')
    newButton.classList.add('button')
    newButton.classList.add('buttonStuff')
    buttonAmount = searchHistory.childElementCount + 1;
    newButton.id = ("search" + buttonAmount)
    initialButtonContent = searchBar.value
    buttonContent = initialButtonContent.charAt(0).toUpperCase() + initialButtonContent.slice(1)
    newButton.textContent = buttonContent
    localStorage.setItem(newButton.id, buttonContent)
    localStorage.setItem('buttonAmount', buttonAmount)
    searchHistory.appendChild(newButton)
}

// made search history buttons clickable
searchHistory.addEventListener('click', function (event) {
    event.preventDefault()
    console.log(event.target)
    elementCheck = JSON.stringify(event.target.id)
    console.log(document.getElementById(event.target.id))
    cryptocurrencyCurrency = (document.getElementById(event.target.id).innerHTML).toLowerCase()
    if (elementCheck.includes('search')) {
        fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency, {
            headers: {
                'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
            }
        })
            .then(response => response.json())
            .then(viewMarketData)
    }
})

