const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = './introducirArchivos/archivo.csv'
const json = JSON.parse(fs.readFileSync('./introducirArchivos/categories.json'))


// Formating numbers
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function formatNumber(numero) {
    let newNumber = numero.replaceAll('.', '')
    let newNumber2 = newNumber.replaceAll(',', '.')
    return newNumber2

}


// Object constructor of json
class categories {
    constructor(json) {
        this.json = json.categories;
    }
    get car() {
        let carT = parseFloat((this.json.car).replace('%', '')) * 0.01;
        return carT;
    }
    get outlet() {
        let outletT = parseFloat((this.json.outlet).replace('%', '')) * 0.01;
        return outletT;
    }
    get bargain() {
        let bargainT = (this.json.bargain).replace('%', '');
        let bargainT2 = parseFloat((bargainT).replace('-1€', '') * 0.01)
        return bargainT2

    }
    get home() {
        let homeT = (this.json.home).replace('%', '');
        let homeT2 = parseFloat((homeT).replace('+3€', '') * 0.01)
        return homeT2
    }
    get music() {
        let musicT = parseFloat((this.json.music).replace('%', '')) * 0.01;
        return musicT;
    }
    get mobile() {
        let mobileT = parseFloat((this.json.mobile).replace('%', '')) * 0.01;
        return mobileT
    }
    get others() {
        let othersT = parseFloat((this.json['*']).replace('%', '')) * 0.01;
        return othersT
    }
}

const categories1 = new categories(json);


// transforming CSV to JSON

csv({
        noheader: false,
        delimiter: ";"
    })
    .fromFile(csvFilePath)
    .then((result) => {
        // iterating and transforming the results with JSON's conditions
        let FinalResult = {
            "car": 0,
            "mobile": 0,
            "outlet": 0,
            "bargain": 0,
            "home": 0,
            "music": 0,
            "mobile": 0,
            "*": 0
        }

        result.forEach(function(e) {
            let cat = e.CATEGORY;
            let cost = parseFloat(formatNumber(e.COST.replace("€", "")));
            let quantity = parseInt(formatNumber(e.QUANTITY));
            let costPrice = cost * quantity
                // conditions 
            switch (cat) {
                case 'car':
                    let salesPriceC = cost * (categories1.car + 1) * quantity
                    let carBenefits = (salesPriceC - costPrice).toFixed(2)
                    FinalResult.car += parseFloat(carBenefits)
                    break;

                case ('mobile'):
                    let salesPriceMo = cost * (categories1.mobile + 1) * quantity
                    let mobileBenefits = (salesPriceMo - costPrice).toFixed(2)
                    FinalResult.mobile += parseFloat(mobileBenefits)
                    break;

                case 'music':
                    let salePriceMu = cost + (categories1.music + 1) * quantity
                    let musicBenefits = (salePriceMu - costPrice).toFixed(2)
                    FinalResult.music += parseFloat(musicBenefits)
                    break;

                case 'outlet':
                    let salePriceO = cost * (categories1.outlet + 1) * quantity
                    let outletBenefits = (salePriceO - costPrice).toFixed(2)
                    FinalResult.outlet += parseFloat(outletBenefits)
                    break;

                case 'home':
                    let salePriceH = ((cost + 3) * (categories1.home + 1)) * quantity
                    let homeBenefits = (salePriceH - costPrice).toFixed(2)
                    FinalResult.home += parseFloat(homeBenefits)
                    break;

                case 'bargain':
                    let salePriceB = ((cost * (categories1.bargain + 1)) - 1) * quantity
                    let bargainBenefits = (salePriceB - costPrice).toFixed(2)
                    FinalResult.bargain += parseFloat(bargainBenefits)
                    break;

                default:
                    let priceWithPercentD = cost * (categories1.others + 1) * quantity
                    let defaultBenefits = (priceWithPercentD - costPrice).toFixed(2)
                    FinalResult['*'] += parseFloat(defaultBenefits)
                    break;
            }
        })
        console.log(FinalResult)
    })