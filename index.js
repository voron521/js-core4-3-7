const popupMenu = document.querySelector('.main-nav__popup-menu'); // получили главный div для меню popup
let classNamePopupMenu = popupMenu.className; // получили класс главного div для меню popup
classNamePopupMenu = classNamePopupMenu.split("__"); // разбиваем класс главного div для меню popup на массив для получения первой части названия класса
const classNamePopupMenuDiv = classNamePopupMenu[0]; // берем первую часть класса главного div для меню popup
let reposObject = {};
const inputSearch = document.querySelector('.main-nav__input');
mainNavPopupMenu = document.querySelector(".main-nav__popup-menu")

mainNavAddMenu = document.querySelector(".main-nav__add-menu")


const popupQuantityDiv = 5; // Задаем количество, сколько хотим выдавать результатов поиска в меню popup и соответственно создать блоков div под эти результаты
mainNavInput = document.querySelector('.main-nav__input'); // получили главный инпут для навешивания листенера
const debounce = (fn, debounceTime) => {
    let timeout
    return function () {
      const fnCall = () => {fn.apply(this, arguments)}
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, debounceTime)
  
    }
  };



function onChange (searchWord) {

    gitHubGetRepos(searchWord.target.value)
    .then((rezult) => {
        let reposAfterSearch = rezult.items;
        createDivForPopupMenu(popupQuantityDiv, classNamePopupMenuDiv, reposAfterSearch);
    } )


}
onChange = debounce(onChange, 300);

mainNavInput.addEventListener('keyup', onChange)

async function gitHubGetRepos (searchName) {
    
    // const url = `https://api.github.com/search/repositories?q=${searchName}+in:name`;
    const url = `https://api.github.com/search/repositories?q=${searchName}`;

    const repos = await fetch(url);
    let jsonRepos = await repos.json();
    
    return jsonRepos
    

}

let arrForAddMenu = []
function createDivForPopupMenu (quantity, nameClass, repos) {
    reposObject = {};
    let arrayForDivs = []
    arrForAddMenu = []
    
    
    popupMenu.classList.add('main-nav__popup-menu--visible');
    if (popupMenu.querySelectorAll('*').length > 0) {
      
        popupMenu.textContent = '';
    }
    for (let i = 0; i < quantity; i++) {
        let newDiv = document.createElement("div");
        newDiv.classList.add(`${nameClass}__res-div`);
        newDiv.textContent = repos[i].name;
        reposObject[repos[i].name] = [`name: ${repos[i].name}`, `size: ${repos[i].size}`, `log: ${repos[i].owner.login}`]
        arrayForDivs.push(newDiv);
    }
    popupMenu.append(...arrayForDivs);
}





mainNavPopupMenu.addEventListener('click', function(evt) {
    let clickDivName = evt.target.textContent
    if (!arrForAddMenu.includes(clickDivName)) {
        arrForAddMenu.push(clickDivName);
        let newDivWrapper = document.createElement("div");
        newDivWrapper.classList.add(`main-nav__add-menu-elem-wpapper`);
        createListener(newDivWrapper);
        let newDiv = document.createElement("div");
        newDiv.classList.add(`main-nav__add-menu-elem`);
        reposObject[clickDivName].forEach((item) => {
            let newDivItem = document.createElement("div");
            newDivItem.classList.add(`main-nav__elem-text`);
            newDivItem.append(item);
            newDiv.append(newDivItem)
        });
        let newBattonItem = document.createElement("button");
        newBattonItem.classList.add(`main-nav__batton`);
        newDivWrapper.append(newDiv)
        newDivWrapper.append(newBattonItem);
        mainNavAddMenu.append(newDivWrapper);
        inputSearch.value = '';
    }
});


function createListener(elem) {
    elem.addEventListener('click', function(evt) {
        evt.preventDefault();
        if (evt.target.className === 'main-nav__batton') {
            const parentElem = evt.target.parentNode;
            let txt = parentElem.querySelector('.main-nav__elem-text')
            txtSplit = txt.textContent.split(' ');
            let index = arrForAddMenu.indexOf(txtSplit[1]);
            if (index !== -1) {
                arrForAddMenu.splice(index, 1);
            }

            evt.target.parentNode.remove();
        }
    })
}

let mainNav = document.querySelector('.main-nav');

mainNav.addEventListener('click', function(evt) {
    
    if (evt.target.classList.value === "main-nav") {
        if (popupMenu.classList.contains('main-nav__popup-menu--visible')) {
            popupMenu.classList.remove('main-nav__popup-menu--visible');
            inputSearch.value = '';
    
        }


    }
 


});