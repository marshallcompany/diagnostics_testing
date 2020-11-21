'use strict';

let testData = {
    bookkeeping: new Array(),
    taxes: new Array(),
    management: new Array(),
    legal: new Array()
};

let sliderIndex = 0;
let keysResult;
const sliderItem = document.querySelectorAll('.test-item');
const sliderTabs = document.querySelectorAll('.tabs .tabs__item');
const inputsRadio = document.querySelectorAll('input[type="radio"]');
const sliderPrevButton =  document.querySelector('.test-navigation__prev-button');
const sliderNextButton =  document.querySelector('.test-navigation__next-button');
const testResultButton = document.querySelector('.test-navigation__result-button');

// GET KEYS JSON FILE 
d3.json("../../keys.json")
    .then(data => {
        keysResult = data;
    });
//

inputsRadio.forEach(input => {
    input.addEventListener('change', function() {
        const groupName = this.parentNode.parentNode.parentNode.dataset['group'];
        const inputValue = this.value;
        const key = this.getAttribute('key');
        const keyColor = this.getAttribute('keyColor');
        sliderIndex === (sliderItem.length - 1) ? testResultButton.removeAttribute('disabled') : 
        sliderNextButton.removeAttribute('disabled');
        updateTestData(groupName, inputValue, key, keyColor);
    });
});

function updateTestData(groupName, value, key, keyColor) {
    const sliderItem = document.querySelectorAll('.test-item .test-item__question');
    testData[groupName].push({
        question: sliderItem[sliderIndex].innerHTML.trim(),
        answer: value,
        key: key,
        keyColor: keyColor
    });
}

// SLIDER TEST NAVIGATION
sliderPrevButton.style = `
        opacity: 0;
        pointer-events: none;
    `;

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

function getTestingResult() {
    console.log('[ TESTING RESULT ]', testData);
}

// GENERATION - DOWNLOAD TEST RESULPR
function resultTestDownload() {
    const data = document.body.querySelector(ELEMENT);
    document.querySelector('body').classList.add('hide-scrollbar');
    html2canvas(data, {
        scrollX: 0,
        scrollY: -window.scrollY,
        width:  data.clientWidth , 
        height: data.clientHeight,
    })
    .then(canvas => {
        document.querySelector('body').classList.remove('hide-scrollbar');
        saveAs(canvas.toDataURL(), 'diagnostics-test.png');
    }) 
    .catch(error => {
        console.log('[ GENERATION - DOWNLOAD TEST RESULT ERROR ]', error);
    })
}

function saveAs(url, filename) {
    let link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(url);
    }
}