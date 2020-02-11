// let productVariables = '';
// simulate example of updating an existing product with option_prices (reponse come from api call)
let option_prices = {columns: ["size", "colour", "material", "style"], "prices": {}};
// simulate mock data from api that defines option and option values
let site_option_values = {
        "size": {"label": "Size", "options": ["S", "M", "L"]},
        "material": {"label": "Material", "options": ["Wood", "Plastic", "Metal"]},
        "colours": {"label": "Colours", "options": ["Blue", "Red", "Green"]},
        "style": {"label": "Style", "options": ["Classic", "Modern", "Casual"]}
};

const base_price = null;

function combinations() {
    let final = [];

    const arg = arguments;
    const max = arg.length - 1;

    const permutations = (arr, i) => {

        for (var j=0; j < arg[i].length; j++) {
            let a = [...arr]; // cloning to the new array
            
            a.push(arg[i][j]);
            if (i == max) {
                final.push(a);
            }
            else {
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

// const colors = new Tagify(input, {
//   whitelist: ['Green', 'Blue', 'Black'],
//   dropdown: {
//     maxItems: 20,           // <- mixumum allowed rendered suggestions
//     classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
//     enabled: 0,             // <- show suggestions on focus
//     closeOnSelect: true    // <- do not hide the suggestions dropdown once an item has been selected
//   }
// });

$(document).ready(async function() {
    
    // const res = await fetch('http://localhost:4400/product_data');
    // const data = await res.json();
    const data = site_option_values;
    const formOutput = document.querySelector('#form-output');
    const data_values = Object.keys(data);
    const labels = [];

    Object.entries(data).map(options => {
        
        formOutput.innerHTML += `
            <div class="ui-field-contain">
                <label for="${options[0]}">${options[0].toUpperCase()}</label>
                <div data-field="${options[0]}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    <input name='${options[0]}' id="${options[0]}">
            </div>
        `;

        let newOptions = options[1].options.map(el => {
            return {value: el}
        })
        
        labels.push(options[1].label);
        
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
        }, 0)

    });
  
    labels.reverse().map(label => {
      const tableHead = document.querySelector('#before');
      const th = document.createElement('th');
      th.innerText = label;
      const thead = document.querySelector('table thead tr');
      thead.insertBefore(th, thead.childNodes[0]);
    })
  
    document.querySelector('.form-submit').addEventListener('click', e => {
        
        document.querySelector('#tab_logic').style.display = 'table';

        e.preventDefault();
    
        const productVariables = [];
  
        data_values.map(val => {
            // productVariables[val] = document.querySelector(`input[name="${val}"]`).split(',');
            productVariables.push(document.querySelector(`input[name="${val}"]`).value.split(','));
        })
        
        const combinationsArr = combinations(...productVariables);
        const output = document.querySelector('#output');
        const basePriceBtn = document.querySelector('#base-price');

        output.innerHTML = '';

        let countCombination = 0;
        if(combinationsArr.length > 1) {
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
                            return `<td data-field="variables" id="${countCombination}">${c}</td>`
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
                for(i = 0; i < productVariables.length + 2; i++) {
                    priceRow.appendChild(document.createElement('td'));
                }
    
                priceRow.setAttribute('data-row', countCombination);
                for(let i = 2; i < 11; i++) {
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
                if(btnGenerate.hasAttribute('disabled')) {
                    btnGenerate.removeAttribute('disabled')
                }
            })
    
            let varCount = 0;
            setTimeout(() => {
                document.querySelectorAll('input[name="more-prices"]').forEach(prices => {
                    
                    
                    prices.addEventListener('change', function (e) {
                        if(this.checked) {
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
                    if(row.querySelector('input[name="more-prices"]').checked) {
                        let it = 0;
                        newObj['price_1'] = row.querySelector('input[name="price"]').value;
                        price = Array.from(row.nextElementSibling.querySelectorAll('#inner-prices input')).map(el => {
                            it++;
                            if(el.value != null && el.value != '') {
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

