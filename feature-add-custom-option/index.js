// let productVariables = '';
// simulate example of updating an existing product with option_prices (reponse come from api call)

// simulate mock data from api that defines option and option values

// Mock options data
const options = {
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

const base_price = null;

// Define state/data

const data = {
    custom_labels: [],
    standard_labels: [],
    labels: [],
    custom: [],
    standard: []
}


const combinations = function(array) {
    let final = [];

    console.log(array);
    // const arg = arguments;
    // const max = arg.length - 1;
    const newArr = array.map(el => el.options);
    const max = array.length - 1;

    const permutations = (arr, i) => {

        for (var j = 0; j < newArr[i].length; j++) {
            let a = [...arr]; // cloning to the new array

            a.push(newArr[i][j]);
            if (i == max) {
                final.push(a);
            } else {
                permutations(a, i + 1);
            }
        }

    }

    permutations([], 0);
    return final;
}

const optionsToJson = function(data) {
    const labels = data[0];
    const output = data.slice(1).map(item => item.reduce((obj, val, index) => {
        obj[labels[index]] = val;
        return obj;
    }, {}))

    return output;
}

const renderCombinations = function(productVariables) {

    // Create all possible combinations and store it here
    const combinationsArr = combinations(productVariables);
    const productLabels = productVariables.map(el => el.label.toLowerCase());
    const output = document.querySelector('#output');
    const basePriceBtn = document.querySelector('#base-price');

    // Empty the HTML if there's data
    output.innerHTML = '';

    let countCombination = 0;
    if (combinationsArr.length > 1) {
        combinationsArr.map(c => {

            let combination = [];
            c.forEach(newEl => {
                combination.push(newEl);
            });

            countCombination++;
            $('#output').append(`
                <tr id="row-${countCombination}" class="row-variables">
                ${combination.map
                    ((c,i) => {
                        return `<td data-field="variables" data-option="${c}" data-label="${productLabels[i]}" id="${countCombination}" contenteditable="true">${c}</td>`
                    })
                }
            
                <td class="text-center">
                    <input type="text" name="sku" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                </td>
                <td class="text-center">
                    <input type="text" name="inventory" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                </td>
                <td class="text-center">
                    <input type="number" name="price" value="${basePriceBtn.value}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                </td>
                <td>
                    <input type="checkbox" name="more-prices" class="ui-input-checkbox ui-body-inherit ui-corner-all ui-shadow-inset">
                </td>
                
            </tr>  
            `);

            const priceRow = document.createElement('tr');
            const priceData = document.createElement('td');
            const priceDiv = document.createElement('div');
            priceDiv.id = 'inner-prices';
            priceDiv.style.display = 'none';
            priceData.appendChild(priceDiv);
            for (i = 0; i < productVariables.length + 2; i++) {
                priceRow.appendChild(document.createElement('td'));
            }

            priceRow.setAttribute('data-row', countCombination);
            for (let i = 2; i < 11; i++) {
                let tempInput = document.createElement('input');
                tempInput.setAttribute('placeholder', `Price ${i}`);
                tempInput.className = 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset';
                tempInput.name = `price_${i}`;
                tempInput.type = 'number';
                // $(tempInput).hide();

                priceDiv.appendChild(tempInput);
            }
            priceRow.appendChild(priceData);

            document.getElementById('output').appendChild(priceRow);

            const btnGenerate = document.querySelector('#btn-generate');
            if (btnGenerate.hasAttribute('disabled')) {
                btnGenerate.removeAttribute('disabled')
            }
        })

        let varCount = 0;
        setTimeout(() => {



            document.querySelectorAll('input[name="more-prices"]').forEach(prices => {


                prices.addEventListener('change', function (e) {
                    if (this.checked) {
                        // Count foreach iterations and use them in assigning id's
                        varCount++;

                        $(this.parentElement.parentElement.nextElementSibling.querySelector('td:last-child > div')).hide().slideDown();
                    } else {
                        $(this.parentElement.parentElement.nextElementSibling.querySelector('td:last-child > div')).show().slideUp();
                    }
                })
            });
        }, 0);

        document.querySelector('#btn-generate').addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('input[name="sku"]').forEach((el, index) => {
                el.value = new Date().getTime() + index;
            })
        })

        output.innerHTML += '<button value="Autogenerate" id="submit-prices" data-theme="a" class="ui-btn ui-btn-b ui-shadow ui-corner-all" id="btn-generate"><span>Submit Prices</button>';

        document.querySelector('#submit-prices').addEventListener('click', e => {

            const basePriceBtn = document.querySelector('#base-price');
            const rows = document.querySelectorAll('table#tab_logic tbody tr.row-variables');

            const skus = [];
            const obj = [];
            const prices = [];
            const inventories = [];

            rows.forEach(row => {
                const allVariables = Array.from(row.querySelectorAll('td[data-field="variables"]')).map(el => {
                    return el.innerText
                })

                const sku = row.querySelector('input[name="sku"]').value;
                const inventory = row.querySelector('input[name="inventory"]').value;
                let price;
                let newObj = {};
                if (row.querySelector('input[name="more-prices"]').checked) {
                    let it = 0;
                    newObj['price_1'] = row.querySelector('input[name="price"]').value;
                    price = Array.from(row.nextElementSibling.querySelectorAll('#inner-prices input')).map(el => {
                        it++;
                        if (el.value != null && el.value != '') {
                            newObj['price_' + (it + 1)] = el.value;
                        }
                    })
                    price = newObj;
                } else {
                    price = row.querySelector('input[name="price"]').value;
                }

                obj.push(allVariables);
                prices.push(price || base_price);
                inventories.push(inventory);
                skus.push(sku || '-');
            })

            // console.log(obj);

            const finalJson = {
                // columns: data_values,
                prices: toJSON(obj, prices),
                skus: toJSON(obj, skus),
                qty: toJSON(obj, inventories)
            }

            document.querySelector('#json-output').value = JSON.stringify(finalJson, null, "\t");

        })
    } else {
        document.querySelector('#btn-generate').setAttribute('disabled', true);
        document.querySelector('#tab_logic').style.display = 'none';
    }
                
}

