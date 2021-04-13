$(document).foundation();
var search1Bar = document.getElementById('crypto1')
var search2Bar = document.getElementById('crypto2')
var crypto1Title = document.getElementById('crypto1Title')
var crypto2Title = document.getElementById('crypto2Title')
var current1Price = document.getElementById('current1Price')
var current2Price = document.getElementById('current2Price')
var percent1Change = document.getElementById('percent1Change')
var percent2Change = document.getElementById('percent2Change')
var searchTerm = localStorage.getItem('compare1')
var searchForm = document.getElementById('searchForm')
var footers1Tag = document.getElementById('footer1Tags')
var footers2Tag = document.getElementById('footer2Tags')
var count = 0
var myLineChart1
var myLineChart2
var isSymbol = true
var makeButton = true
var current1Name
var current2Name
var current1Symbol
var current2Symbol
var smallHTML1 = document.getElementById('smallHTML1')
var smallHTML2 = document.getElementById('smallHTML2')
var marketInfoUrl = ("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + searchTerm)
var marketInfoUrlSlug = ("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + searchTerm)
var compareButton = document.getElementById('compareButton')
var returnButton = document.getElementById('returnButton')

// if there's no compared search somehow it'll default to bitcoin
if (searchTerm == null) {
    searchTerm = ('Bitcoin').toLowerCase()
}

search1Bar.value = searchTerm

// current time function for graph display
var currentTime = moment().format('YYYY-MM-DD')
var currentTimeMinusTen = moment().subtract(10, 'days').format('YYYY-MM-DD')

//gets current data for html and chart 1
function viewMarketData1(data) {
    console.log(data)
    data
    if (!window.isSmybol) {
        objectId = Object.keys(data.data)
        crypto1Title.innerHTML = (data.data[objectId].name)
        window.current1Name = data.data[objectId].slug
        window.current1Symbol = data.data[objectId].symbol
    } else if (window.isSmybol) {
        objectId = searchTerm.toUpperCase()
        theHtml = Object.keys(data.data)
        crypto1Title.innerHTML = (data.data[theHtml].name)
        window.current1Name = data.data[theHtml].slug
        window.current1Symbol = data.data[theHtml].symbol
    }
    percent1Change.innerHTML = (data.data[objectId].quote.USD.percent_change_24h + '%')
    // sets percent change red or green
    if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == 1) {
        percent1Change.classList.add('percentChangePos')
        percent1Change.classList.remove('percentChangeNeg')
        percent1Change.innerHTML = ('+' + data.data[objectId].quote.USD.percent_change_24h + '%')
        small1HTML.innerHTML = ('24hr')
    } else if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == -1) {
        percent1Change.classList.add('percentChangeNeg')
        percent1Change.classList.remove('percentChangePos')
    }
    small1HTML.innerHTML = ('24hr')
    // rounds to nearest hundredth if above 10 dollars
    if (data.data[objectId].quote.USD.price > 10) {
        roundedPrice = JSON.parse(data.data[objectId].quote.USD.price.toFixed(2)).toLocaleString()
    } else {
        roundedPrice = data.data[objectId].quote.USD.price
    }
    current1Price.innerHTML = ("Price: $" + roundedPrice)
    current1Price.innerHTML += ("<br>Symbol: " + data.data[objectId].symbol)
    current1Price.innerHTML += ("<br>Market Cap: " + (data.data[objectId].quote.USD.market_cap).toLocaleString())
    current1Price.innerHTML += ("<br>Total Supply: " + (data.data[objectId].total_supply).toLocaleString())
    var indexAmount = (data.data[objectId].tags).length
    if (indexAmount > 5) {
        footers1Tag.innerHTML = ("Tags: ")
        for (var i = 0; i < 5; i++) {
            footers1Tag.innerHTML += (data.data[objectId].tags[i])
            if (i < 4) {
                footers1Tag.innerHTML += ', '
            }
        }
    } else {
        footers1Tag.innerHTML = ("Tags: ")
        for (var i = 0; i < indexAmount; i++) {
            footers1Tag.innerHTML += (data.data[objectId].tags[i])
            indexAmount -= 1
            if (i < indexAmount) {
                footers1Tag.innerHTML += ', '
            }
        }
    }


    // fetch 10 days for graph
    fetch('https://upenn-cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/sparkline?key=0ba82a9f9fa85bb428d7659d337cc3d6&ids=' + data.data[objectId].symbol + '&start=' + currentTimeMinusTen + 'T00%3A00%3A00Z&end=' + currentTime + 'T00%3A00%3A00Z')
        .then(response => response.json())
        .then(function produceArray(data) {
            var ctx = document.getElementById('compare1').getContext('2d');
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

            if (myLineChart1) {
                myLineChart1.destroy()
            }

            window.myLineChart1 = new Chart(ctx, {
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
}

//gets current data for html and chart 2
function viewMarketData2(data) {
    console.log(data)
    data
    if (!window.isSmybol) {
        objectId = Object.keys(data.data)
        crypto2Title.innerHTML = (data.data[objectId].name)
        window.current2Name = data.data[objectId].slug
        window.current2Symbol = data.data[objectId].symbol
    } else if (window.isSmybol) {
        objectId = searchTerm.toUpperCase()
        theHtml = Object.keys(data.data)
        crypto2Title.innerHTML = (data.data[theHtml].name)
        window.current2Name = data.data[theHtml].slug
        window.current2Symbol = data.data[theHtml].symbol
    }
    percent2Change.innerHTML = (data.data[objectId].quote.USD.percent_change_24h + '%')
    // sets percent change red or green
    if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == 1) {
        percent2Change.classList.add('percentChangePos')
        percent2Change.classList.remove('percentChangeNeg')
        percent2Change.innerHTML = ('+' + data.data[objectId].quote.USD.percent_change_24h + '%')
        small2HTML.innerHTML = ('24hr')
    } else if (Math.sign(data.data[objectId].quote.USD.percent_change_24h) == -1) {
        percent2Change.classList.add('percentChangeNeg')
        percent2Change.classList.remove('percentChangePos')
    }
    small2HTML.innerHTML = ('24hr')
    // rounds to nearest hundredth if above 10 dollars
    if (data.data[objectId].quote.USD.price > 10) {
        roundedPrice = JSON.parse(data.data[objectId].quote.USD.price.toFixed(2)).toLocaleString()
    } else {
        roundedPrice = data.data[objectId].quote.USD.price
    }
    current2Price.innerHTML = ("Price: $" + roundedPrice)
    current2Price.innerHTML += ("<br>Symbol: " + data.data[objectId].symbol)
    current2Price.innerHTML += ("<br>Market Cap: " + (data.data[objectId].quote.USD.market_cap).toLocaleString())
    current2Price.innerHTML += ("<br>Total Supply: " + (data.data[objectId].total_supply).toLocaleString())
    var indexAmount = (data.data[objectId].tags).length
    if (indexAmount > 5) {
        footers2Tag.innerHTML = ("Tags: ")
        for (var i = 0; i < 5; i++) {
            footers2Tag.innerHTML += (data.data[objectId].tags[i])
            if (i < 4) {
                footers2Tag.innerHTML += ', '
            }
        }
    } else {
        footers2Tag.innerHTML = ("Tags: ")
        for (var i = 0; i < indexAmount; i++) {
            footers2Tag.innerHTML += (data.data[objectId].tags[i])
            indexAmount -= 1
            if (i < indexAmount) {
                footers2Tag.innerHTML += ', '
            }
        }
    }


    // fetch 10 days for graph
    fetch('https://upenn-cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/sparkline?key=0ba82a9f9fa85bb428d7659d337cc3d6&ids=' + data.data[objectId].symbol + '&start=' + currentTimeMinusTen + 'T00%3A00%3A00Z&end=' + currentTime + 'T00%3A00%3A00Z')
        .then(response => response.json())
        .then(function produceArray(data) {
            var ctx = document.getElementById('compare2').getContext('2d');
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

            if (myLineChart2) {
                myLineChart2.destroy()
            }

            window.myLineChart2 = new Chart(ctx, {
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
}

// compare button 
compareButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (search1Bar.value == null || search2Bar == null) {
        $('#exampleModal1').foundation('open')
    } else {
        cryptocurrencyCurrency1 = (search1Bar.value).toLowerCase()
        cryptocurrencyCurrency2 = (search2Bar.value).toLowerCase()
        fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + cryptocurrencyCurrency1, {
            headers: {
                'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
            }
        })
            .then(response => response.json())
            .then(data => data.status.error_code == 400 ? symbolFailSearch1() : (viewMarketData1(data)))

        fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + cryptocurrencyCurrency2, {
            headers: {
                'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
            }
        })
            .then(response => response.json())
            .then(data => data.status.error_code == 400 ? symbolFailSearch2() : (viewMarketData2(data)))
        search1Bar.value = null
        search2Bar.value = null
    }

})

// return to index
returnButton.addEventListener('click', function (event) {
    event.preventDefault()
    location.replace("index.html");
})

// function that runs if search doesnt work with smybol
function symbolFailSearch1() {
    isSymbol = true
    fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency1, {
        headers: {
            'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
        }
    })
        .then(response => response.json())
        .then(data => data.status.error_code !== 0 ? ($('#exampleModal1').foundation('open'), search1Bar.value = '') : (viewMarketData1(data)))
}

// function that runs if search doesnt work with smybol
function symbolFailSearch2() {
    isSymbol = true
    fetch("https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=" + cryptocurrencyCurrency2, {
        headers: {
            'X-CMC_PRO_API_KEY': '0d988832-1590-4519-98f1-15ce91046756'
        }
    })
        .then(response => response.json())
        .then(data => data.status.error_code !== 0 ? ($('#exampleModal1').foundation('open'), search2Bar.value = '') : (viewMarketData2(data)))
}