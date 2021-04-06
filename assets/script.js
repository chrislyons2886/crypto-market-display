fetch('https://upenn-cors-anywhere.herokuapp.com/https://api.nomics.com/v1/markets?key=0ba82a9f9fa85bb428d7659d337cc3d6')
.then(response => response.json())
.then(data => console.log(data));

fetch('https://upenn-cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=50',{
    headers:{
        'X-CMC_PRO_API_KEY':'0d988832-1590-4519-98f1-15ce91046756'
    }
})
.then(response => response.json())
.then(data => console.log(data));