    // let productVariables = '';
    // simulate example of updating an existing product with option_prices (reponse come from api call)

    // simulate mock data from api that defines option and option values
    // Define product base price
    export const base_price = null;

    // Mock options data
    export const options = {
        'colour': {
            "label": "Colour",
            "options": ['Blue', 'Red', 'Green', 'Silver']
        },
        'material': {
            "label": "Material",
            "options": ['Wood','Plastic']
        },
        'size': {},
        'diameter': {},
        'length': {
            "label": "Length",
            "options": ["2M", "3M", "4M"]
        },
        'width': {},
        'height': {},
        'depth': {},
        'weight': {},
        'volume': {},
        'style': {},
        'vendor': {},
        'brand': {},
        'finish': {}
    };

    // Existing product data
    export const existing_data = {
        "columns": [
            "colour",
            "material"
        ],
        "prices": {
            "Blue--Wood": "30",
            "Blue--Plastic": "30",
            "Blue--Metal": "30",
            "Red--Wood": "30",
            "Red--Plastic": "30",
            "Red--Metal": "30",
            "Green--Wood": "30",
            "Green--Plastic": "30",
            "Green--Metal": "30"
        },
        "skus": {
            "Blue--Wood": "-",
            "Blue--Plastic": "-",
            "Blue--Metal": "-",
            "Red--Wood": "-",
            "Red--Plastic": "-",
            "Red--Metal": "-",
            "Green--Wood": "-",
            "Green--Plastic": "-",
            "Green--Metal": "-"
        },
        "qty": {
            "Blue--Wood": "",
            "Blue--Plastic": "",
            "Blue--Metal": "",
            "Red--Wood": "",
            "Red--Plastic": "",
            "Red--Metal": "",
            "Green--Wood": "",
            "Green--Plastic": "",
            "Green--Metal": ""
        }
    }


    // Define state/data
    export const data = {
        test_cases: [],
        custom_labels: [],
        standard_labels: [],
        labels: [],
        custom: [],
        standard: [],
        selectizeArr: [],
        productVariables: []
    }