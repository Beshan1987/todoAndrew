import { tasks } from "./model.js";
import * as constant from "./constants.js";
import * as view from "./view.js";

export function reactBtn() {
	if (tasks.length > 0) {
		constant.btnDeleteAll.removeAttribute("disabled");
		constant.btnDeleteLast.removeAttribute("disabled");
		constant.radioShowAll.removeAttribute("disabled");
		constant.radioShowAll.setAttribute("checked", "checked");
		constant.radioShowFound.removeAttribute("checked");
	}
	if (tasks.length === 0) {
		constant.btnDeleteAll.setAttribute("disabled", "disabled");
		constant.btnDeleteLast.setAttribute("disabled", "disabled");
	}

	if (tasks.filter((value) => value.isChecked).length > 0) {
		constant.radioDone.removeAttribute("disabled");
		constant.radioShowCurrent.removeAttribute("disabled");
	} else {
		constant.radioDone.setAttribute("disabled", "disabled");
		constant.radioShowCurrent.setAttribute("disabled", "disabled");
	}
	constant.radioShowFound.setAttribute("disabled", "disabled");
	constant.radioShowFound.removeAttribute("checked");
}

export function searchTask(event) {
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
			view.checkTask(key);
		}
		reactBtn();
	}
	if (AllTaskfound.length === 0) {
		while (constant.tasksList.firstChild) {
			constant.tasksList.firstChild.remove();
		}
	}

	constant.radioShowFound.removeAttribute("disabled");
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

export function showCompleted() {
	const tasksAll = tasks.filter((value) => value.isChecked);

	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}

	for (let key of tasksAll) {
		view.checkTask(key);
	}

	reactBtn();
}

export function showCurrent() {
	const tasksAll = tasks.filter((value) => !value.isChecked);

	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}

	for (let key of tasksAll) {
		view.checkTask(key);
	}
	reactBtn();
}

export function showAll() {
	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}
	tasks.forEach((task) => view.checkTask(task));
	reactBtn();
}
