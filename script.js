function changeTheme() {
  const themeSelect = document.getElementById("themeSelect");
  const html = document.documentElement;
  const themeTitle = document.getElementById("themeTitle");

  html.setAttribute("data-theme", themeSelect.value);

  const themeIcons = {
    frog: {
      icon: "mdi-frog",
      emoji: "🐸",
      extraIcons: {
        left: ["mdi-frog", "mdi-leaf", "mdi-water"],
        right: ["mdi-water", "mdi-leaf", "mdi-frog"],
      },
      favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐸</text></svg>`,
      titleColor: "#1B4332", // Darker green
    },
    bunny: {
      icon: "mdi-rabbit",
      emoji: "🐰",
      extraIcons: {
        left: ["mdi-rabbit"],
        right: ["mdi-leaf"],
      },
      favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐰</text></svg>`,
      titleColor: "#994348", // Darker pink
    },
    cat: {
      icon: "mdi-cat",
      emoji: "🐱",
      extraIcons: {
        left: ["mdi-cat"],
        right: ["mdi-leaf"],
      },
      favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐱</text></svg>`,
      titleColor: "#2D2D2D", // Darker gray
    },
    swan: {
      icon: "mdi-duck",
      emoji: "🦢",
      extraIcons: {
        left: ["mdi-duck"],
        right: ["mdi-leaf"],
      },
      favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦢</text></svg>`,
      titleColor: "#1A365D", // Darker blue
    },
  };

  const selectedTheme = themeIcons[themeSelect.value];

  // Create icon groups HTML
  const createIconGroup = (icons, isRight = false) => {
    return icons
      .map(
        (icon, index) => `
      <i class="mdi ${icon}" style="
        font-size: ${icon === "mdi-leaf" ? "32px" : "40px"};
        color: ${selectedTheme.titleColor};
        opacity: ${0.85 - index * 0.2};
        transform: ${
          icon === "mdi-frog" ? `scaleX(${isRight ? 1 : -1})` : "none"
        };
        margin: ${isRight ? "0 0 0 -8px" : "0 -8px 0 0"};
        ${icon === "mdi-water" ? "transform: translateY(4px);" : ""}
      "></i>
    `
      )
      .join("");
  };

  // Update title and favicon with new styling
  themeTitle.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      gap: 16px;
      margin-left: 24px;
    ">
      <div style="display: flex; align-items: center;">
        ${createIconGroup(selectedTheme.extraIcons.left)}
      </div>
      <span style="
        font-family: 'Dancing Script', cursive;
        font-size: 64px;
        color: ${selectedTheme.titleColor};
        font-weight: 700;
        letter-spacing: 1px;
        line-height: 1;
      ">To-Do List</span>
      <div style="display: flex; align-items: center;">
        ${createIconGroup(selectedTheme.extraIcons.right, true)}
      </div>
    </div>
  `;

  document.getElementById("dynamic-favicon").href = selectedTheme.favicon;
  document.getElementById("dynamic-favicon-apple").href = selectedTheme.favicon;
  document.title = `To-Do List`;
}

// Helper function to format time in 12-hour format
function formatTime(hour) {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

// Helper function to generate time options
function generateTimeOptions(currentTime) {
  const times = [];
  for (let i = 0; i < 24; i++) {
    const timeString = formatTime(i);
    times.push(
      `<option value="${timeString}" ${
        timeString === currentTime ? "selected" : ""
      }>${timeString}</option>`
    );
  }
  return times.join("");
}

// Task Management
function createTaskElement(taskData) {
  const taskItem = document.createElement("div");
  taskItem.className = `task-item ${
    taskData.priority ? taskData.priority + "-priority" : ""
  }`;

  // Define category and theme colors
  const categoryStyles = {
    work: {
      bg: "#FFB5BA", // Light Pink
      text: "#994348", // Darker Pink
    },
    personal: {
      bg: "#B5DEFF", // Light Blue
      text: "#1B4B7A", // Darker Blue
    },
    shopping: {
      bg: "#BAFFC9", // Light Green
      text: "#1B662A", // Darker Green
    },
    health: {
      bg: "#FFE2B5", // Light Orange
      text: "#996B2B", // Darker Orange
    },
  };

  // Define theme colors
  const themeColors = {
    frog: {
      backgroundColor: "#D8F3DC", // Light green
      color: "#2D6A4F", // Dark green
    },
    bunny: {
      backgroundColor: "#FFE5EC", // Light pink
      color: "#8B4E52", // Dark pink
    },
    cat: {
      backgroundColor: "#E5E5E5", // Light gray
      color: "#4A4A4A", // Dark gray
    },
    swan: {
      backgroundColor: "#E6F3FF", // Light blue
      color: "#2C5282", // Dark blue
    },
  };

  // Get the current theme and compute time tag colors
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "frog";
  const themeStyle = themeColors[currentTheme];

  // Get the actual background color from the CSS variable
  const computedStyle = getComputedStyle(document.documentElement);
  const actualBgColor = computedStyle
    .getPropertyValue("--background-color")
    .trim();
  const actualTextColor = computedStyle.getPropertyValue("--text-color").trim();

  // Get the styles for the category
  const categoryStyle = taskData.category
    ? categoryStyles[taskData.category]
    : null;

  // If there's a time in 24-hour format, convert it to 12-hour format
  let displayTime = taskData.time;
  if (displayTime) {
    // Check if time is in 24-hour format (e.g., "13:00")
    const timeMatch = displayTime.match(/^(\d{1,2}):00$/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      displayTime = formatTime(hour);
    }
  }

  taskItem.innerHTML = `
    <div class="task-content" style="
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
      padding: 8px;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      ">
        <input type="checkbox" class="task-checkbox" ${
          taskData.isCompleted ? "checked" : ""
        } style="
          margin: 0;
          width: 18px;
          height: 18px;
        ">
        <div class="task-details" style="flex: 1;">
          <span class="task-text">${taskData.text}</span>
          <div class="task-metadata" style="margin-top: 4px;">
            ${
              taskData.time
                ? `<span class="tag time-tag" style="background-color: var(--background-color); color: var(--text-color);">${taskData.time}</span>`
                : ""
            }
            ${
              taskData.priority
                ? `<span class="tag priority-tag ${taskData.priority}">${taskData.priority}</span>`
                : ""
            }
            ${
              taskData.category && categoryStyle
                ? `<span class="tag category-tag" style="background-color: ${categoryStyle.bg}; color: ${categoryStyle.text};">${taskData.category}</span>`
                : ""
            }
          </div>
        </div>
      </div>
      <div class="task-actions" style="
        display: flex;
        gap: 8px;
        margin-left: 12px;
      ">
        <button class="edit-btn" style="
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          color: var(--text-color);
          opacity: 0.7;
          transition: opacity 0.2s;
        " onMouseOver="this.style.opacity='1'" onMouseOut="this.style.opacity='0.7'">✎</button>
        <button class="delete-btn" style="
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          color: var(--text-color);
          opacity: 0.7;
          transition: opacity 0.2s;
        " onMouseOver="this.style.opacity='1'" onMouseOut="this.style.opacity='0.7'">×</button>
      </div>
    </div>
  `;

  // Add edit functionality
  const editBtn = taskItem.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    const taskContent = taskItem.querySelector(".task-content");
    const currentText = taskItem.querySelector(".task-text").textContent;
    const currentCategory =
      taskItem.querySelector(".category-tag")?.textContent.toLowerCase() || "";
    const currentTime = taskItem.querySelector(".time-tag")?.textContent || "";
    const currentPriority =
      taskItem.querySelector(".priority-tag")?.textContent.toLowerCase() || "";

    taskContent.innerHTML = `
      <div class="edit-form" style="
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 16px;
        background-color: ${themeStyle.backgroundColor}40;
        border-radius: 8px;
        margin: 8px 0;
      ">
        <input type="text" 
          class="edit-text" 
          value="${currentText}" 
          style="
            border: 2px solid ${themeStyle.color}40;
            border-radius: 6px;
            padding: 8px 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            background: white;
          "
          onFocus="this.style.borderColor='${themeStyle.color}'"
          onBlur="this.style.borderColor='${themeStyle.color}40'"
        >
        <select class="edit-category" 
          style="
            border: 2px solid ${themeStyle.color}40;
            border-radius: 6px;
            padding: 8px 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            background: white;
            cursor: pointer;
          "
          onFocus="this.style.borderColor='${themeStyle.color}'"
          onBlur="this.style.borderColor='${themeStyle.color}40'"
        >
          <option value="">Select Category</option>
          <option value="work" ${
            currentCategory === "work" ? "selected" : ""
          }>Work</option>
          <option value="personal" ${
            currentCategory === "personal" ? "selected" : ""
          }>Personal</option>
          <option value="shopping" ${
            currentCategory === "shopping" ? "selected" : ""
          }>Shopping</option>
          <option value="health" ${
            currentCategory === "health" ? "selected" : ""
          }>Health</option>
        </select>
        <select class="edit-time"
          style="
            border: 2px solid ${themeStyle.color}40;
            border-radius: 6px;
            padding: 8px 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            background: white;
            cursor: pointer;
          "
          onFocus="this.style.borderColor='${themeStyle.color}'"
          onBlur="this.style.borderColor='${themeStyle.color}40'"
        >
          <option value="">Select Time</option>
          ${generateTimeOptions(currentTime)}
        </select>
        <select class="edit-priority"
          style="
            border: 2px solid ${themeStyle.color}40;
            border-radius: 6px;
            padding: 8px 12px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
            background: white;
            cursor: pointer;
          "
          onFocus="this.style.borderColor='${themeStyle.color}'"
          onBlur="this.style.borderColor='${themeStyle.color}40'"
        >
          <option value="">Select Priority</option>
          <option value="low" ${
            currentPriority === "low" ? "selected" : ""
          }>Low Priority</option>
          <option value="medium" ${
            currentPriority === "medium" ? "selected" : ""
          }>Medium Priority</option>
          <option value="high" ${
            currentPriority === "high" ? "selected" : ""
          }>High Priority</option>
        </select>
        <div class="edit-buttons" style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 4px;
        ">
          <button class="save-edit" style="
            padding: 8px;
            border: none;
            border-radius: 6px;
            background-color: ${themeStyle.color};
            color: white;
            cursor: pointer;
            transition: opacity 0.2s;
          " onMouseOver="this.style.opacity='0.9'" onMouseOut="this.style.opacity='1'">Save</button>
          <button class="cancel-edit" style="
            padding: 8px;
            border: 2px solid ${themeStyle.color};
            border-radius: 6px;
            background-color: white;
            color: ${themeStyle.color};
            cursor: pointer;
            transition: background-color 0.2s;
          " onMouseOver="this.style.backgroundColor='${
            themeStyle.backgroundColor
          }'" onMouseOut="this.style.backgroundColor='white'">Cancel</button>
        </div>
      </div>
    `;

    const saveBtn = taskContent.querySelector(".save-edit");
    const cancelBtn = taskContent.querySelector(".cancel-edit");

    saveBtn.addEventListener("click", () => {
      const newText = taskContent.querySelector(".edit-text").value;
      const newCategory = taskContent.querySelector(".edit-category").value;
      const newTime = taskContent.querySelector(".edit-time").value;
      const newPriority = taskContent.querySelector(".edit-priority").value;

      if (!newText.trim()) return;

      const updatedTaskData = {
        text: newText,
        isCompleted: taskData.isCompleted,
        category: newCategory,
        time: newTime,
        priority: newPriority,
      };

      const newTaskElement = createTaskElement(updatedTaskData);
      taskItem.parentNode.replaceChild(newTaskElement, taskItem);

      saveTasks();
      updateStats();
    });

    cancelBtn.addEventListener("click", () => {
      const newTaskElement = createTaskElement(taskData);
      taskItem.parentNode.replaceChild(newTaskElement, taskItem);
    });
  });

  // Existing event listeners for checkbox and delete
  const checkbox = taskItem.querySelector(".task-checkbox");
  checkbox.addEventListener("change", () => {
    taskData.isCompleted = checkbox.checked;
    updateStats();
    saveTasks();
  });

  const deleteBtn = taskItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
    updateStats();
    saveTasks();
  });

  return taskItem;
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskTime = document.getElementById("taskTime");
  const priority = document.getElementById("priority");
  const category = document.getElementById("category");

  if (!taskInput.value.trim()) return;

  const taskData = {
    text: taskInput.value,
    isCompleted: false,
    category: category.value,
    time: taskTime.value,
    priority: priority.value,
  };

  const taskList = document.getElementById("taskList");
  const taskItem = createTaskElement(taskData);
  taskList.appendChild(taskItem);

  // Reset form
  taskInput.value = "";
  taskTime.value = "";
  priority.value = "";
  category.value = "";

  updateStats();
  saveTasks();
}

// Storage
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll(".task-item")).map(
    (task) => ({
      text: task.querySelector(".task-text").textContent,
      isCompleted: task.querySelector(".task-checkbox").checked,
      category:
        task.querySelector(".category-tag")?.textContent.toLowerCase() || "",
      time: task.querySelector(".time-tag")?.textContent || "",
      priority:
        task.querySelector(".priority-tag")?.textContent.toLowerCase() || "",
    })
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((taskData) => {
    const taskItem = createTaskElement(taskData);
    taskList.appendChild(taskItem);
  });
  updateStats();
}

// Stats
function updateStats() {
  const tasks = document.querySelectorAll(".task-item");
  const completed = document.querySelectorAll(
    ".task-item .task-checkbox:checked"
  );
  const urgent = document.querySelectorAll(".task-item.high-priority");

  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent = completed.length;
  document.getElementById("pendingTasks").textContent =
    tasks.length - completed.length;
  document.getElementById("urgentTasks").textContent = urgent.length;
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Load existing tasks
  loadTasks();

  // Initialize theme
  changeTheme();

  // Add Task button
  document.getElementById("addButton").addEventListener("click", addTask);

  // Filter and Sort buttons
  const filterBtn = document.getElementById("filterBtn");
  const sortBtn = document.getElementById("sortBtn");
  const filterDropdown = document.getElementById("filterDropdown");
  const sortDropdown = document.getElementById("sortDropdown");

  filterBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle("show");
    sortDropdown.classList.remove("show");
  });

  sortBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle("show");
    filterDropdown.classList.remove("show");
  });

  // Filter functionality
  document
    .getElementById("categoryFilter")
    ?.addEventListener("change", applyFilters);

  document
    .getElementById("clearFiltersBtn")
    ?.addEventListener("click", clearFilters);

  // Sort buttons
  const sortTimeBtn = document.getElementById("sortByTime");
  const sortPriorityBtn = document.getElementById("sortByPriority");

  // Add click event listeners to sort buttons
  sortTimeBtn?.addEventListener("click", () => {
    sortTasks("time");
    sortDropdown.classList.remove("show");
  });

  sortPriorityBtn?.addEventListener("click", () => {
    sortTasks("priority");
    sortDropdown.classList.remove("show");
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!filterBtn?.contains(e.target) && !filterDropdown?.contains(e.target)) {
      filterDropdown?.classList.remove("show");
    }
    if (!sortBtn?.contains(e.target) && !sortDropdown?.contains(e.target)) {
      sortDropdown?.classList.remove("show");
    }
  });
});

// Filter and Sort Functions (moved outside DOMContentLoaded)
function applyFilters() {
  const categoryValue = document.getElementById("categoryFilter").value;
  const tasks = document.querySelectorAll(".task-item");

  tasks.forEach((task) => {
    const category =
      task.querySelector(".category-tag")?.textContent.toLowerCase() || "";
    const categoryMatch = categoryValue === "all" || category === categoryValue;
    task.style.display = categoryMatch ? "flex" : "none";
  });
}

function clearFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.value = "all";
    applyFilters();
  }
}

function sortTasks(type) {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  const tasks = Array.from(taskList.getElementsByClassName("task-item"));

  // Helper function to convert 12-hour time to comparable value (0-23)
  const getTimeValue = (timeStr) => {
    if (!timeStr) return 24; // No time = sort to end
    const [time, period] = timeStr.split(" ");
    let [hours] = time.split(":");
    hours = parseInt(hours);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours;
  };

  // Helper function to get priority value (0-3, lower = higher priority)
  const getPriorityValue = (priority) => {
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2,
      "": 3,
    };
    return priorityOrder[priority.toLowerCase()];
  };

  tasks.sort((a, b) => {
    const timeA = a.querySelector(".time-tag")?.textContent || "";
    const timeB = b.querySelector(".time-tag")?.textContent || "";
    const priorityA =
      a.querySelector(".priority-tag")?.textContent?.toLowerCase() || "";
    const priorityB =
      b.querySelector(".priority-tag")?.textContent?.toLowerCase() || "";

    if (type === "time") {
      // First compare times
      const timeCompare = getTimeValue(timeA) - getTimeValue(timeB);
      if (timeCompare !== 0) return timeCompare;

      // If times are equal, sort by priority
      return getPriorityValue(priorityA) - getPriorityValue(priorityB);
    } else if (type === "priority") {
      // First compare priorities
      const priorityCompare =
        getPriorityValue(priorityA) - getPriorityValue(priorityB);
      if (priorityCompare !== 0) return priorityCompare;

      // If priorities are equal, sort by time
      return getTimeValue(timeA) - getTimeValue(timeB);
    }
    return 0;
  });

  // Clear and reappend sorted tasks
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  tasks.forEach((task) => taskList.appendChild(task));
}
