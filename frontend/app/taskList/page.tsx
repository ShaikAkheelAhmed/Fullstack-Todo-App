// app/tasks/page.tsx (if using App Router) or pages/tasks.tsx (if using Pages Router)

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Task {
  title: string;
  summary: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  _id?: string;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from your backend API
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusStyle = (status: Task["status"]) => {
    const base = "text-xs font-medium px-2 py-1 rounded-full";
    switch (status) {
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "In Progress":
        return `${base} bg-blue-100 text-blue-800`;
      case "Completed":
        return `${base} bg-green-100 text-green-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Task List</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks found. <Link href="/add-task" className="text-blue-500 underline">Add one</Link></p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                  <span className={getStatusStyle(task.status)}>{task.status}</span>
                </div>
                <p className="text-sm text-gray-600">{task.summary}</p>
                <p className="text-gray-700 text-sm">{task.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
