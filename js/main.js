const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const paginationList = document.querySelector(".pagination");

let allTasks = [];
let actualTasks = [];
const elementsOnPage = 5;
let page = 1;

const renderTask = () => {
  const countOfPages = Math.ceil(allTasks.length / elementsOnPage)
  if (page > countOfPages) {
    page = countOfPages
  }
  let start = (page - 1) * elementsOnPage;
  let end = start + elementsOnPage;
  let pages = Array.from({ length: countOfPages }, (_, idx) => `${++idx}`);

  actualTasks = allTasks.slice(start, end);

  const pagesHTML = pages.map((i) => `<li class="page-item ${page === i && 'active'}"><a class="page-link" href="#">${i}</a></li>`)
  paginationList.innerHTML = pagesHTML.join('')

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
}

if (localStorage.getItem('allTasks')) {
  allTasks = JSON.parse(localStorage.getItem('allTasks'));
  renderTask()
}

const saveToLocalStorage = () => {
  localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

const checkEmptyList = () => {
  if (allTasks.length === 0) {
    const emptyListHTML =
      `<li id="emptyList" class="list-group-item empty-list">
             <img src="../img/leaf.svg" alt="Empty" width="48" class="mt-3">
             <div class="empty-list__title">Список дел пуст</div>
             </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
  if (allTasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

const addTask = (event) => {
  event.preventDefault();
  const taskText = taskInput.value;
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
  page = (event.target.text)
  renderTask()
});
