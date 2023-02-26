import * as constant from "./constants.js";
import * as model from "./model.js";
import { tasks } from "./model.js";
import * as filter from "./filter.js";
import * as view from "./view.js";
import * as app from "./app.js";

constant.form.addEventListener("submit", addTask);
constant.form.addEventListener("click", onFormClick);
constant.tasksList.addEventListener("click", onListClick);
constant.formSearch.addEventListener("submit", filter.searchTask);

function onFormClick(event) {
	const {
		target: {
			dataset: { action },
		},
	} = event;

	switch (action) {
		case "deleteIAll":
			app.deleteAllTasks(event);
			break;
		case "deleteLast":
			app.deleteLast(event);
			break;
		case "showCompleted":
			filter.showCompleted(event);
			break;
		case "showAll":
			filter.showAll(event);
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
			app.deleteTask(event);
			break;
		case "done":
			app.doneTask(event);
			break;
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
	model.saveToLocalStorage();
	view.checkTask(newTask);
	filter.reactBtn();
	constant.taskInput.value = "";
	constant.taskInput.focus();
	model.saveToLocalStorageAmountALL();
}
