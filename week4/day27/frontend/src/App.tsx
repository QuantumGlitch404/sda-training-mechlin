import { useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  Check,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";

import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import "./App.css";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string | null;
  tags: string[];
}

type Page =
  | "dashboard"
  | "tasks"
  | "ai"
  | "analytics";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as
      | "low"
      | "medium"
      | "high",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks`
      );

      const data = await response.json();

      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setSidebarOpen(false);
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            status: "pending",
          }),
        }
      );

      const data = await response.json();

      if (data.task) {
        setTasks((previous) => [
          ...previous,
          data.task,
        ]);
      }

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
      });

      setShowModal(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const completeTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      });

      setTasks((previous) =>
        previous.map((task) =>
          task.id === id
            ? {
                ...task,
                status: "completed",
              }
            : task
        )
      );
    } catch (error) {
      console.error(
        "Failed to complete task:",
        error
      );
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const value = search.toLowerCase();

    return (
      task.title
        .toLowerCase()
        .includes(value) ||
      task.description
        .toLowerCase()
        .includes(value)
    );
  });

  const activeTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "high" &&
      task.status !== "completed"
  ).length;

  const renderDashboard = () => (
    <div className="page">
      <div className="page-title-row">
        <div>
          <h1>Overview</h1>
          <p>
            Your current project activity and task
            progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} />
          New task
        </button>
      </div>

      <div className="overview-strip">
        <div>
          <span>Open tasks</span>
          <strong>{activeTasks}</strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </div>

        <div>
          <span>High priority</span>
          <strong>{highPriorityTasks}</strong>
        </div>

        <div>
          <span>Completion</span>
          <strong>
            {tasks.length
              ? Math.round(
                  (completedTasks /
                    tasks.length) *
                    100
                )
              : 0}
            %
          </strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="section-block">
          <div className="section-heading">
            <div>
              <h2>Recent tasks</h2>
              <p>
                Work currently in your project.
              </p>
            </div>

            <button
              className="quiet-button"
              onClick={() =>
                navigate("tasks")
              }
            >
              View all
            </button>
          </div>

          <div className="task-table">
            <div className="task-table-head">
              <span>Task</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {tasks.slice(0, 6).map((task) => (
              <div
                className="task-row"
                key={task.id}
              >
                <div className="task-name">
                  <button
                    className={`task-complete ${
                      task.status ===
                      "completed"
                        ? "done"
                        : ""
                    }`}
                    onClick={() =>
                      completeTask(task.id)
                    }
                  >
                    {task.status ===
                      "completed" && (
                      <Check size={13} />
                    )}
                  </button>

                  <div>
                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      {task.description}
                    </span>
                  </div>
                </div>

                <span
                  className={`priority ${task.priority}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`task-status ${task.status}`}
                >
                  {task.status ===
                  "in-progress"
                    ? "In progress"
                    : task.status}
                </span>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="empty-state">
                No tasks have been created yet.
              </div>
            )}
          </div>
        </section>

        <aside className="side-summary">
          <div className="section-heading">
            <div>
              <h2>Assistant</h2>
              <p>
                Use AI when you need help with
                your work.
              </p>
            </div>
          </div>

          <div className="assistant-summary">
            <span className="assistant-label">
              AI ASSISTANT
            </span>

            <p>
              Plan work, break down tasks and
              get suggestions for your project.
            </p>

            <button
              className="quiet-button"
              onClick={() => navigate("ai")}
            >
              Open assistant
            </button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="page">
      <div className="page-title-row">
        <div>
          <h1>Tasks</h1>
          <p>
            Create, organize and track project
            work.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} />
          New task
        </button>
      </div>

      <div className="task-toolbar">
        <div className="search-field">
          <Search size={15} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search tasks"
          />
        </div>
      </div>

      <section className="section-block">
        <div className="task-table">
          <div className="task-table-head">
            <span>Task</span>
            <span>Priority</span>
            <span>Status</span>
          </div>

          {filteredTasks.map((task) => (
            <div
              className="task-row"
              key={task.id}
            >
              <div className="task-name">
                <button
                  className={`task-complete ${
                    task.status ===
                    "completed"
                      ? "done"
                      : ""
                  }`}
                  onClick={() =>
                    completeTask(task.id)
                  }
                >
                  {task.status ===
                    "completed" && (
                    <Check size={13} />
                  )}
                </button>

                <div>
                  <strong>
                    {task.title}
                  </strong>

                  <span>
                    {task.description}
                  </span>

                  {task.tags?.length > 0 && (
                    <div className="task-tags">
                      {task.tags.map(
                        (tag) => (
                          <span key={tag}>
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <span
                className={`priority ${task.priority}`}
              >
                {task.priority}
              </span>

              <div className="row-actions">
                <span
                  className={`task-status ${task.status}`}
                >
                  {task.status ===
                  "in-progress"
                    ? "In progress"
                    : task.status}
                </span>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  title="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              No matching tasks.
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderPage = () => {
    if (page === "ai") {
      return <AIAssistant />;
    }

    if (page === "analytics") {
      return <Analytics />;
    }

    if (page === "tasks") {
      return renderTasks();
    }

    return renderDashboard();
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : "closed"
        }`}
      >
        <div className="brand">
          <div className="brand-name">
            MECHLIN
          </div>

          <div className="brand-project">
            SDA / CAPSTONE
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">
            WORKSPACE
          </div>

          <button
            className={
              page === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("dashboard")
            }
          >
            <LayoutDashboard size={15} />
            Overview
          </button>

          <button
            className={
              page === "tasks"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("tasks")
            }
          >
            <ClipboardList size={15} />
            Tasks
          </button>

          <button
            className={
              page === "ai" ? "active" : ""
            }
            onClick={() => navigate("ai")}
          >
            <Bot size={15} />
            Assistant
          </button>

          <button
            className={
              page === "analytics"
                ? "active"
                : ""
            }
            onClick={() =>
              navigate("analytics")
            }
          >
            <BarChart3 size={15} />
            Analytics
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button>
            <Settings size={15} />
            Settings
          </button>

          <div className="account">
            <div className="account-avatar">
              QG
            </div>

            <div>
              <strong>
                Developer
              </strong>

              <span>
                SDA Training
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(
                (previous) => !previous
              )
            }
          >
            {sidebarOpen ? (
              <X size={17} />
            ) : (
              <Menu size={17} />
            )}
          </button>

          <div className="topbar-right">
            <span>Development</span>
          </div>
        </header>

        {renderPage()}
      </main>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>New task</h2>
                <p>
                  Add work to the current
                  project.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={16} />
              </button>
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                value={newTask.title}
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    title:
                      event.target.value,
                  })
                }
                placeholder="Task title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                value={
                  newTask.description
                }
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    description:
                      event.target.value,
                  })
                }
                placeholder="What needs to be done?"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Priority</label>

              <select
                value={
                  newTask.priority
                }
                onChange={(event) =>
                  setNewTask({
                    ...newTask,
                    priority:
                      event.target
                        .value as
                        | "low"
                        | "medium"
                        | "high",
                  })
                }
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={createTask}
              >
                Create task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;