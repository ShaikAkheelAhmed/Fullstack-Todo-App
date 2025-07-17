"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


const taskSchema = z.object({
  title: z.string().min(3, "Title is too short please enter atleast 3 characters.")
  .max(10, "Title is too long. Maximum 10 characters allowed."),
  summary: z.string().min(5, "Summary is too short please enter atleast 5 characters.")
 .max(20, "Summary is too long. Maximum 20 characters allowed.") ,
  description: z.string().min(10, "Description is too short please enter atleast 10 characters.")
 .max(30, "Summary is too long. Maximum 30 characters allowed.") ,
  status: z.enum(["Pending", "In Progress", "Completed"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });
 const router = useRouter()

const onSubmit = async (data: TaskFormData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be signed in to add a task.");
      return;
    }

    const response = await fetch("http://localhost:3001/task/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result , 'myresult')

    if (!response.ok) {
      throw new Error(result.message || "Failed to create task");
    }

    alert("Task created successfully!");
    router.push('/allTask')
    console.log("New Task:", result);
    

  } catch (error) {
    console.error("Create task error:", error);
    alert("Error creating task. Check console for details.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Add Task</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title")}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <input
            {...register("summary")}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short summary"
          />
          {errors.summary && (
            <p className="text-sm text-red-500">{errors.summary.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description"
          ></textarea>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Submit Task
        </button>
        <button
        type="button"
        onClick={() => router.push('/allTask')}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Go to Your Tasks
      </button>
      </form>

    </div>
  );
}
