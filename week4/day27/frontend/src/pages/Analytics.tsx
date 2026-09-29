import React, { useEffect, useMemo, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string | null;
  tags: string[];
}

interface AnalyticsData {
  totalRequests: number;
  successfulRequests: number;
  averageResponseTime: number;
  mostUsedFeature: string;
}

const Analytics: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRequests: 0,
    successfulRequests: 0,
    averageResponseTime: 0,
    mostUsedFeature: "chat",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [tasksResponse, analyticsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/tasks"),
          fetch("http://localhost:5000/api/ai/analytics"),
        ]);

        const tasksData = await tasksResponse.json();
        const analyticsData = await analyticsResponse.json();

        if (tasksData.success) {
          setTasks(tasksData.tasks);
        }

        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
      } catch (error) {
        console.error("Analytics loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress"
    ).length;

    const pending = tasks.filter(
      (task) => task.status === "pending"
    ).length;

    const highPriority = tasks.filter(
      (task) => task.priority === "high"
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  if (loading) {
    return (
      <main className="page analytics-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">PROJECT ANALYTICS</p>
            <h1>Analytics</h1>
            <p className="page-description">
              A clear view of project activity and AI usage.
            </p>
          </div>
        </div>

        <div className="analytics-loading">
          Loading project data...
        </div>
      </main>
    );
  }

  return (
    <main className="page analytics-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PROJECT ANALYTICS</p>
          <h1>Analytics</h1>
          <p className="page-description">
            A clear view of project activity and AI usage.
          </p>
        </div>
      </header>

      <section className="analytics-summary">
        <div className="analytics-stat">
          <span className="analytics-stat-label">Total tasks</span>
          <strong>{stats.total}</strong>
          <span className="analytics-stat-note">Current project</span>
        </div>

        <div className="analytics-stat">
          <span className="analytics-stat-label">Completed</span>
          <strong>{stats.completed}</strong>
          <span className="analytics-stat-note">
            {stats.completionRate}% completion
          </span>
        </div>

        <div className="analytics-stat">
          <span className="analytics-stat-label">In progress</span>
          <strong>{stats.inProgress}</strong>
          <span className="analytics-stat-note">Active work</span>
        </div>

        <div className="analytics-stat">
          <span className="analytics-stat-label">High priority</span>
          <strong>{stats.highPriority}</strong>
          <span className="analytics-stat-note">Needs attention</span>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Task distribution</h2>
              <p>Current status across all project tasks.</p>
            </div>
          </div>

          <div className="distribution-list">
            <div className="distribution-row">
              <div className="distribution-label">
                <span className="status-dot pending-dot" />
                <span>Pending</span>
              </div>

              <strong>{stats.pending}</strong>
            </div>

            <div className="distribution-row">
              <div className="distribution-label">
                <span className="status-dot progress-dot" />
                <span>In progress</span>
              </div>

              <strong>{stats.inProgress}</strong>
            </div>

            <div className="distribution-row">
              <div className="distribution-label">
                <span className="status-dot completed-dot" />
                <span>Completed</span>
              </div>

              <strong>{stats.completed}</strong>
            </div>
          </div>
        </div>

        <div className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>AI usage</h2>
              <p>Activity reported by the AI service.</p>
            </div>
          </div>

          <div className="ai-usage-list">
            <div className="usage-row">
              <span>Total requests</span>
              <strong>{analytics.totalRequests}</strong>
            </div>

            <div className="usage-row">
              <span>Successful requests</span>
              <strong>{analytics.successfulRequests}</strong>
            </div>

            <div className="usage-row">
              <span>Average response</span>
              <strong>{analytics.averageResponseTime}ms</strong>
            </div>

            <div className="usage-row">
              <span>Most used feature</span>
              <strong className="usage-feature">
                {analytics.mostUsedFeature}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="analytics-panel analytics-tasks-panel">
        <div className="panel-heading">
          <div>
            <h2>Task activity</h2>
            <p>Current project tasks and their status.</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            No task data is available yet.
          </div>
        ) : (
          <div className="analytics-table">
            <div className="analytics-table-header">
              <span>Task</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Due date</span>
            </div>

            {tasks.map((task) => (
              <div className="analytics-table-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.description}</span>
                </div>

                <span
                  className={`priority-text priority-${task.priority}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`status-text status-${task.status}`}
                >
                  {task.status}
                </span>

                <span className="date-text">
                  {task.dueDate || "No date"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Analytics;