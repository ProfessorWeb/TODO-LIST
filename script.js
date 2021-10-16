'use strict';

/*Select Elements*/
const body = document.querySelector('body');
const formTask = document.querySelector('.form-task');
const taskInput = document.querySelector('.task-input');
const SelectPriority = document.querySelector('.form-select');
const ListTasks = document.querySelector('.fw-normal');
const link = document.querySelector('table');

/*------Class CreateTask------*/
class CreateTask {
  id = Date.now();
  constructor(task, priority, color) {
    this.task = task;
    this.priority = priority;
    this.color = color;
  }
}

/*------Class App------*/
class App extends CreateTask {
  #TasksList = [];
  constructor(task, priority, color) {
    super(task, priority, color);

    // get Data From LocalStorage
    this.getlist();

    // submit form - new task
    formTask.addEventListener('submit', this.addTask.bind(this));

    // remove task submit
    link.addEventListener('click', this.removeTask.bind(this));

    // Completed task submit
    link.addEventListener('click', this.CompleteTask.bind(this));

    // focus on taskinput
    taskInput.focus();
  }

  addTask(e) {
    e.preventDefault();

    // input value
    const task = taskInput.value;
    const priority = SelectPriority.value;
    let tasks;

    // Guard Clause
    if (!task) return;

    // Push task on TaskList
    if (task) {
      // Create new task
      tasks = new CreateTask(task, priority);

      // color priority
      if (tasks.priority === 'Low') tasks.color = 'bg-success';
      if (tasks.priority === 'Normal') tasks.color = 'bg-primary';
      if (tasks.priority === 'High') tasks.color = 'bg-danger';

      // push task to the #TaskList
      this.#TasksList.push(tasks);

      // ShowTaskList
      this.showTaskList(tasks);

      // SaveTaskList
      this.saveList(tasks);
    }
  }

  showTaskList(value) {
    const html = `
    <th>
<img
  src="task.png"
  alt="task-icon"
  style="width: 45px; height: auto"
/>
<span class="ms-2">${value.task}</span>
</th>
<td class="align-middle priority-class">
<span class="badge ${value.color}">${value.priority}</span>
</td>
<td class="align-middle">
<h6 class="mb-0" data-id="${value.id}">
  <a class="remove-link" href="#"><span class="badge bg-gradient remove">❌</span></a>

  <a class="complete-link" href="#"><span class="badge bg-gradient complete">✔</span></a>

</h6>
</td>`;

    // insert html
    ListTasks.insertAdjacentHTML('afterend', html);

    // clear input after submit
    taskInput.value = '';

    // change input after submit
    SelectPriority.value = 'Normal';
  }

  saveList() {
    // Saves the data this.#TaskList[] {key,value}
    localStorage.setItem('saveTask', JSON.stringify(this.#TasksList));
  }

  getlist() {
    // get data From this.#TaskList[]
    const data = JSON.parse(localStorage.getItem('saveTask'));
    // if data === null or underfind return
    if (!data) return;

    // #TasksList = data Beacuse data we have data not the #TasksList. and we say #TasksList = data
    this.#TasksList = data;

    // Here we loop array on #TasksList
    this.#TasksList.forEach(data => this.showTaskList(data));
  }

  removeTask(e) {
    e.preventDefault();
    const id = e.target;

    // Event delegation
    if (id.classList.contains('remove')) {
      const link = id.closest('h6');

      // find index TASK
      const index = this.#TasksList.findIndex(i => i.id === +link.dataset.id);

      // After We find index Delete it from the array this.#TasksList[]
      this.#TasksList.splice(index, 1);

      // We need save it beacuse if we dont save. when we reload page task still stay.
      this.saveList();

      // Reload Page
      location.reload();
    }
  }

  CompleteTask(e) {
    e.preventDefault();
    const id = e.target;

    //// Event delegation
    if (id.classList.contains('complete')) {
      const link = id.closest('h6');

      // find Task as per id.
      const task = this.#TasksList.find(i => i.id === +link.dataset.id);

      // The task was found. and we change value in object task correct
      task.priority = 'complate';
      task.color = 'bg-success';

      // We need save it beacuse if we dont save. when we reload page task.priority and task.color dont chanche
      this.saveList();

      // Reload Page
      location.reload();
    }
  }
}

const app = new App(); // runing App
