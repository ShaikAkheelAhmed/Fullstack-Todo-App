"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(3).max(10),
  summary: z.string().min(5).max(20),
  description: z.string().min(10).max(30),
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function EditTask() {
  const { taskid } = useParams();
    useEffect(() => {
    console.log('ID from URL:', taskid);
  }, [taskid]); // D
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/task/${taskid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const task = await res.json();
        if (!res.ok) throw new Error(task.message);

        // Pre-fill form fields
        setValue("title", task.title);
        setValue("summary", task.summary);
        setValue("description", task.description);
        setValue("status", task.status);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load task:", err);
        alert("Failed to load task.");
        router.push("/mytasks");
      }
    };

    fetchTask();
  }, [taskid, router, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/task/update/${taskid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert("Task updated successfully!");
      router.push("/allTask");
    } catch (error) {
      console.error("Update task error:", error);
      alert("Failed to update task.");
    }
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Edit Task</h2>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title")}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Task title"
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Summary</label>
          <input
            {...register("summary")}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Short summary"
          />
          {errors.summary && <p className="text-sm text-red-500">{errors.summary.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Detailed description"
          ></textarea>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
