// Retrieve tasks from localStorage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to render tasks on the task board
function renderTasks() {
  const todoList = $("#todo-list");
  const inProgressList = $("#in-progress-list");
  const doneList = $("#done-list");

  todoList.empty();
  inProgressList.empty();
  doneList.empty();

  tasks.forEach((task) => {
    const taskCard = $("<div>").addClass("card task-card");
    const taskBody = $("<div>").addClass("card-body");
    const taskTitle = $("<h5>").addClass("card-title").text(task.title);
    const taskDescription = $("<p>")
      .addClass("card-text")
      .text(task.description);
    const taskDueDate = $("<p>")
      .addClass("card-text")
      .text(`Due: ${task.dueDate}`);
    const deleteButton = $("<button>")
      .addClass("btn btn-danger btn-sm")
      .text("Delete")
      .click(() => deleteTask(task.id));

    taskBody.append(taskTitle, taskDescription, taskDueDate, deleteButton);
    taskCard.append(taskBody);

    if (task.status === "todo") {
      taskCard.addClass("todo");
      todoList.append(taskCard);
    } else if (task.status === "in-progress") {
      taskCard.addClass("in-progress");
      inProgressList.append(taskCard);
    } else if (task.status === "done") {
      taskCard.addClass("done");
      doneList.append(taskCard);
    }

    // TODO: Color-code tasks based on due date
    const currentDate = dayjs();
    const dueDate = dayjs(task.dueDate);

    if (dueDate.isBefore(currentDate)) {
      taskCard.addClass("overdue");
    } else if (dueDate.diff(currentDate, "day") <= 2) {
      taskCard.addClass("nearing-deadline");
    }
  });

  // TODO: Make task lists sortable using jQuery UI
  $(".task-list").sortable({
    connectWith: ".task-list",
    update: function (event, ui) {
      const taskId = ui.item.data("task-id");
      const newStatus = $(this).attr("id").replace("-list", "");
      updateTaskStatus(taskId, newStatus);
    },
  });
}

// Function to add a new task
function addTask(title, description, dueDate) {
  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    status: "todo",
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
}

// Function to delete a task
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Function to update the status of a task
function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });

  saveTasks();
}

// TODO: Handle form submission to add a new task
$("#taskForm").submit(function (event) {
  event.preventDefault();

  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const dueDate = $("#taskDueDate").val();

  addTask(title, description, dueDate);

  $("#taskForm").trigger("reset");
  $("#formModal").modal("hide");
});

// TODO: Render tasks on page load
$(document).ready(function () {
  renderTasks();

  // TODO: Initialize the datepicker for the due date field
  $("#taskDueDate").datepicker({
    dateFormat: "yy-mm-dd",
  });
});
