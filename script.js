class Todo {
  constructor() {
    this.tasks = [];
    this.term = '';
    this.initializeTasksFromLocalStorage();
  }

  addTask(taskText, deadline) {
    const newTask = {
      text: taskText,
      deadline: deadline
    };
    this.tasks.push(newTask);
    this.saveTasksToLocalStorage();
    this.draw();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.saveTasksToLocalStorage();
    this.draw();
  }

 
  getFilteredTasks() {
    const searchTerm = this.term.toLowerCase().trim(); 

    return this.tasks.filter(task => {
      const taskText = task.text.toLowerCase();

      // Sprawdzamy, czy tekst zadania zawiera wyszukiwaną frazę
      return taskText.includes(searchTerm);
    });
  }

draw() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const searchTerm = this.term.toLowerCase().trim();

  this.tasks.forEach((task, index) => {
    const taskTextContent = task.text.toLowerCase();

    if (taskTextContent.includes(searchTerm)) {
      const li = document.createElement("li");
      const taskText = document.createElement("span");
      const formattedDeadline = task.deadline ? new Date(task.deadline).toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }) : "";

      let displayedText = task.text;
      if (formattedDeadline) {
        displayedText += ` ${formattedDeadline}`;
      }

      const matchIndex = taskTextContent.indexOf(searchTerm);
      const beforeMatch = displayedText.substring(0, matchIndex);
      const matchText = displayedText.substring(matchIndex, matchIndex + searchTerm.length);
      const afterMatch = displayedText.substring(matchIndex + searchTerm.length);

      taskText.innerHTML = `${beforeMatch}<span class="highlight">${matchText}</span>${afterMatch}`;
      li.appendChild(taskText);
      li.addEventListener("click", () => {
        this.enableTaskEditing(li, index);
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Usuń";
      deleteBtn.addEventListener("click", () => {
        this.deleteTask(index);
      });
      li.appendChild(deleteBtn);

      taskList.appendChild(li);
    }
  });
}


addSampleTasks() {
  const sampleTasksAdded = localStorage.getItem('sampleTasksAdded');
  if (!sampleTasksAdded) {
    this.addTask("Dokończyć to-do list", "2023-11-15T23:59");
    this.addTask("Zamarynować rybę", "2023-11-21T20:00");
    this.addTask("Zrobić tiramisu", "2023-11-22T22:00");
    localStorage.setItem('sampleTasksAdded', 'true');
  }
}


  attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.deleteTask(index);
      });
    });
  }

  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  initializeTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.draw();
    }
  }

  setTerm(searchTerm) {
    this.term = searchTerm;
    this.draw();
  }

  printLocalStorage() {
    console.log("Zawartość LocalStorage:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  }
  
}

document.addEventListener("DOMContentLoaded", function() {
  const todo = new Todo();

  todo.addSampleTasks();
  todo.printLocalStorage();

  const newTaskInput = document.getElementById("newTaskInput");
  const taskDeadline = document.getElementById("taskDeadline");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const searchInput = document.getElementById("searchInput");

  addTaskBtn.addEventListener("click", function() {
    const taskText = newTaskInput.value.trim();
    const deadline = taskDeadline.value;

    // Walidacja
    if (taskText.length < 3 || taskText.length > 255) {
      alert("Zbyt krótki lub długi tekst");
      return;
    }
    if (new Date(deadline) <= new Date()) {
      alert("Nie można cofnąć się w czasie :)");
      return;
    }

    todo.addTask(taskText, deadline);
    newTaskInput.value = "";
    taskDeadline.value = "";
  });

  searchInput.addEventListener("input", function() {
    todo.draw();
  });

  taskList.addEventListener("input", function(event) {
    const target = event.target;
    const taskIndex = [...target.parentElement.parentElement.children].indexOf(target.parentElement);

    if (target.tagName === "INPUT") {
      const newText = target.previousSibling.textContent;
      const newDeadline = target.value;
      todo.editTask(taskIndex, newText, newDeadline);
    }
  });

  searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.trim();

    // Walidacja, żeby wyszukiwanie zaczynało się po wpisaniu co najmniej 2 znaków
    if (searchTerm.length >= 2) {
      todo.setTerm(searchTerm); // Ustawiamy frazę wyszukiwania
    } else {
      todo.setTerm(''); // Jeśli wpisano mniej niż 2 znaki, wyświetlamy wszystkie zadania
    }
  });
});
