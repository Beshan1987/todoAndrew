import { tasks } from "./model.js";
import * as constant from "./constants.js";
import * as view from "./view.js";

export function reactBtn() {
	if (tasks.length > 0) {
		constant.btnDeleteAll.removeAttribute("disabled");
		constant.btnDeleteLast.removeAttribute("disabled");
	}
	if (tasks.length === 0) {
		constant.btnDeleteAll.setAttribute("disabled", "disabled");
		constant.btnDeleteLast.setAttribute("disabled", "disabled");
	}
	if (tasks.filter((value) => value.isChecked).length > 0) {
		constant.btnDone.removeAttribute("disabled");
	} else constant.btnDone.setAttribute("disabled", "disabled");

	if (constant.tasksList.children.length < tasks.length) {
		constant.btnShowAll.removeAttribute("disabled");
	} else constant.btnShowAll.setAttribute("disabled", "disabled");
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

export function showAll() {
	while (constant.tasksList.firstChild) {
		constant.tasksList.firstChild.remove();
	}
	tasks.forEach((json) => view.checkTask(json));
	reactBtn();
}
