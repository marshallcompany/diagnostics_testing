'use strict';

let dataJSON;
const testData = JSON.parse(window.sessionStorage.getItem('DATA'));
// GET KEYS JSON FILE 
d3.json("../../data.json")
    .then(data => {
        dataJSON = data;
    })
    .then(() => {
        createResultTabs();
        recommendation();
    });
//

class ResultTabs {
    constructor(categoryData, color, parentElement) {
        this.categoryData = categoryData;
        this.color = color
        this.parentElement = parentElement;
    }
    render() {
        const el =  document.createElement('div');
        el.classList.add('cards-item', `${this.color}`);
        el.innerHTML = `
            <img src="${this.categoryData.icon}" class="cards-item__icon">
            <p class="cards-item__label">${this.categoryData.title}</p>
            <div class="cards-item__status">
                <img class="cards-item__status-icon" src="${this.categoryData[this.color].icon}">
            </div>
            <p class="cards-item__description">${this.categoryData[this.color].message}</p>`;
        this.parentElement.append(el);
    }
}

class RecommendationItem {
    constructor(key, color, parentElement, lastElement){
        this.key = key;
        this.color = color;
        this.parentElement = parentElement;
        this.lastElement = lastElement;
    }
    render() {
        const el = document.createElement('div');
        el.classList.add('recommendation-item', `${this.color}`);
        if (this.lastElement) {
            el.classList.add('last');
        }
        el.innerHTML = `
            <div class="recommendation-status">
                <img src="${dataJSON[this.color].icon}" class="recommendation-status__icon">
            </div>
            <div class="recommendation-information">
                <h3 class="recommendation-information__title">Рекомендация</h3>
                    <p class="recommendation-information__text">
                        ${dataJSON[this.key]}
                    </p>
            </div>`;
        this.parentElement.prepend(el);
    }
}

function recommendation() {
    let answersArray = [];
    for (let key in testData) {
        const color = testData[key].baseValidation;
        answersArray = answersArray.concat(testData[key][color]);
    }
    const removeDuplicate = answersArray.filter((item, index, array) => { 
        return index === array.findIndex((t) => {
            return t.key === item.key
        });
    });
    const recommendationKey = {
        green: removeDuplicate.filter(item => item.keyColor === 'green').map(obj => obj.key),
        yellow: removeDuplicate.filter(item => item.keyColor === 'yellow').map(obj => obj.key),
        red: removeDuplicate.filter(item => item.keyColor === 'red').map(obj => obj.key)
    };
    createRecommendationItem(recommendationKey);
}

function createRecommendationItem(keys) {
    const parentElement = document.querySelector('.recommendation');
    parentElement.innerHTML = '';
    let lastElement = false;
    for (let keyColor in keys) {
        keys[keyColor].forEach( (key, index) => {
            if (index === 0) {
                if (keyColor === 'red' && (keys.yellow.length || keys.green.length)) {
                    lastElement = true;
                } else if (keyColor === 'yellow' && keys.green.length) {
                    lastElement = true;
                }
            } else {
                lastElement = false;
            }
            new RecommendationItem(
                key, 
                keyColor, 
                parentElement,
                lastElement
            ).render();
        });
    }
}

function createResultTabs() {
    const parentElement = document.querySelector('.cards');
    parentElement.innerHTML = '';
    for (let key in testData) {
        new ResultTabs(
            dataJSON[key], 
            testData[key].baseValidation,
            parentElement
        ).render()
    }
}

document.querySelector('.details-button').addEventListener('click', function() {
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
        this.previousElementSibling.style.maxHeight = `${this.previousElementSibling.scrollHeight}px`;
    } else {
        this.previousElementSibling.style.maxHeight = `0`;
    }
});


function goToDiagnostics() {
    window.location.href = 'https://bit.ly/2Vp9Cr4';
}
// GENERATION - DOWNLOAD TEST RESULPR
function resultTestDownload() {
    const data = document.body.querySelector('.result');
    const clone = document.querySelector('.clone');
    document.querySelector('body').classList.add('hide-scrollbar');
    html2canvas(data, {
        onclone: function (clonedDoc) {
            clonedDoc.querySelector('.clone').style = `
            position: inherit;
            left: inherit;
            padding-top: 25px;
            `;
        },
        scrollX: 0,
        scrollY: -window.scrollY,
        width:  window.innerWidth , 
        height: window.innerWidth > 992 ? data.clientHeight + (clone.clientHeight / 2) : data.clientHeight + clone.clientHeight,
    })
    .then(canvas => {
        document.querySelector('body').classList.remove('hide-scrollbar');
        saveAs(canvas.toDataURL(), 'diagnostics-result.png');
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