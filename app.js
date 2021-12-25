window.addEventListener('DOMContentLoaded', function () {

const table = document.querySelector('table'),
    arrayCells = document.querySelectorAll('td'),
    button = document.querySelector('button');

for(let i=0; i<table.rows.length; i++) {
    for(let j=0; j<9; j++) {
        table.rows[2].cells[j].style.borderBottomWidth = '4px';
        table.rows[5].cells[j].style.borderBottomWidth = '4px';
    }
    table.rows[i].cells[3].style.borderLeftWidth = '4px';
    table.rows[i].cells[6].style.borderLeftWidth = '4px';
}

arrayCells.forEach(item => {
    item.addEventListener('click', function addNumber() {
        item.classList.add('active');
        window.addEventListener('keypress', function (e) {
            if(item.classList.contains('active')) {
                item.textContent = `${e.key}`;
                item.classList.remove('active');
            }
        });
    });
});

button.addEventListener('click', function search () {
    let arrayCellsDB = [], arrayCellsPrognose = [];
    let countException, counterError = 0;
    let arraySearchRandomNum = [], arraySearchRandomIndex = [];
    
    function getArrayCellsDB () {
        for (let i=0; i<9; i++) {
            arrayCellsDB.push([]);
        }
        // arrayCellsDB[row][column]
        let num = 0;
        for(let i=0; i<9; i++) {
            for(let j=0; j<9; j++) {
                arrayCellsDB[j, i].push(+arrayCells[num++].textContent);
            }
        }
    }
    
    getArrayCellsDB();

    function exception(arr) {
        countException = 0;

        for(let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                if(arr[i][j] == 0) {
                    if(!checkException(i, j)) {
                        return false;
                    }
                }
            }
        }

        if (countException > 0) {
            exception(arr);
        }
        return true;
    }
    
    exception(arrayCellsDB);
    //substitution();
    showAnswer();

    function checkException(row, column) {

        let testArray = [];
        for(let i=1; i<10; i++) {
            testArray.push(i);
        }
        // Check square
        let startSquareRow, startSquareColumn;
        for(let i=0; i<3; i++) {
            if(row%3 == i) {
                startSquareRow = row-i;
            }
            if(column%3 == i) {
                startSquareColumn = column-i;
            }
        }
        for(let i=startSquareColumn; i<3+startSquareColumn; i++) {
            for(let j=startSquareRow; j<3+startSquareRow; j++) {
                if(arrayCellsDB[j][i] != 0) {
                    spliceTestArray(arrayCellsDB[j][i], testArray);
                }
            }
        }
        
        //Check row
        for(let i=1; i<10; i++) {
            if(arrayCellsDB[row].includes(i)) {
                spliceTestArray(i, testArray);
            }
        }

        //Check column
        for(let i=1; i<10; i++) {
            for (let j=0; j<9; j++) {
                if(i == arrayCellsDB[j][column]) {
                    spliceTestArray(i, testArray);
                }
            }
        }

        if(testArray.length == 1) {
            arrayCellsDB[row].splice(column,1,testArray[0]);
            countException++;
        }

        if(testArray.length == 0) {
            return false;
        }

        return testArray;
    }

    function spliceTestArray (i, array) {
        const index = array.indexOf(i);
            if (index > -1) {
                array.splice(index, 1);
            }
    }

    function getPrognose() {
        arrayCellsPrognose = JSON.parse(JSON.stringify(arrayCellsDB));
        for(let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                if(arrayCellsDB[i][j] == 0) {
                    arrayCellsPrognose[i].splice(j, 1, checkException(i, j));
                }
            }
        }
    }

    function showAnswer () {
        let num=0;
        for(let i=0; i<9; i++) {
            for(let j=0; j<9; j++) {
                arrayCells[num++].textContent = arrayCellsDB[i][j];
            }
        }
        button.removeEventListener('click', search);
    }

    function findMinPrognose () {
        let index;
        let findArr = [1, 2, 3, 4, 5];
        for(let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                if((typeof arrayCellsPrognose[i][j] == 'object') && arrayCellsPrognose[i][j].length < findArr.length) {
                    if(arraySearchRandomIndex.includes([i, j])) {
                        continue;
                    }
                    findArr = arrayCellsPrognose[i][j];
                    index = [i, j];
                }
            }
        }
        arraySearchRandomNum.push(findArr);
        arraySearchRandomIndex.push(index);
        counterError = 0;
    }

    function substitution () {
        getPrognose();
        findMinPrognose();
        checkedSubstitution(counterError);
        searchError();
        for(let i=0; i<9; i++) {
            for (let j=0; j<9; j++) {
                if(arrayCellsDB[i][j] == 0) {
                    substitution();
                }
            }
        }
        
    }

    function checkedSubstitution(err) {
        
        let x = arraySearchRandomNum.length;
        if (err >= arraySearchRandomNum[x-1].length) {
            let lostSubstitution = arrayCellsDB[(x-2)[0]][(x-2)[1]];
            for(let i=0; i<arraySearchRandomNum[x-2].length; i++) {
                if(arraySearchRandomNum[x-2][i]>lostSubstitution) {
                    arrayCellsDB.splice([(x-2)[0]][(x-2)[1]], 1, arraySearchRandomNum[x-2][i]);
                    counterError = 0;
                    arraySearchRandomIndex.pop();
                    arraySearchRandomNum.pop();
                    return;
                }
            }
            arraySearchRandomIndex.pop();
            arraySearchRandomNum.pop();
            counterError = 10;
            checkedSubstitution();
        }
        
        for (let i=0; i<9; i++) {
            if(i == arraySearchRandomIndex[x-1][0]) {
                arrayCellsDB[i].splice(arraySearchRandomIndex[x-1][1], 1, arraySearchRandomNum[x-1][err]);
                break;
            }
        }
        
    }

    function searchError () {
        if(!exception(arrayCellsDB)) {
            checkedSubstitution(counterError);
            searchError();
            counterError++;
        }
        console.log(arrayCellsDB);
    }
    
});

});