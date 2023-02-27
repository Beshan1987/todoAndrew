import * as constant from "./constants.js";
import * as view from "./view.js";

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

export let tasks = getSavedTasks();
tasks.forEach((json) => view.checkTask(json));

function getSavedTasksTotal() {
	const storedTasksTotal = localStorage.getItem("totalAmount");
	return storedTasksTotal ? storedTasksTotal : 0;
}
constant.tasksAll.textContent = `All: ${getSavedTasksTotal()}`;

function getSavedTasksDone() {
	const storedTasksDone = localStorage.getItem("doneTasksAmount");
	return storedTasksDone ? storedTasksDone : 0;
}
constant.tasksDone.textContent = `Completed: ${getSavedTasksDone()}`;

function getSavedTasksCurrent() {
	const storedTasksCurrent = localStorage.getItem("currentTasksAmount");
	return storedTasksCurrent ? storedTasksCurrent : 0;
}
constant.tasksCurrent.textContent = `In-process: ${getSavedTasksCurrent()}`;

export function saveToLocalStorage() {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function saveToLocalStorageAmountALL() {
	localStorage.setItem("totalAmount", JSON.stringify(tasks.length));
	constant.tasksAll.textContent = `All: ${tasks.length}`;
}

export function saveToLocalStorageAmountTasksDone() {
	localStorage.setItem(
		"doneTasksAmount",
		JSON.stringify(tasks.filter((task) => task.isChecked).length)
	);
	constant.tasksDone.textContent = `Completed: ${
		tasks.filter((task) => task.isChecked).length
	}`;
}

export function saveToLocalStorageAmountTasksCurrent() {
	localStorage.setItem(
		"currentTasksAmount",
		JSON.stringify(tasks.filter((task) => !task.isChecked).length)
	);
	constant.tasksCurrent.textContent = `In-process: ${
		tasks.filter((task) => !task.isChecked).length
	}`;
}
