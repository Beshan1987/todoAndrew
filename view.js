import * as app from "./filter.js";
import * as constant from "./constants.js";

export function checkTask(task) {
	const taskHTML = `<li id="${
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
	app.reactBtn();
}
