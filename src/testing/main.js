'use strict';

let testData = {
    bookkeeping: new Array(),
    taxes: new Array(),
    management: new Array(),
    legal: new Array()
};
let sliderIndex = 0;
const sliderItem = document.querySelectorAll('.test-item');
const sliderTabs = document.querySelectorAll('.tabs .tabs__item');
const inputsRadio = document.querySelectorAll('input[type="radio"]');
const sliderPrevButton =  document.querySelector('.button-link.button_prev');
const sliderNextButton =  document.querySelector('.button.button_next');
const testResultButton = document.querySelector('.button.button_result');

// RESET FORM
setTimeout(() => {
    document.querySelector('#form').reset();
}, 0);
//

inputsRadio.forEach(input => {
    input.addEventListener('change', function() {
        sliderIndex === (sliderItem.length - 1) ? testResultButton.removeAttribute('disabled') : 
        sliderNextButton.removeAttribute('disabled');
        updateTestData.call(this);
    });
});

function updateTestData() {
    const sliderItem = document.querySelectorAll('.test-item .test-item__question');
    const groupName = this.parentNode.parentNode.parentNode.dataset['group'];
    testData[groupName][sliderIndex] = {
        question: sliderItem[sliderIndex].innerHTML.trim(),
        answer: this.value,
        key: this.getAttribute('key'),
        keyColor: this.getAttribute('keyColor')
    };
}

function clearTestData() {
    for (let key in testData) {
        testData[key] = testData[key].filter(e => e !== null);
    };
}

function filterKeyColor(key, keyColor) {
    return testData[key].filter(item => item.keyColor === keyColor);
}
const testDataFilter = {};

function getTestingResult() {
    clearTestData();
    for (let key in testData) {
        testData[key].forEach(_ => {
            testDataFilter[key] = {
                green: filterKeyColor(key, 'green'),
                yellow: filterKeyColor(key, 'yellow'),
                red: filterKeyColor(key, 'red'),
            }
        })
    };
    checkValidationColor();
}


function checkValidationColor() {
    Object.keys(testDataFilter).forEach(key => {
        const maxLength = Math.max(...Object.values(testDataFilter[key]).map(item => item.length));
        const baseColor = Object.entries(testDataFilter[key]).filter(([color, item]) => item.length === maxLength);
        if (baseColor.length === 3 && baseColor[0][1].length ===  baseColor[1][1].length && 
            baseColor[1][1].length ===  baseColor[2][1].length) {
                testDataFilter[key].baseValidation = 'yellow';
        } else if (baseColor.length === 2 && (baseColor[0][0] === 'green' && baseColor[1][0] === 'yellow') && 
        baseColor[0][1].length ===  baseColor[1][1].length) {
            testDataFilter[key].baseValidation = 'yellow';
        } else if (baseColor.length === 2 && (baseColor[0][0] === 'green' && baseColor[1][0] === 'red') && 
        baseColor[0][1].length ===  baseColor[1][1].length) {
            testDataFilter[key].baseValidation = 'red';
        } else if (baseColor.length === 2 && (baseColor[0][0] === 'yellow' && baseColor[1][0] === 'red') && 
        baseColor[0][1].length ===  baseColor[1][1].length) {
            testDataFilter[key].baseValidation = 'red';
        } else if (baseColor.length === 3 && baseColor[0][1].length ===  baseColor[1][1].length) {
            testDataFilter[key].baseValidation = 'yellow';
        } else if (baseColor.length === 3 && baseColor[0][1].length ===  baseColor[2][1].length) {
            testDataFilter[key].baseValidation = 'red';
        } else if (baseColor.length === 3 && baseColor[1][1].length ===  baseColor[2][1].length) {
            testDataFilter[key].baseValidation = 'red';
        } else {
            testDataFilter[key].baseValidation = baseColor[0][0];
        }
    });
    window.sessionStorage.setItem('DATA', JSON.stringify(testDataFilter));
    window.location.href = './result/index.html';
}



// SLIDER TEST NAVIGATION
function sliderPrev() {
    if (sliderIndex !== 0) {
        sliderIndex--;
        sliderItem.forEach(item => {
            item.style.display = 'none';
        })
        sliderItem[sliderIndex].style.display = 'block';
        checkStates(sliderItem[sliderIndex].dataset['group']);
    }
}

function sliderNext() {
    if (sliderIndex < sliderItem.length - 1) {
        sliderIndex++;
        sliderItem.forEach(item => {
            item.style.display = 'none';
        })
        sliderItem[sliderIndex].style.display = 'block';
        checkStates(sliderItem[sliderIndex].dataset['group']);
    }
}
document.querySelector('.step .step__full').innerHTML = ` / ${sliderItem.length}`;
function checkStates(nameStates) {
    document.querySelector('.step .step__active').innerHTML = `${sliderIndex + 1}`
    // DISABLED - ACTIVE TABS
    sliderTabs.forEach(item => {
        if (item.dataset['group'] === nameStates) {
            item.classList.add('active');            
        } else {
            item.classList.remove('active');
        }
    })
    // DISABLED - ACTIVE BUTTON
    for(let item of inputsRadio) {
        if (sliderItem[sliderIndex].contains(item)) {
            if (item.checked) {
                sliderNextButton.removeAttribute('disabled');
                break;
            } else {
                sliderNextButton.setAttribute('disabled', '');
            }
        }
    }
    switch(sliderIndex) {
        case 0:
            sliderPrevButton.style = `
                opacity: 0;
                pointer-events: none;
            `;
            break;
        case sliderItem.length - 1:
            sliderNextButton.style.display = 'none';
            testResultButton.style.display = 'block';
            break;
        default:
            testResultButton.style.display = 'none';
            sliderNextButton.style.display = 'block';
            sliderPrevButton.style = `
                opacity: 1;
                pointer-events: initial;
            `;
            break;
    };
}
