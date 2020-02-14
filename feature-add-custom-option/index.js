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

function combinations() {
    let final = [];

    const arg = arguments;
    const max = arg.length - 1;

    const permutations = (arr, i) => {

        for (var j = 0; j < arg[i].length; j++) {
            let a = [...arr]; // cloning to the new array

            a.push(arg[i][j]);
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

function optionsToJson(data) {
    const labels = data[0];
    const output = data.slice(1).map(item => item.reduce((obj, val, index) => {
        obj[labels[index]] = val;
        return obj;
    }, {}))

    return output;
}

function toJSON(arr, values) {
    const variables = {};

    arr.map((el, index) => {
        const combination = [];

        el.forEach(newEl => {
            combination.push(newEl);
        });
        const currComb = combination.join('--');
        variables[currComb] = values[index];
    })
    console.log(variables);
    return variables;
}

function showMorePrices() {

}

function capitalizeFirst(string) {
    const firstLetter = string.split('')[0].toUpperCase();
    return firstLetter + string.split('').splice(1).join('');
}

function productTags() {
    const optionForm = document.querySelectorAll('.input_options');
    let site_option_values = {};
        
    Array.from(optionForm).map(o => {
        // let field = o.getAttribute('data-field');

        // if(field == 'weight') {
        //     field = 'grams';
        // } else if (field == 'vendor') {
        //     field = 'item_vendor';
        // }
        
        const label = o.querySelector('label').innerText;
        const options = o.querySelector('input').value;
        console.log(label,options); 

        if(label && options != '') {
            site_option_values[label.toLowerCase()] = {
                'label': label,
                'options': options.split(',') 
            }
        }   
    })

    // document.querySelector('#json-output').value = JSON.stringify(site_option_values, null, "\t");

    return JSON.stringify(site_option_values, null, "\t");
}

$(document).ready(async function () {

    // const res = await fetch('http://localhost:4400/product_data');
    // const data = await res.json();

    // Mock data response (change to json api url)
    const data = options;
    const formOutput = document.querySelector('#form-output');
    const data_values = Object.keys(data);

    // Define index for options map
    let tempValue = 0;

    // Map through options and generate the fields dynamically
    Object.entries(data).map(options => {
        formOutput.innerHTML += `
            <div class="ui-field-contain input_options">
                <label for="${options[0]}">${options[0].toUpperCase()}</label>
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

    document.querySelector('#btn-add-new').addEventListener('click', e => {
        dataValue++;

        if(dataValue <= 10) {
            $('.custom-options').append(`
            <div class="ui-field-contain input_options">
                <label for="option_${dataValue}" contenteditable="true">Option ${dataValue}</label>
                <div data-label="option_${dataValue}" data-value="${dataValue}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
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

        $("label[contenteditable]").on("keydown",function(e){
            var key = e.keyCode || e.charCode;  // ie||others
            if(key == 13)  // if enter key is pressed
                $(this).blur();  // lose focus
        });
    });


    document.querySelector('.form-submit').addEventListener('click', e => {
        e.preventDefault();

        const cool = productTags();
        document.querySelector('#site_options').innerHTML = productTags();

        // Remove any labels from before
        const labels = [];
        const theaders = document.querySelectorAll('.th-title');
        if(theaders.length != 0) {
            Array.from(theaders).map(t => {
                t.parentNode.removeChild(t);
            })
        }

        // Show table on submit
        document.querySelector('#tab_logic').style.display = 'table';

        // Declare empty variables where we store variables for table show
        const productVariables = [];

        Array.from(document.querySelectorAll('.input_options')).map(input => {
            // const dataField = input.getAttribute('data-')
            let label = input.querySelector('label').innerText;
            label = label.replace(/\s/gi, '-');

            const inputField = input.querySelector('input');
            
            if(inputField.value != '') {
                labels.push(label);
                productVariables.push(inputField.value.split(','));
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

        // Get all headers
        let thTitles = Array.from(document.querySelectorAll('.th-title')).map(th => {
            return th.getAttribute('data-header');
        });

        // Reversing and showing the labels as table header to be in order that they show up
        labels.reverse().map((label, i) => {
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
        thTitles = Array.from(document.querySelectorAll('.th-title')).map(th => {
            return th.getAttribute('data-header');
        });

        // Create labels array copy with lowercase for comparing
        const labelsLower = labels.map(l => l.toLowerCase());

        thTitles.map(t => {
            // Remove table headers that don't have any values
            if(!labelsLower.includes(t.toLowerCase())) {
                const elem = document.querySelector('.header-' + t.toLowerCase());
                elem.parentNode.removeChild(elem);
            }
        })

        // Create all possible combinations and store it here
        const combinationsArr = combinations(...productVariables);
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
                        (c => {
                            return `<td data-field="variables" id="${countCombination}" contenteditable="true">${c}</td>`
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
                    columns: data_values,
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
    })

});