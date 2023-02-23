const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const tasksAll = document.querySelector("#tasksAll");
const tasksDone = document.querySelector("#tasksDone");
const btnDone = document.querySelector(".btn-outline-success");
const btnShowAll = document.querySelector(".btn-outline-info");

function safeParseJSON(json) {
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

function getSavedTasks() {
	const storedTasks = localStorage.getItem("tasks");
	return safeParseJSON(storedTasks) || [];
}

let tasks = getSavedTasks();
tasks.forEach((json) => checkTask(json));

form.addEventListener("submit", addTask);
form.addEventListener("click", onFormClick);
tasksList.addEventListener("click", onListClick);

function onFormClick(event) {
	const {
		target: {
			dataset: { action },
		},
	} = event;

	switch (action) {
		case "deleteIAll":
			deleteAllTasks(event);
			break;
		case "deleteLast":
			deleteLast(event);
			break;
		case "showCompleted":
			showCompleted(event);
			break;
		case "showAll":
			showAll(event);
			break;
	}
}

function onListClick(event) {
	const {
		target: {
			dataset: { action },
		},
	} = event;

	switch (action) {
		case "delete":
			deleteTask(event);
			break;
		case "done":
			doneTask(event);
			break;
	}
}

function reactBtn() {
	let arrayBtn = form.children;
	for (let i = 0; i < arrayBtn.length; i += 1) {
		if (arrayBtn[i].hasAttribute("data-action") && tasks.length > 0) {
			arrayBtn[i].removeAttribute("disabled");
		}
		if (arrayBtn[i].hasAttribute("data-action") && tasks.length === 0) {
			arrayBtn[i].setAttribute("disabled", "disabled");
		}
		if (
			arrayBtn[i].classList.contains("btn-outline-success") &&
			tasks.filter((value) => value.isChecked).length > 0
		) {
			arrayBtn[i].removeAttribute("disabled");
		}
		if (
			arrayBtn[i].classList.contains("btn-outline-success") &&
			tasks.filter((value) => value.isChecked).length === 0
		) {
			arrayBtn[i].setAttribute("disabled", "disabled");
		}
	}
	if (tasksList.children.length < tasks.length) {
		btnShowAll.removeAttribute("disabled");
	} else btnShowAll.setAttribute("disabled", "disabled");
}

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
	reactBtn();
	taskInput.value = "";
	taskInput.focus();
	saveToLocalStorageAmountALL();
}

function deleteTask(event) {
	const parenNode = event.target.closest(".list-group-item");
	const id = Number(parenNode.id);
	tasks = tasks.filter((task) => task.id !== id);
	saveToLocalStorage();
	saveToLocalStorageAmountALL();
	parenNode.remove();
	saveToLocalStorageAmountTasksDone();
	reactBtn();
}

function deleteAllTasks() {
	while (tasksList.firstChild) {
		tasks = tasks.filter((value) => +value.id !== +tasksList.firstChild.id);
		tasksList.firstChild.remove();
	}
	saveToLocalStorage();
	saveToLocalStorageAmountALL();
	saveToLocalStorageAmountTasksDone();
	reactBtn();
}

function showCompleted() {
	const tasksAll = tasks.filter((value) => value.isChecked);

	while (tasksList.firstChild) {
		tasksList.firstChild.remove();
	}

	for (let key of tasksAll) {
		checkTask(key);
	}
	reactBtn();
}

function showAll() {
	while (tasksList.firstChild) {
		tasksList.firstChild.remove();
	}
	tasks.forEach((json) => checkTask(json));
	reactBtn();
}

function deleteLast() {
	tasks.pop();
	if (tasksList.children.length > 0) {
		tasksList.lastElementChild.remove();
	}
	saveToLocalStorage();
	saveToLocalStorageAmountALL();
	saveToLocalStorageAmountTasksDone();
	reactBtn();
}

function doneTask(event) {
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
	saveToLocalStorageAmountTasksDone();
	reactBtn();
}

function saveToLocalStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveToLocalStorageAmountALL() {
	localStorage.setItem("totalAmount", JSON.stringify(tasks.length));
	tasksAll.textContent = `All: ${tasks.length}`;
}

function saveToLocalStorageAmountTasksDone() {
	localStorage.setItem(
		"doneTasksAmount",
		JSON.stringify(tasks.filter((task) => task.isChecked).length)
	);
	tasksDone.textContent = `Completed: ${
		tasks.filter((task) => task.isChecked).length
	}`;
}

tasksAll.textContent = `All: ${JSON.parse(
	localStorage.getItem("totalAmount")
)}`;

tasksDone.textContent = `Completed: ${JSON.parse(
	localStorage.getItem("doneTasksAmount")
)}`;

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
						<span class="badge text-dar middle ${cssClass}">${date}</span>						
					</div>
				</li>`;
	tasksList.insertAdjacentHTML("beforeend", taskHTML);
	reactBtn();
}
