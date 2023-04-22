// 1. Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
// const emptyList = document.querySelector("#emptyList"); // После создания массива неактуально !!!

// 14. Создание массива для хранения данных (на старте он пуст)
let tasks = [];

// 26. Проверяем, есть ли что-то в LS и если есть - парсим и перезаписываем в tasks
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
// 27. Рендерим полученные из LS элементы на странице
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList(); // Первое появление блока "Список дел пуст"

// 2. Добавляем задачу
form.addEventListener("submit", addTask);
// 9. Удаляем задачу
tasksList.addEventListener("click", deleteTask);
// 12. Отмечаем задачу выполненной
tasksList.addEventListener("click", doneTask);


// Function Declaration - можно вызывать до объявления
function addTask(event) {
// 3. Отменяем отправку формы и обновление страницы
    event.preventDefault();

// 4. Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

// 15. Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(), // создание нового id в момент создания новой задачи через привязку к текущему времени (в ms)
        text: taskText,
        done: false,
    }

// 16. Добавляем новую задачу в массив с задачами
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

// Вынесли в отдельную функцию - renderTask !!!
// // 17. Формируем CSS-класс, который будет добавлен к задаче в зависимости от ее выполнения
//     const cssClass = newTask.done ? "task-title task-title--done" : "task-title";
//
// // 5. Формируем разметку для новой задачи
//     const taskHTML =
//         `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
//             <span class="${cssClass}">${newTask.text}</span>
//             <div class="task-item__buttons">
//                 <button type="button" data-action="done" class="btn-action">
//                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
//                  </button>
//                  <button type="button" data-action="delete" class="btn-action">
//                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
//                  </button>
//              </div>
//         </li>`
//
// // 6. Добавляем задачу на страницу
//     tasksList.insertAdjacentHTML("beforeend", taskHTML);


// 7. Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

//После создания массива неактуально !!!
// // 8. Проверка. Если в списке задач более 1-го элемента, скрываем блок
//     if (tasksList.children.length > 1) {
//         emptyList.classList.add("none");
//     } // возвращает коллекцию с дочерними элементами

    checkEmptyList();
}

function deleteTask(event) {
// 10. Проверяем, если клик был НЕ по кнопке "Удалить"
    if (event.target.dataset.action !== "delete") return;

// 10.1 Если клик был по кнопке "Удалить" - код отрабатывает дальше
    const parentNode = event.target.closest("li"); // антоним querySelector, который ищет не внутри, а снаружи

// 18. Определяем ID задачи
    const id = Number(parentNode.id); // приводим id к числу, т.к. изначально данные, полученные из разметки - это строки

// 19. Удаляем задачу из массива с задачами
// 1-й способ - удаление задачи по индексу
// - Находим индекс задачи в массиве
//     const index = tasks.findIndex((task) => task.id === id) // короткий вариант, возвращающий результат сравнения
    // if (task.id === id) {
    //     return true;
    // }
// - Удаляем задачу из массива
//     tasks.splice(index,1);

// 2-й способ - удаление задачи через фильтрацию массива
    tasks = tasks.filter((task) => task.id !== id);
    // if (task.id === id) {
    //     return false
    // } else {
    //     return true
    // };

    saveToLocalStorage();

// 20. Удаляем задачу из разметки
    parentNode.remove();

//После создания массива неактуально !!!
// 11. Проверка. Если в списке задач снова 1 элемент ("Список задач пуст"), возвращаем блок на страницу
//     if (tasksList.children.length === 1) {
//         emptyList.classList.remove("none");
//     }

    checkEmptyList();
}

function doneTask(event) {
// 13. Проверяем, если клик был по НЕ кнопке "Задача выполнена"
    if (event.target.dataset.action !== "done") return;

// 13.1 Если клик был по кнопке "Задача выполнена" - код отрабатывает дальше
    const parentNode = event.target.closest(".list-group-item");

// 21. Определяем ID задачи
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    // if(task.id === id) {
    //     return true
    // }

// 22. Изменяем состояние задачи на уровне данных (изначально done == false)
    task.done = !task.done;

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done"); // Изменяем состояние задачи в разметке
}

function checkEmptyList() {

// 23. Проверяем, пуст ли массив с задачами
    if (tasks.length === 0) {
        const emptyListHTML =
            `<li id="emptyList" class="list-group-item empty-list">
             <img src="../img/leaf.svg" alt="Empty" width="48" class="mt-3">
             <div class="empty-list__title">Список дел пуст</div>
             </li>`;
// 23.1 Если да - отрисовываем блок "Список задач пуст"
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
// 24. Если нет:
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList"); // Получаем ранее добавленную разметку
        emptyListEl ? emptyListEl.remove() : null; // и если находим ее на странице - удаляем
    }
}

// 25. Сохраняем массив с задачами в Local Storage
// (и потом вызываем функцию при каждом изменении данных на странице)
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
// Формируем CSS-класс, который будет добавлен к задаче в зависимости от ее выполнения
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

// Формируем разметку для новой задачи
    const taskHTML =
        `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
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

// Добавляем задачу на страницу
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}