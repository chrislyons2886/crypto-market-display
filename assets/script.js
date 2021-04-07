var amount = JSON.parse(localStorage.getItem('buttonAmount')) + 1
var searchHistory = document.getElementById('searchHistory')
var searchButton = document.getElementById('searchButton')
var searchBar = document.getElementById('searchBar')
var cryptoTitle = document.getElementById('cryptoTitle')
var currentPrice = document.getElementById('currentPrice')
var percentChange = document.getElementById('percentChange')
var searchTerm = localStorage.getItem('lastSearch')
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

    // fetch 10 days for graph
    fetch('https://upenn-cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/sparkline?key=0ba82a9f9fa85bb428d7659d337cc3d6&ids=' + data.data[objectId].symbol + '&start=' + currentTimeMinusTen + 'T00%3A00%3A00Z&end=' + currentTime + 'T00%3A00%3A00Z')
    .then(response => response.json())
    .then(function produceArray(data){
        console.log(data)
        priceArray = data[0].prices

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        
        // google charts
        function drawChart() {
          var currentData = google.visualization.arrayToDataTable([
            ['Day', 'Price'],
            [moment().subtract(10, 'days').format('M/DD'),  JSON.parse(priceArray[0])],
            [moment().subtract(9, 'days').format('M/DD'),  JSON.parse(priceArray[1])],
            [moment().subtract(8, 'days').format('M/DD'),  JSON.parse(priceArray[2])],
            [moment().subtract(7, 'days').format('M/DD'),  JSON.parse(priceArray[3])],
            [moment().subtract(6, 'days').format('M/DD'),  JSON.parse(priceArray[4])],
            [moment().subtract(5, 'days').format('M/DD'),  JSON.parse(priceArray[5])],
            [moment().subtract(4, 'days').format('M/DD'),  JSON.parse(priceArray[6])],
            [moment().subtract(3, 'days').format('M/DD'),  JSON.parse(priceArray[7])],
            [moment().subtract(2, 'days').format('M/DD'),  JSON.parse(priceArray[8])],
            [moment().subtract(1, 'days').format('M/DD'),  JSON.parse(priceArray[9])],
            [moment().format('M/DD'),  JSON.parse(priceArray[10])]
          ]);
        
          var options = {
            title: cryptoTitle.innerHTML,
            titleTextStyle: {fontSize: 30, bold: true},
            curveType: 'function',
            legend: { position: 'none' },
            vAxis:  { format: 'currency' },
            width : '100%',
            height : '100%'
          };
        

          var chart = new google.visualization.LineChart(document.getElementById('rightBox'));
        
          chart.draw(currentData, options);
          
          $(window).smartresize(function () {
            chart.draw(currentData, options);
            });
        }
    });
    // sets search to memory
    localStorage.setItem('lastSearch', (data.data[objectId].name).toLowerCase())
}

// search button event listener
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    cryptocurrencyCurrency = searchBar.value
    fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency, {
        headers: {
            'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
        }
    })
        .then(response => response.json())
        .then(viewMarketData)
    createButton();
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
    searchBar.value = ''
});

// populate search history
for (var i = 1; i < amount; i++) {
    newButton = document.createElement('button')
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