const toJSON = function(arr, values) {
    const variables = {};

    arr.map((el, index) => {
        const combination = [];

        el.forEach(newEl => {
            combination.push(newEl);
        });
        const currComb = combination.join('--');
        variables[currComb] = values[index];
    })
    return variables;
}

const showMorePrices = function() {

}

const capitalizeFirst = function(string) {
    const firstLetter = string.split('')[0].toUpperCase();
    return firstLetter + string.split('').splice(1).join('');
}

const removeHeaders = function() {
    // Set data labels object as null
    // data.custom[currentElement].label = newLabel; 
    // Get all headers
    const theaders = document.querySelectorAll('.th-title');

    // Remove all table headers for rerender
    if(theaders.length != 0) {
        Array.from(theaders).map(t => {
            t.parentNode.removeChild(t);
        })
    }

}

const renderHeaders = function(currentElement = '', newLabel = '') {

    if(currentElement != '') {
        // Pass inner text - currentELement
        let cur = data.labels.findIndex(el => el == currentElement);
        if(cur != -1) {
            console.log(cur, data.labels[cur]);
            data.labels[cur] = newLabel;
            console.log(data.labels);
        }

            // Change data
        removeHeaders();

        // Reversing and showing the labels as table header to be in order that they show up
        data.labels.map((label, i) => {
            if(!document.querySelector(`.header-${label.toLowerCase()}`)) {
                const th = document.createElement('th');
                th.className = 'th-title header-' + label.toLowerCase();
                th.setAttribute('data-header', label.toLowerCase());
                th.innerText = label;
                const thead = document.querySelector('table thead tr');
                thead.insertBefore(th, thead.childNodes[0]);
            } 
        })

        // Create new array from current table header names
        let thTitles = Array.from(document.querySelectorAll('.th-title')).map(th => th.getAttribute('data-header'));

        // Create labels array copy with lowercase for comparing
        const labelsLower = data.labels.map(l => l.toLowerCase());

        thTitles.map(t => {
            // Remove table headers that don't have any values
            if(!labelsLower.includes(t.toLowerCase())) {
                const elem = document.querySelector('.header-' + t.toLowerCase());
                elem.parentNode.removeChild(elem);
            }
        })

    } else {
    // Change data
        removeHeaders();

        // Reversing and showing the labels as table header to be in order that they show up
        data.labels.reverse().map((label, i) => {
            if(!document.querySelector(`.header-${label.toLowerCase()}`)) {
                const th = document.createElement('th');
                th.className = 'th-title header-' + label.toLowerCase();
                th.setAttribute('data-header', label.toLowerCase());
                th.innerText = label;
                const thead = document.querySelector('table thead tr');
                thead.insertBefore(th, thead.childNodes[0]);
            } 
        })

        // Create new array from current table header names
        let thTitles = Array.from(document.querySelectorAll('.th-title')).map(th => th.getAttribute('data-header'));

        // Create labels array copy with lowercase for comparing
        const labelsLower = data.labels.map(l => l.toLowerCase());

        thTitles.map(t => {
            // Remove table headers that don't have any values
            if(!labelsLower.includes(t.toLowerCase())) {
                const elem = document.querySelector('.header-' + t.toLowerCase());
                elem.parentNode.removeChild(elem);
            }
        })

    }
    // let difference = arr1.filter(x => !arr2.includes(x));


    console.log(data.labels);
}

const productTags = function() {
    const optionForm = document.querySelectorAll('.input_options');
    let site_option_values = {};
        
    Array.from(optionForm).map(o => {

        const uniq = o.querySelector('div').getAttribute('data-field');
        const uniqueLabel = uniq == 'length' ? 'length-value' : uniq;
        const label = o.querySelector('label');

        // Define custom and standard options labels;
        const options = o.querySelector('input').value;

        if(label && options != '') {

            // separate site option values from two - regular ones and custom options
            if(label.getAttribute('data-format') == 'standard') {
                data.standard_labels.push(uniqueLabel);
                data.standard[uniqueLabel] = {
                    unique: uniqueLabel,
                    label: o.querySelector('label[data-format="standard"]').innerText,
                    options: options.split(',')
                }
            } else {
                data.custom_labels.push(uniqueLabel);
                data.custom[uniqueLabel] = {
                    unique: uniqueLabel,
                    label: o.querySelector('label[data-format="custom"]').innerText,
                    options: options.split(',')
                }
            }

            site_option_values[uniqueLabel.toLowerCase()] = {
                'label': label,
                'options': options.split(',')
            }
        }   
    })

    console.log(data);

    // document.querySelector('#json-output').value = JSON.stringify(site_option_values, null, "\t");

    return JSON.stringify(site_option_values, null, "\t");
}

