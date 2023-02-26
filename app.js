import * as constant from "./constants.js";
import * as model from "./model.js";
import { tasks } from "./model.js";
import * as filter from "./filter.js";

export function deleteTask(event) {
	const parenNode = event.target.closest(".list-group-item");
	const id = Number(parenNode.id);
	tasks.splice(
		tasks.findIndex((task) => task.id === id),
		1
	);
	model.saveToLocalStorage();
	model.saveToLocalStorageAmountALL();
	parenNode.remove();
	model.saveToLocalStorageAmountTasksDone();
	model.saveToLocalStorageAmountTasksCurrent();
	filter.reactBtn();
}

export function deleteAllTasks() {
	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
		tasks.pop();
	}

	model.saveToLocalStorage();
	model.saveToLocalStorageAmountALL();
	model.saveToLocalStorageAmountTasksDone();
	model.saveToLocalStorageAmountTasksCurrent();
	filter.reactBtn();
}

export function deleteLast() {
	tasks.pop();
	if (constant.tasksList.children.length > 0) {
		constant.tasksList.lastElementChild.remove();
	}
	model.saveToLocalStorage();
	model.saveToLocalStorageAmountALL();
	model.saveToLocalStorageAmountTasksDone();
	model.saveToLocalStorageAmountTasksCurrent();
	filter.reactBtn();
}

export function doneTask(event) {
	const parentNode = event.target.closest(".list-group-item");
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.isChecked = !task.isChecked;

	model.saveToLocalStorage();

	const taskTitle = parentNode.querySelector(".task-title");
	taskTitle.classList.toggle("task-title--done");
	parentNode.classList.toggle("list-group-item--done");
	const taskDate = parentNode.querySelector(".text-dar");
	taskDate.classList.toggle("task-title--done");
	model.saveToLocalStorageAmountTasksDone();
	model.saveToLocalStorageAmountTasksCurrent();
	filter.reactBtn();
}
