import * as constant from "./constants.js";

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

constant.form.addEventListener("submit", addTask);
constant.form.addEventListener("click", onFormClick);
constant.tasksList.addEventListener("click", onListClick);
constant.formSearch.addEventListener("submit", searchTask);

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
	let allBtn = constant.form.children;
	for (let i = 0; i < allBtn.length; i += 1) {
		if (allBtn[i].hasAttribute("data-action") && tasks.length > 0) {
			allBtn[i].removeAttribute("disabled");
		}
		if (allBtn[i].hasAttribute("data-action") && tasks.length === 0) {
			allBtn[i].setAttribute("disabled", "disabled");
		}
		if (
			allBtn[i].classList.contains("btn-outline-success") &&
			tasks.filter((value) => value.isChecked).length > 0
		) {
			allBtn[i].removeAttribute("disabled");
		}
		if (
			allBtn[i].classList.contains("btn-outline-success") &&
			tasks.filter((value) => value.isChecked).length === 0
		) {
			allBtn[i].setAttribute("disabled", "disabled");
		}
	}
	if (constant.tasksList.children.length < tasks.length) {
		constant.btnShowAll.removeAttribute("disabled");
	} else constant.btnShowAll.setAttribute("disabled", "disabled");
}

function searchTask(event) {
	event.preventDefault();
	let AllTaskfound = tasks.filter((tasks) =>
		searchID(
			constant.taskSearch.value.toLowerCase().trim(),
			tasks.text.toLowerCase()
		)
	);
	if (AllTaskfound.length > 0) {
		while (constant.tasksList.firstChild) {
			constant.tasksList.firstChild.remove();
		}

		for (let key of AllTaskfound) {
			checkTask(key);
		}
		reactBtn();
	}
	if (AllTaskfound.length === 0) {
		while (constant.tasksList.firstChild) {
			constant.tasksList.firstChild.remove();
		}
		reactBtn();
	}

	constant.taskSearch.focus();
	constant.taskSearch.value = "";
}

function searchID(searchValue, taskValue) {
	if (taskValue.search(searchValue) != -1) {
		return true;
	} else {
		return false;
	}
}

function addTask(event) {
	event.preventDefault();
	if (constant.taskInput.value.trim() == "") {
		return;
	}
	const taskText = constant.taskInput.value;
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
	constant.taskInput.value = "";
	constant.taskInput.focus();
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
	while (constant.tasksList.firstChild) {
		tasks = tasks.filter(
			(value) => +value.id !== +constant.tasksList.firstChild.id
		);
		constant.tasksList.firstChild.remove();
	}
	saveToLocalStorage();
	saveToLocalStorageAmountALL();
	saveToLocalStorageAmountTasksDone();
	reactBtn();
}

function showCompleted() {
	const tasksAll = tasks.filter((value) => value.isChecked);

	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}

	for (let key of tasksAll) {
		checkTask(key);
	}
	reactBtn();
}

function showAll() {
	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}
	tasks.forEach((json) => checkTask(json));
	reactBtn();
}

function deleteLast() {
	tasks.pop();
	if (constant.tasksList.children.length > 0) {
		constant.tasksList.lastElementChild.remove();
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
	constant.tasksAll.textContent = `All: ${tasks.length}`;
}

function saveToLocalStorageAmountTasksDone() {
	localStorage.setItem(
		"doneTasksAmount",
		JSON.stringify(tasks.filter((task) => task.isChecked).length)
	);
	constant.tasksDone.textContent = `Completed: ${
		tasks.filter((task) => task.isChecked).length
	}`;
}

constant.tasksAll.textContent = `All: ${JSON.parse(
	localStorage.getItem("totalAmount")
)}`;

constant.tasksDone.textContent = `Completed: ${JSON.parse(
	localStorage.getItem("doneTasksAmount")
)}`;

function checkTask(task) {
	const taskHTML = `
                <li id="${
									task.id
								}" class="d-flex justify-content-between task-item ${
		task.isChecked ? "list-group-item list-group-item--done" : "list-group-item"
	}">
					<span class="${
						task.isChecked ? "task-title task-title--done" : "task-title"
					}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
						<span class="badge text-dar middle ${
							task.isChecked ? "task-title task-title--done" : "task-title"
						}">${task.date}</span>						
					</div>
				</li>`;
	constant.tasksList.insertAdjacentHTML("beforeend", taskHTML);
	reactBtn();
}
