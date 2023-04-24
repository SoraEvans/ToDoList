const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const paginationList = document.querySelector(".pagination");
const listStatus = document.querySelector("#listStatus");
const removeBtn = document.querySelector("#removeBtn");

let allTasks = [];
let actualTasks = [];
let filteredTasks = [];
const elementsOnPage = 5;
let page = 1;
let countOfPages = 1;
let savedStatus = 'Все задачи';

const renderTask = (navigate) => {
    if (savedStatus === 'Готовые') {
        filteredTasks = allTasks.filter(task => task.done);
    } else if (savedStatus === 'Не готовые') {
        filteredTasks = allTasks.filter(task => !task.done);
    } else {
        filteredTasks = allTasks;
    }

    countOfPages = Math.ceil(filteredTasks.length / elementsOnPage)
    if (page > countOfPages && countOfPages !== 0) {
        page = countOfPages
    }
    if (page < countOfPages && !navigate) {
        page = countOfPages
    }

    let start = (page - 1) * elementsOnPage;
    let end = start + elementsOnPage;
    let pages = Array.from({length: countOfPages}, (_, idx) => `${++idx}`);

    actualTasks = filteredTasks.slice(start, end);

    const pagesHTML = pages.map((_, i) =>
        `<li class="page-item ${+page === i + 1 && 'active'}">
         <a class="page-link" href="#">${i + 1}</a>
         </li>`);

    const disableLeftArrow = +page === 1;
    const disableRightArrow = +page === countOfPages;

    pagesHTML.unshift(`<li class="page-item ${disableLeftArrow && 'disabled'}">
                              <a class="page-link" href="#" aria-label="Previous" tabindex="${disableRightArrow && "-1"}">
                                 &laquo;
                              </a>
                             </li>`);

    pagesHTML.push(`<li class="page-item ${disableRightArrow && 'disabled'}">
                    <a class="page-link" href="#" aria-label="Next" tabindex="${disableRightArrow && "-1"}">
                       &raquo;
                    </a>
                    </li>`);

    paginationList.innerHTML = countOfPages <= 1 ? '' : pagesHTML.join('')

    const taskHTML = actualTasks.map(task => {
        const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
        return `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                   <img src="./img/tick.svg" alt="Done" width="18" height="18">
                 </button>
                 <button type="button" data-action="delete" class="btn-action">
                   <img src="./img/cross.svg" alt="Done" width="18" height="18">
                 </button>
             </div>
        </li>`
    })
    tasksList.innerHTML = taskHTML.join('');
    const removeBtnHTML = `<button id="removeTasks" class="btn float-right">
                         Удалить ${savedStatus.toLowerCase()}
                         </button>`
    removeBtn.innerHTML = filteredTasks.length ? removeBtnHTML : '';

    document.querySelector("#removeTasks")
        ?.addEventListener('click', () => {
            localStorage.removeItem('allTasks'); //todo Логика удаления по табам
            allTasks = [];
            renderTask();
            checkEmptyList();
        });
}

if (localStorage.getItem('allTasks')) {
    allTasks = JSON.parse(localStorage.getItem('allTasks'));
    renderTask();
}

const saveToLocalStorage = () => {
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

const checkEmptyList = () => {
    if (filteredTasks.length === 0) {
        const emptyListHTML =
            `<li id="emptyList" class="list-group-item empty-list">
             <img src="../img/leaf.svg" alt="Empty" width="48" class="mt-3">
             <div class="empty-list__title">Список дел пуст</div>
             </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (filteredTasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList");
        emptyListEl ? emptyListEl.remove() : null;
    }
}

const addTask = (event) => {
    event.preventDefault();
    // Замена служебных символов при вводе
    const taskText = taskInput.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    allTasks.push(newTask);
    saveToLocalStorage();
    renderTask();

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

const deleteTask = (event) => {
    if (event.target.dataset.action !== 'delete') return;
    const parentNode = event.target.closest('li');
    const id = Number(parentNode.id);
    allTasks = allTasks.filter((task) => task.id !== id);
    saveToLocalStorage();

    parentNode.remove();
    renderTask();
    checkEmptyList();
}

const doneTask = (event) => {
    if (event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest(".list-group-item");
    const id = Number(parentNode.id);
    const task = allTasks.find((task) => task.id === id);
    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle('task-title--done');
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
paginationList.addEventListener('click', (event) => {
    if (event.target.className.includes('disabled')) return;
        if (event.target.text.trim() === '«') {
            page = 1;
        } else if (event.target.text.trim() === '»') {
            page = countOfPages;
        } else {
            page = (event.target.text);
        }
    renderTask(true);
});

listStatus.addEventListener('click', (event) => {
    savedStatus = event.target.value;
    listStatus.querySelector('.activeStatus').classList.remove('activeStatus');
    event.target.classList.toggle('activeStatus');
    renderTask();
    checkEmptyList();
});

