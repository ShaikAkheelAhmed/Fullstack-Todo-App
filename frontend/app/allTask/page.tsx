"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  summary: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
}

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const gotoAddTask = () => {
    router.push('/addTask');
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not authorized. Please log in.");
        return;
      }

      const response = await fetch("http://localhost:3001/task/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks.");
      }

      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/task/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete task.");
      }

      setTasks((prev) => prev.filter((task) => task._id !== id));
      alert("Task deleted successfully.");
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Error deleting task.");
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Loading tasks...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header section */}
      <div className="flex flex-col items-center mb-8">
       <div className="flex items-center justify-center mb-8 space-x-6">
  {tasks.length > 0 && (
    <>
      <h2 className="text-3xl font-bold text-blue-600">Your Tasks</h2>

      <button
        className="text-xl font-bold px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={gotoAddTask}
      >
        Add New Task
      </button>
    </>
  )}
</div>
        
      </div>

      {/* Tasks content */}
      {tasks.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No tasks found. Please add one.</p>
          <button 
            onClick={gotoAddTask} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Click here to add task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-xl shadow-md border">
              <h3 className="text-xl font-semibold text-gray-700"><strong>Title:</strong> {task.title}</h3>
              <p className="text-sm text-gray-600 mt-1"><strong>Summary:</strong> {task.summary}</p>
              <p className="text-sm text-gray-700 mt-2"><strong>Description:</strong> {task.description}</p>
              <p className="text-sm font-medium mt-3">
                Status: <span className={`px-2 py-1 rounded text-white ${
                  task.status === "Completed"
                    ? "bg-green-600"
                    : task.status === "In Progress"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}>
                  {task.status}
                </span>
              </p>

              <div className="mt-4 flex justify-between">
                <Link href={`/mytasks/${task._id}`} className="text-blue-600 hover:underline font-medium">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}