    // let productVariables = '';
    // simulate example of updating an existing product with option_prices (reponse come from api call)

    // simulate mock data from api that defines option and option values

    // Define product base price
    const base_price = null;

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

    // Existing product data
    const existing_data = {
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
    const data = {
        test_cases: [],
        custom_labels: [],
        standard_labels: [],
        labels: [],
        custom: [],
        standard: [],
        selectizeArr: [],
        productVariables: []
    }

    const combinations = function(array) {
        let final = [];

        let startTime = performance.now();
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

        let endTime = performance.now();
        let testCase = endTime - startTime;
        data.test_cases.push(testCase);
        median(data.test_cases);
        return final;
    }

    const median = function(data){
        const sum = data.reduce((a,b) => a + b, 0);
        const arrMin = Math.min(...data);
        const arrMax = Math.max(...data);

        const median = sum / data.length;

        return {
            min: arrMin,
            max: arrMax,
            median
        }
    }

    const optionsToJson = function(data) {
        const labels = data[0];
        const output = data.slice(1).map(item => item.reduce((obj, val, index) => {
            obj[labels[index]] = val;
            return obj;
        }, {}))

        return output;
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

    const renderTags = function(arr, selectizeArr) {
        // map array with existing_data.columns [0] = column value 0 [1] means column value 1

        let newArr = {};

        existing_data.columns.map((e,i) => {
            newArr[e] = []

            arr.map((el, index) => {
                if(newArr[e].indexOf(el[i]) == -1) {
                    newArr[e].push(el[i])
                }
            })
        });


        $('.input_options > div').each(function () {

            const currentField = $(this)[0].getAttribute('data-field');
            var $select = $(`div[data-field="${currentField}"] input`);

            if($select) {
                var selectize = $select[0].selectize;

                if(newArr[currentField]) {
                    newArr[currentField].map(ee => {
                        selectize.addOption({text: ee, value: ee});
                        selectize.addItem(ee);
                        selectize.refreshItems();
                    })
                }
            }
        })
    }

    const changeTag = function(element, curr, parentEl, custom = false) {
        const currentLabel = $(element)[0].getAttribute('data-label');
        const currentOption = $(element)[0].getAttribute('data-option');
        // var $select = custom ? $(`div[data-option="${currentOption}"] input`) : $(`div[data-field="${currentLabel}"] input`);
        var $select = $(`div[data-field="${currentLabel}"] input`);

        console.log(element,curr,parentEl);

        
        console.log('$select:: ', currentOption);
        var selectize = $select[0].selectize;

        var value = selectize.getValue().split(',');
        var indexNo = value.findIndex(i => i === curr);

        if(indexNo != -1) {
            selectize.setCaret(indexNo);
            selectize.removeItem(curr);
        
            selectize.addOption({text: $(parentEl)[0].innerText, value: $(parentEl)[0].innerText});
            selectize.addItem($(parentEl)[0].innerText);

            selectize.setCaret(selectize.items.length)
        }

        // Declare empty variables where we store variables for table show
        data.productVariables = [];

        mapDataFromInput();

        if(data.productVariables.length > 0) {
            $('#tab_logic').DataTable().clear().destroy();
                
            renderHeaders();
            
            // Render combinations
            renderCombinations(data.productVariables);

            data.labels = [...new Set(data.labels)];

            $('#tab_logic').DataTable({
                "lengthMenu": [[500, 1000, 2000, -1], [500, 1000, 2000, "Show all"]],
                "iDisplayLength": 500,
                "columns": [
                    null,
                    ...data.labels.map(el => null),
                    null,
                    { "orderDataType": "dom-text-numeric" },
                    { "orderDataType": "dom-text-numeric" },
                    { "orderDataType": "dom-text-numeric" }
                ]
            });

            editableTags();
            // datatable.rows.add(productVariables); // Add new data
            // datatable.columns.adjust().draw(); // Redraw the DataTable

            searchFilters();
    

        }
    }

    const editableTags = function() {
        var blur = false;

        document.querySelectorAll('td[data-field="variables"]').forEach(el => {
            let curr = $(el)[0].innerText;

            $(el).on("focus", function(e) {
                curr = $(this)[0].innerText;
            })
            
            // Fix an issue with Chrome browser
            $(el).on('focusout', function(e) {
                e.preventDefault();
                // Add change tag ability
                changeTag(this, curr, el);
                // document.querySelectorAll(`td[data-label="${currentLabel}"][data-option="${currentOption}"]`).forEach(el => {
                //     el.innerText = this.innerText;
                //     el.setAttribute('data-option', this.innerText);
                // })
            })

            // $(el).addEventListener('blur', e => e, { once: true });

            $(el).on("keydown", function(e) {

                var key = e.keyCode || e.charCode;  // ie||others
                // if enter is pressed
                if(key == 13) {
                    e.preventDefault();

                    // Add change tag ability
                    changeTag(this, curr, el);
                } 
            })
        });
    }

    const mapDataFromInput = function() {
        Array.from(document.querySelectorAll('.input_options')).map((input, index) => {
                
            // let label = input.querySelector('label').innerText;
            // label = label.replace(/\s/gi, '-');

            let label = input.querySelector('label').innerText.replace(/\s/gi, '-');;
            let unique = input.querySelector('div.ui-input-text').getAttribute('data-field');;

            // if(input.querySelector('label').getAttribute('data-format') === 'standard') {
            //     label = input.querySelector('label').innerText.replace(/\s/gi, '-');
            // } else {
            //     label = input.querySelector('div.ui-input-text').getAttribute('data-field');
            // }

            const newInputField = data.selectizeArr[index].items;
            const inputField = input.querySelector('input');
            // console.log('inptufield::: ' + JSON.stringify(inputField));
            
            if(inputField.value != '') {
                data.labels.push(unique);
                // data.labels.push(label);
                data.productVariables.push({
                    unique,
                    label,
                    options: newInputField 
                });
            }
        })
    }

    const searchFilters = () => {

        const searchContainer = $('.table-filters');

        if(searchContainer.length > 0) { 
            searchContainer[0].innerHTML = '';
        }

        if(data.productVariables.length > 1) {
            $('.filter-container').show();

            // searchContainer.append(`
            //     ${data.productVariables.map((el,i) => {
            //         return `<div class="form-group">
            //             <label for="${el.label}">${capitalizeFirst(el.label).replace(/\-/g, ' ')}</label>
            //             <select name="${el.label}" data-position="${i+1}" class="search-filters">
            //                     ${el.options.map(option => {
            //                         return `<option value="${option}" data-label="${el.unique}">${option}</option>`
            //                     }).join('')}
            //                     <option value="all" data-label="all" selected>Show all</option>
            //                 </select>
            //             </div>`
            //         }).join('')}
            //     `)
            $('#tab_logic_filter')
            $('#tab_logic_filter').append(`<input type="text" class="searching-filters ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset" name="search-filters" placeholder="Search by tags..."></input> <button class="ui-btn ui-btn-b ui-shadow ui-corner-all" id="reset-search-filter">Reset filter</button>`);

            // searchContainer.append(`<input type="text" class="searching-filters ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset" name="search-filters"></input> <button class="ui-btn ui-btn-b ui-shadow ui-corner-all" id="reset-search-filter">Reset filter</button>`);

            const uniqueArr = [];

            // Create array of objects with adapted properties for selectize 
            data.productVariables.forEach((el, index) => {
                el.options.map(innerEl => {
                    uniqueArr.push({ value: innerEl, unique: el.unique + '-' + innerEl ,label: el.unique, column: index + 1 })
                })
            });

            setTimeout(() => {
                const items = new Object();
                const table = $('#tab_logic').dataTable().api();

                const $select = $('input[name="search-filters"]').selectize({
                    delimiter: ',',
                    options: uniqueArr,
                    valueField: 'unique',
                    labelField: 'value',
                    searchField: 'value',
                    persist: false,
                    render: {
                        item: function (data, escape) {
                            return `<div class="item custom-search-tag" data-tag="${data.value}" data-value="${escape(data.unique)}" data-column="${escape(data.label)}" data-column-index="${escape(data.column)}">${data.value}</div>`
                        }
                    },
                    onChange: function(item) {
                         const current = item.split(',');

                    },
                    onItemAdd: function(value, $item) {
                        console.log('ITEM ADDED - ' + value, $item);

                        const uniqueValue = $item.attr('data-value');
                        const tagName = $item.attr('data-tag');
                        const column = $item.attr('data-column');
                        const columnIndex = $item.attr('data-column-index');

                        if(items[column]) {
                            items[column].push(tagName);
                        } else {
                            items[column] = [];
                            items[column].push(tagName);
                        }

                        let curTags;

                        if(items[column].length > 1) {
                            curTags = items[column].join('|');
                        } else {
                            curTags = items[column][0];
                        }

                        // Search through table
                        table.columns(columnIndex).search(curTags, true, false).draw();
                    },
                    onItemRemove: function(value, $item) {
                        console.log('ITEM REMOVED ::: ' + value, $item.attr('data-tag'));  

                        const uniqueValue = $item.attr('data-value');
                        const tagName = $item.attr('data-tag');
                        const column = $item.attr('data-column');
                        const columnIndex = $item.attr('data-column-index');

                        items[column].splice(items[column].indexOf(tagName), 1);

                        let curTags;

                        if(items[column].length > 1) {
                            curTags = items[column].join('|');
                            console.log(curTags);
                        } else {
                            curTags = items[column][0];
                        }

                        console.log(columnIndex)

                        table.columns(columnIndex).search('').draw();
                        // Search through table
                        table.columns(columnIndex).search(curTags, true, false).draw();
                    }
                    
                })

                $('#reset-search-filter').click(function() {

                    table.columns().search('').draw();

                    const selectize = $select[0].selectize;

                    selectize.clear();
                })
            }, 0)
        }

    }

    const renderCombinations = function(productVariables, onload = false) {     
        
        searchFilters();

        const output = document.querySelector('#output');
        const basePriceBtn = document.querySelector('#base-price');

        // Empty the HTML if there's data
        document.querySelector('#submit-response').innerHTML = '';
        output.innerHTML = '';

        let combinationsArr = [];
        let productLabels = [];
        let uniqueLabels = [];

        console.log(productVariables);

        if(onload) {
            combinationsArr = productVariables;
            productLabels = existing_data.columns.map(col => col);
        } else {
            combinationsArr = combinations(productVariables);
            productLabels = productVariables.map(el => el.label.toLowerCase());
            uniqueLabels = productVariables.map(el => el.unique);
        }

        // Show number of all combinations
        document.querySelector('#combinations-count').innerText = 'Number of combinations: ' + combinationsArr.length;

        let countCombination = 0;
        
        if (combinationsArr.length > 1) {
            combinationsArr.map(c => {
                let combination = [];
                c.forEach(newEl => {
                    combination.push(newEl);
                });

                countCombination++;

                $('#output').append(`
                    <tr id="row-${countCombination}" data-row-abbreviation="${c.join('--')}" class="row-variables">
                        <td class="text-center">
                            ${countCombination}
                        </td>
                    ${combination.map
                        ((c,i) => {
                            return `<td data-field="variables" data-option="${c}" data-label="${uniqueLabels[i]}" id="${countCombination}" contenteditable="true">${c}</td>`
                        })
                    }

                    <td class="text-center">
                        <a href="https://chart.googleapis.com/chart?chs=547x547&cht=qr&chl=http://producturl.com/${c.join(',')}&choe=UTF-8}" class="qr-icon" target="_blank"><i class="fa fa-qrcode"></i></a>
                    </td>
                    <td class="text-center">
                        <input type="text" name="sku" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    </td>
                    <td class="text-center">
                        <input type="text" name="inventory" max="999999" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    </td>
                    <td class="text-center">
                        <input type="number" name="price" value="${basePriceBtn.value}" class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">
                    </td>
                    <!-- <td style="display:none;"> 
                        <input type="checkbox" name="more-prices" class="ui-input-checkbox ui-body-inherit ui-corner-all ui-shadow-inset">
                    </td> -->
                    
                </tr>  
                `);

                const btnGenerate = document.querySelector('#btn-generate');
                if (btnGenerate.hasAttribute('disabled')) {
                    btnGenerate.removeAttribute('disabled')
                }
            })

            document.querySelector('#submit-response').innerHTML += '<button value="Autogenerate" id="submit-prices" data-theme="a" class="ui-btn ui-btn-b ui-shadow ui-corner-all" id="btn-generate"><span>Submit Prices</button>';
            let varCount = 0;
            
            setTimeout(() => {

                
                // document.querySelectorAll('input[name="more-prices"]').forEach(prices => {
                //     prices.addEventListener('change', function (e) {
                //         if (this.checked) {
                //             // Count foreach iterations and use them in assigning id's
                //             varCount++;
                //             $(this.parentElement.parentElement.nextElementSibling.querySelector('td:last-child > div')).hide().slideDown();
                //         } else {
                //             $(this.parentElement.parentElement.nextElementSibling.querySelector('td:last-child > div')).show().slideUp();
                //         }
                //     })
                // });
                
            }, 0);

            document.querySelector('#btn-generate').addEventListener('click', e => {
                e.preventDefault();
                document.querySelectorAll('input[name="sku"]').forEach((el, index) => {
                    el.value = new Date().getTime() + index;
                })
            })

            document.querySelector('#submit-prices').addEventListener('click', e => {

                document.querySelector('#site_options').innerHTML = productTags();

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
                    // if (row.querySelector('input[name="more-prices"]').checked) {
                    //     let it = 0;
                    //     newObj['price_1'] = row.querySelector('input[name="price"]').value;
                    //     price = Array.from(row.nextElementSibling.querySelectorAll('#inner-prices input')).map(el => {
                    //         it++;
                    //         if (el.value != null && el.value != '') {
                    //             newObj['price_' + (it + 1)] = el.value;
                    //         }
                    //     })
                    //     price = newObj;
                    // } else {
                        price = row.querySelector('input[name="price"]').value;
                    // }

                    obj.push(allVariables);
                    prices.push(price || base_price);
                    inventories.push(inventory);
                    skus.push(sku || '-');
                })
                const uniqueLabels = data.productVariables.map(el => el.unique);
                const finalJson = {
                    columns: uniqueLabels,
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
                data.labels[cur] = newLabel;
            }

            // Change data
            removeHeaders();

            // Reversing and showing the labels as table header to be in order that they show up
            data.labels.map((label, i) => {
                if(!document.querySelector(`.header-${label.toLowerCase()}`)) {
                    const th = document.createElement('th');
                    th.className = 'th-title header-' + label.toLowerCase();
                    th.setAttribute('data-header', label.toLowerCase());
                    th.innerText = label.replace(/\-/g, ' ');
                    const thead = document.querySelector('table thead tr');
                    thead.insertBefore(th, thead.childNodes[1]);
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

            function insertAfter(newNode, referenceNode) {
                referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            }

            

            if(data.productVariables.length > 0) {
                const newDataProductVariables = [...data.productVariables];
                // Reversing and showing the labels as table header to be in order that they show up
                newDataProductVariables.reverse().map((label, i) => {
                    console.log(label.label);
                    if(!document.querySelector(`.header-${label.unique.toLowerCase()}`)) {
                        const th = document.createElement('th');
                        th.className = 'th-title header-' + label.unique.toLowerCase();
                        th.setAttribute('data-header', label.unique.toLowerCase());
                        th.innerText = label.label.replace(/\-/g, ' ');
                        const thead = document.querySelector('table thead tr');
                        thead.insertBefore(th, thead.childNodes[1]);
                    } 
                })         
            } else {

                // TODO - Load custom option labels from existing data & site options
                data.labels.reverse().map((label, i) => {
                    if(!document.querySelector(`.header-${label.toLowerCase()}`)) {
                        const th = document.createElement('th');
                        th.className = 'th-title header-' + label.toLowerCase();
                        th.setAttribute('data-header', label.toLowerCase());
                        th.innerText = label.replace(/\-/g, ' ');
                        const thead = document.querySelector('table thead tr');
                        thead.insertBefore(th, thead.childNodes[1]);
                    } 
                })
            }



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
    }

    const productTags = function() {
        const optionForm = document.querySelectorAll('.input_options');
        let site_option_values = {};
            
        Array.from(optionForm).map(o => {

            const uniq = o.querySelector('div').getAttribute('data-field');
            const uniqueLabel = uniq == 'length' ? 'length-value' : uniq;
            const label = o.querySelector('label');

            console.log(uniq, uniqueLabel, label);

            // Define custom and standard options labels;
            const options = o.querySelector('input').value;

            console.log(options);
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
                    'label': label.innerText,
                    'options': options.split(',')
                }
            }   
        })
        // document.querySelector('#json-output').value = JSON.stringify(site_option_values, null, "\t");

        return JSON.stringify(site_option_values, null, "\t");

    }

    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col ) {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            return $('input', td).val();
        } );
    }

    /* Create an array with the values of all the input boxes in a column, parsed as numbers */
    $.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col ) {
        return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
            return $('input', td).val() * 1;
        } );
    }
 

    $(document).ready(async function () {
        // const res = await fetch('http://localhost:4400/product_data');
        // const data = await res.json();

        // Mock data response (change to json api url)
        const responseData = options;
        const formOutput = document.querySelector('#form-output');
        // const data_values = Object.keys(responseData);

        // Define index for options map
        let tempValue = 0;

        // Map through options and generate the fields dynamically
        Object.entries(responseData).map((options,i) => {
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
                console.log(newOptions);

                data.selectizeArr.push($(`input[name="${options[0]}"`).selectize({
                    delimiter: ',',
                    options: newOptions,
                    valueField: 'value',
                    labelField: 'value',
                    searchField: 'value',
                    persist: false,
                    create: true
                })[0].selectize)
            }, 0)

        });

        let dataValue = 0;

        // load data on document load
        if(existing_data) {

            setTimeout(() => {
                combinationsArr = Object.keys(existing_data.prices).map(el => {
                    return el.split('--')
                })
    
                document.querySelector('#tab_logic').style.display = 'table';
                data.labels = existing_data.columns.map(el => el.toUpperCase());
                // data.productVariables = existing_data.

                renderHeaders();
                // Passing true as parameters should we load already existing data


                renderCombinations(combinationsArr, true);

                renderTags(combinationsArr, data.selectizeArr);
                editableTags();

                $('#tab_logic').DataTable({
                    "lengthMenu": [[500, 1000, 2000, -1], [500, 1000, 2000, "Show all"]],
                    "iDisplayLength": 500,
                    "columns": [
                        null,
                        ...data.labels.map(el => null),
                        null,
                        { "orderDataType": "dom-text-numeric" },
                        { "orderDataType": "dom-text-numeric" },
                        { "orderDataType": "dom-text-numeric" }
                    ]
                });

                mapDataFromInput();

                searchFilters();

            }, 0)
        } 

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
                data.selectizeArr.push($(`div[data-value="${dataValue}"] input`).selectize({
                    delimiter: ',',
                    create: true,
                    loadThrottle: 100
                })[0].selectize);
            }, 0)
            } else {
                $('.output-message').innerText = 'Can\'t add more than 10 custom options';
            }

            let currentValue = [];

            $("label[contenteditable]").on("focus",function(e){
                currentValue = $(this)[0].innerText;
            });

            $("label[contenteditable]").focusout(function(e) {
                e.preventDefault();

                data.productVariables = [];

                mapDataFromInput();

                // $('#tab_logic').DataTable().columns.adjust().draw();
                $('#tab_logic').DataTable().clear().destroy();

                console.log(`${currentValue.replace(/\s/g, '-')}`, $(this)[0].innerText.replace(/\s/g, '-'))
                // renderHeaders(`${currentValue.replace(/\s/g, '-')}`, $(this)[0].innerText.replace(/\s/g, '-'));
                renderHeaders();
                renderCombinations(data.productVariables);

                // renderTags(data.productVariables, data.selectizeArr);

                $('#tab_logic').DataTable({
                    "lengthMenu": [[500, 1000, 2000, -1], [500, 1000, 2000, "Show all"]],
                    "iDisplayLength": 500
                });

                editableTags();

                searchFilters();
                // Passing true as parameters should we load already existing data
            })

            $("label[contenteditable]").on("keydown",function(e){
                var key = e.keyCode || e.charCode;  // ie||others

                if(key == 13) {
                    e.preventDefault();
                    renderHeaders(`${currentValue.replace(/\s/g, '-')}`, $(this)[0].innerText.replace(/\s/g, '-'));

                    // $('#tab_logic').DataTable().destroy();
                    // $('#tab_logic').DataTable({
                    //     "lengthMenu": [[500, 1000, 2000, -1], [500, 1000, 2000, "Show all"]],
                    //     "iDisplayLength": 500,
                    //     "columns": [
                    //         null,
                    //         ...data.labels.map(el => null),
                    //         null,
                    //         { "orderDataType": "dom-text-numeric" },
                    //         { "orderDataType": "dom-text-numeric" },
                    //         { "orderDataType": "dom-text-numeric" }
                    //     ]
                    // });

                    $(this).blur();  // lose focus
                } 
            });
        });

        document.querySelector('.form-submit').addEventListener('click', e => {
            e.preventDefault();

            // Remove any labels from before
            data.labels = [];

            // Show table on submit
            document.querySelector('#tab_logic').style.display = 'table';

            // Declare empty variables where we store variables for table show
            data.productVariables = [];

            mapDataFromInput();

            if(data.productVariables.length > 0) {
                $('#tab_logic').DataTable().clear().destroy();
                        
                renderHeaders();
                // Render combinations
                renderCombinations(data.productVariables);
            
                // datatable.destroy();
                $('#tab_logic').DataTable({
                    "lengthMenu": [[500, 1000, 2000, -1], [500, 1000, 2000, "Show all"]],
                    "iDisplayLength": 500,
                    "columns": [
                        null,
                        ...data.labels.map(el => null),
                        null,
                        { "orderDataType": "dom-text-numeric" },
                        { "orderDataType": "dom-text-numeric" },
                        { "orderDataType": "dom-text-numeric" }
                    ]
                });
                // datatable.rows.add(productVariables); // Add new data
                // datatable.columns.adjust().draw(); // Redraw the DataTable
        
                editableTags();

                searchFilters();
            }
            
        })

    });