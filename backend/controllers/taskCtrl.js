const Task = require("../models/taskModel");


const createTask = async (req, res) => {
  try {
    const { title, summary, description, status } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Title is required and must be at least 3 characters long." });
    }

    if (!summary || summary.trim().length < 5) {
      return res.status(400).json({ message: "Summary is required and must be at least 5 characters long." });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Description is required and must be at least 10 characters long." });
    }

    const allowedStatuses = ["Pending", "In Progress", "Completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
    }

    const newTask = await Task.create({
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      status: status || "Pending",
      user: req.user.id, 
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create task error:", err);
    console.log("User ID:", req.user);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Get task by ID error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const taskCtrl = {
 createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
}



module.exports =  taskCtrl

