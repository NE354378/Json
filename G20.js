var readline = require('readline');
var fs = require('fs');
var lineReader = readline.createInterface({
  input: fs.createReadStream('G20.csv')
});

var country;
var population_13, population_10;
var gdp_13, gdp_10;
var purchasing_13, purchasing_10;
var country_index;
var population13_index;
var population10_index;
var gdp13_index;
var gdp10_index;
var purchase13_index;
var purchase10_index;
var netpopulation;
var netpurchasepower;
var index, limitpop, limitgdp;
var i = 0,
  j;
var population_array = [];
var gdp_array = [];
var purchase_array = [];
var growth_array = [];
var asia = ['China', 'India', 'Indonesia', 'Japan', 'Saudi Arabia', 'Republic of Korea'];
var africa = ['South Africa'];
var australia = ['Australia'];
var europe = ['France', 'Germany', 'Italy', 'Russia', 'Turkey', 'United Kingdom', 'European Union'];
var northAmerica = ['Canada', 'Mexico', 'USA'];
var southAmerica = ['Argentina', 'Brazil'];
var aggregate = [];
var arrPopulation = [0, 0, 0, 0, 0, 0];
var arrGDP = [0, 0, 0, 0, 0, 0];
var continents = ['Asia', 'Africa', 'Australia', 'Europe', 'North America', 'South America'];

function population_sort(country, population_13) {
  this.country = country;
  this.population_13 = population_13;
}

function gdp_sort(country, gdp_13) {
  this.country = country;
  this.gdp_13 = gdp_13;
}

function purchase_sort(country, purchasing_13) {
  this.country = country;
  this.purchasing_13 = purchasing_13;
}

function growth(country, netpopulation, netpurchasepower) {
  this.country = country;
  this.netpopulation = netpopulation;
  this.netpurchasepower = netpurchasepower;
}

function aggregate_all(continents, arrPopulation, arrGDP) {
  this.continent = continents;
  this.population = arrPopulation;
  this.gdp = arrGDP;
}

lineReader.on('line', function(line) {
  var record = line.split(',');
  if (i < 1) {
    country_index = record.indexOf('Country Name');
    console.log(country_index);
    population13_index = record.indexOf('Population (Millions) 2013');
    population10_index = record.indexOf('Population (Millions) 2010');
    console.log(population10_index);
    gdp13_index = record.indexOf('GDP Billions (USD) 2013');
    gdp10_index = record.indexOf('GDP Billions (USD) 2010')
    purchase13_index = record.indexOf('Gross domestic product based on Purchasing-Power-Parity (PPP) valuation of Country GDP in Billions (Current International Dollar) 2013')
    purchase10_index = record.indexOf('Gross domestic product based on Purchasing-Power-Parity (PPP) valuation of Country GDP in Billions (Current International Dollar) 2010')
    i++;
  } else {
    country = record[country_index];
    population_13 = record[population13_index];
    population_10 = record[population10_index];
    gdp_13 = record[gdp13_index];
    gdp_10 = record[gdp10_index];
    purchasing_13 = record[purchase13_index];
    purchasing_10 = record[purchase10_index];
    netpopulation = (parseFloat(population_13) * 1000) - (parseFloat(population_10) * 1000);
    netpurchasepower = parseFloat(purchasing_13) - parseFloat(purchasing_10);

    population_array.push(new population_sort(country, population_13));
    population_array.sort(function(a, b) {
      return parseFloat(b.population_13) - parseFloat(a.population_13);
    });

    gdp_array.push(new gdp_sort(country, gdp_13));
    gdp_array.sort(function(a, b) {
      return parseFloat(b.gdp_13) - parseFloat(a.gdp_13);
    });

    purchase_array.push(new purchase_sort(country, purchasing_13));
    purchase_array.sort(function(a, b) {
      return parseFloat(b.purchasing_13) - parseFloat(a.purchasing_13);
    });

    growth_array.push(new growth(country, netpopulation, netpurchasepower));

    initpop = parseInt(population10_index);
    initgdp = parseInt(gdp10_index);

    limitpop = population10_index + parseInt(6);
    limitgdp = gdp10_index + parseInt(6);

    for (index = initpop; index < limitpop; index++) {
      if (asia.includes(country)) {
        arrPopulation[0] = parseFloat(arrPopulation[0]) + parseFloat(record[initpop]);
      } else if (africa.includes(country)) {
        arrPopulation[1] = parseFloat(arrPopulation[1]) + parseFloat(record[initpop]);
      } else if (australia.includes(country)) {
        arrPopulation[2] = parseFloat(arrPopulation[2]) + parseFloat(record[initpop]);
      } else if (europe.includes(country)) {
        arrPopulation[3] = parseFloat(arrPopulation[3]) + parseFloat(record[initpop]);
      } else if (northAmerica.includes(country)) {
        arrPopulation[4] = parseFloat(arrPopulation[4]) + parseFloat(record[initpop]);
      } else if (southAmerica.includes(country)) {
        arrPopulation[5] = parseFloat(arrPopulation[5]) + parseFloat(record[initpop]);
      }
    }

    for (index = initgdp; index < limitgdp; index++) {
      if (asia.includes(country)) {
        arrGDP[0] = parseFloat(arrGDP[0]) + parseFloat(record[initgdp]);
        //  console.log(arrGDP[0]);
      } else if (africa.includes(country)) {
        arrGDP[1] = parseFloat(arrGDP[1]) + parseFloat(record[initgdp]);
      } else if (australia.includes(country)) {
        arrGDP[2] = parseFloat(arrGDP[2]) + parseFloat(record[initgdp]);
      } else if (europe.includes(country)) {
        arrGDP[3] = parseFloat(arrGDP[3]) + parseFloat(record[initgdp]);
      } else if (northAmerica.includes(country)) {
        arrGDP[4] = parseFloat(arrGDP[4]) + parseFloat(record[initgdp]);
      } else if (southAmerica.includes(country)) {
        arrGDP[5] = parseFloat(arrGDP[5]) + parseFloat(record[initgdp]);
      }
    }
  }
  });
    lineReader.on("close", function() {
    for (j = 0; j < 6; j++)
    {
      aggregate.push(new aggregate_all(continents[j], arrPopulation[j], arrGDP[j]));
    }
    fs.writeFileSync("aggregate.json", JSON.stringify(aggregate), encoding = "UTF8");
    fs.writeFileSync("population.json", JSON.stringify(population_array), encoding = "UTF8");
    fs.writeFileSync("gdp.json", JSON.stringify(gdp_array), encoding = "UTF8");
    fs.writeFileSync("purchase-pow.json", JSON.stringify(purchase_array), encoding = "UTF8");
    fs.writeFileSync("growth.json", JSON.stringify(growth_array), encoding = "UTF8");
});