$(document).ready(async function () {
    // const res = await fetch('http://localhost:4400/product_data');
    // const data = await res.json();

    // Mock data response (change to json api url)
    const responseData = options;
    const formOutput = document.querySelector('#form-output');
    const data_values = Object.keys(responseData);

    // Define index for options map
    let tempValue = 0;

    // Map through options and generate the fields dynamically
    Object.entries(responseData).map(options => {
        formOutput.innerHTML += `
            <div class="ui-field-contain input_options">
                <label data-format="standard" for="${options[0]}">${options[0].toUpperCase()}</label>
                <div data-field="${options[0]}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    <input name='${options[0]}' id="${options[0]}">
            </div>
        `;

        let newOptions;
        if(!Object.entries(options[1]).length == 0) {
            newOptions = options[1].options.map(el => {
                return {
                    value: el
                }
            })
        }

        // Add selectize tags to every iteration
        // Set timeout is waiting for element to initialize
        setTimeout(() => {
            $(`input[name="${options[0]}"`).selectize({
                delimiter: ',',
                options: newOptions,
                valueField: 'value',
                labelField: 'value',
                searchField: 'value',
                persist: false,
                create: true
            })
        }, 1)
    });

    let dataValue = 0;

    // New custom option event listener
    document.querySelector('#btn-add-new').addEventListener('click', e => {
        dataValue++;

        if(dataValue <= 10) {
            $('.custom-options').append(`
            <div class="ui-field-contain input_options">
                <label data-format="custom" for="option_${dataValue}" contenteditable="true">Option ${dataValue}</label>
                <div data-field="option_${dataValue}" data-value="${dataValue}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    <input name='${dataValue}'>
            </div>
        `)

        setTimeout(() => {
            $(`div[data-value="${dataValue}"] input`).selectize({
                delimiter: ',',
                create: true,
                loadThrottle: 100
            });
        }, 0)
        } else {
            $('.output-message').innerText = 'Can\'t add more than 10 custom options';
        }

        let firstValue = [];

        $("label[contenteditable]").on("keydown",function(e){
            var key = e.keyCode || e.charCode;  // ie||others
            firstValue.push($(this)[0].innerText);

            if(key == 13) {
                e.preventDefault();
                renderHeaders(`${firstValue[0].replace(/\s/g, '-')}`, $(this)[0].innerText.replace(/\s/g, '-'));

                $(this).blur();  // lose focus
            } 


        });
    });


    document.querySelector('.form-submit').addEventListener('click', e => {
        e.preventDefault();

        document.querySelector('#site_options').innerHTML = productTags();

        // Remove any labels from before
        data.labels = [];

        // Show table on submit
        document.querySelector('#tab_logic').style.display = 'table';

        // Declare empty variables where we store variables for table show
        const productVariables = [];

        Array.from(document.querySelectorAll('.input_options')).map(input => {
            
            let label = input.querySelector('label').innerText;
            label = label.replace(/\s/gi, '-');

            const inputField = input.querySelector('input');
            
            if(inputField.value != '') {
                data.labels.push(label);
                productVariables.push({
                    label,
                    options: inputField.value.split(',')
                });
            }
        })

        // Object.entries(data).map(val => {
        //     // Checking if the values have entries
        //     if(document.querySelector(`input[name="${val[0]}"`).value != '') {
        //         // Pushing the labels for listing
        //         labels.push(val[1].label || capitalizeFirst(val[0]));

        //         // Pushing product variables 
        //         productVariables.push(document.querySelector(`input[name="${val[0]}"]`).value.split(','));
        //     }
        // })

        if(productVariables.length > 0) {
            renderHeaders();

            // Render combinations
            renderCombinations(productVariables);
    
            document.querySelectorAll('td[data-field="variables"]').forEach(el => {
                $(el).on("keydown", function(e) {
    
                    var key = e.keyCode || e.charCode;  // ie||others
                    // if enter is pressed
                    if(key == 13) {
                        e.preventDefault();
    
                        const currentLabel = $(this)[0].getAttribute('data-label')
                        const currentOption = $(this)[0].getAttribute('data-option')
                        console.log($(`td[data-label="${currentLabel}"][data-option="${currentOption}"]`));
                        document.querySelectorAll(`td[data-label="${currentLabel}"][data-option="${currentOption}"]`).forEach(el => {
                            console.log(el);
                            el.innerText = this.innerText;
                            el.setAttribute('data-option', this.innerText);
                        })
                    } 
                })
            });
        }

        
    })

});