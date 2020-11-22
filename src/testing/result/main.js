'use strict';

let dataJSON;
const testData = JSON.parse(window.sessionStorage.getItem('DATA'));
console.log(testData);
// GET KEYS JSON FILE 
d3.json("../../data.json")
    .then(data => {
        dataJSON = data;
    })
    .then(() => {
        createResultTabs();
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

function createResultTabs() {
    const parentElement = document.querySelector('.cards');
    parentElement.innerHTML = '';
    for (let key in testData) {
        new ResultTabs(dataJSON[key], testData[key].baseValidation, parentElement).render()
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

// GENERATION - DOWNLOAD TEST RESULPR
function resultTestDownload() {
    const data = document.body.querySelector('.result');
    document.querySelector('body').classList.add('hide-scrollbar');
    html2canvas(data, {
        scrollX: 0,
        scrollY: -window.scrollY,
        width:  data.clientWidth , 
        height: data.clientHeight,
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