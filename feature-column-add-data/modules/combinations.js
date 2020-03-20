export const combinations = function(array) {
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