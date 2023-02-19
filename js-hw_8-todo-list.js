const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const taskDeleteAll = document.querySelector("#taskDeleteAll");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
	tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks.forEach((task) => checkTask(task));
}

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);
taskDeleteAll.addEventListener("click", DeleteAllTasks);

function addTask(event) {
	event.preventDefault();
	const taskText = taskInput.value;
	const newTask = {
		id: Date.now(),
		text: taskText,
		isChecked: false,
		date: new Date().toLocaleString(),
	};

	tasks.push(newTask);
	saveToLocalStorage();
	checkTask(newTask);
	taskInput.value = "";
	taskInput.focus();
}

function deleteTask(event) {
	if (event.target.dataset.action !== "delete") return;
	const parenNode = event.target.closest(".list-group-item");
	const id = Number(parenNode.id);
	tasks = tasks.filter((task) => task.id !== id);
	saveToLocalStorage();

	parenNode.remove();
}

function DeleteAllTasks() {
	while (tasksList.firstChild) {
		tasks = tasks.filter((value) => +value.id !== +tasksList.firstChild.id);
		tasksList.firstChild.remove();
	}
	saveToLocalStorage();
}

function doneTask(event) {
	if (event.target.dataset.action !== "done") return;
	const parentNode = event.target.closest(".list-group-item");
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.isChecked = !task.isChecked;

	saveToLocalStorage();

	const taskTitle = parentNode.querySelector(".task-title");
	taskTitle.classList.toggle("task-title--done");
	parentNode.classList.toggle("list-group-item--done");
	const taskDate = parentNode.querySelector(".text-dar");
	taskDate.classList.toggle("task-title--done");
}

function saveToLocalStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function checkTask(task) {
	const cssClass = task.isChecked
		? "task-title task-title--done"
		: "task-title";
	const cssClassBG = task.isChecked
		? "list-group-item list-group-item--done"
		: "list-group-item";
	const date = task.date;

	const taskHTML = `
                <li id="${task.id}" class="d-flex justify-content-between task-item ${cssClassBG}">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
						<span class="badge bg-light text-dar middle ${cssClass}">${date}</span>						
					</div>
				</li>`;

	tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
