const data = await fetch("https://cdn.jsdelivr.net/gh/zavtracast/geo@master/countries_cities_1000.ru.json").then(r => r.json());
const aaa = await data.json()