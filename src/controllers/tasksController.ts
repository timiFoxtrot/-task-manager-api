import { Request, Response } from "express";
import Tasks from "../models/tasksModel";
import { createTaskSchema } from "../utils/validator";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!isNaN(Number(title)) || !isNaN(Number(description))) {
      const { error } = createTaskSchema.validate({
        title: parseFloat(title),
        description: parseFloat(description),
      });
      if (error) {
        return res.status(400).send({
          success: false,
          message: error.details[0].message,
        });
      }
    }

    const existingTask = await Tasks.findOne({ title });

    if (existingTask) {
      return res.status(401).send({ message: "Title already taken" });
    }

    const newTask = new Tasks({ title, description, owner: req.userId });
    await newTask.save();

    res
      .status(201)
      .send({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Unable to create task" });
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  //GET /tasks?completed=true
  //GET /tasks?sortBy=createdAt:desc
  try {
    const userId = req.userId;
    let query: any = { owner: userId };
    let sort: any = {};

    if (req.query.sortBy) {
      const sortQuery: string = req.query.sortBy as string;
      const part = sortQuery.split(":");
      sort[part[0]] = part[1] === "desc" ? -1 : 1;
    }

    if (req.query.completed === "true" || req.query.completed === "false") {
      query.completed = req.query.completed;
    }

    const count = await Tasks.find(query).sort(sort).countDocuments();
    const tasks = await Tasks.find(query).sort(sort).exec();
    res.status(200).send({
      message: "Your tasks have been fetched successfully",
      count,
      tasks,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching tasks" });
  }
};

export const getSingleTaskByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const taskId = req.params.taskId;

    const task = await Tasks.findOne({ _id: taskId, owner: userId });

    if (!task) {
      res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ message: "Task fetched successfully", data: task });
  } catch (error) {
    res.status(500).send({ message: "Error fetching task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await Tasks.findOne({ _id: taskId, owner: req.userId });
    if (!task) {
      return res.status(404).send({ message: "task not found" });
    }

    const updatedTask = await Tasks.findOneAndUpdate(
      { _id: taskId, owner: req.userId },
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .send({ message: "task updated successfully", data: updatedTask });
  } catch (error) {
    res.status(500).send({ message: "error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    await Tasks.findOneAndDelete({ _id: taskId, owner: req.userId });
    res.status(200).send({ message: "Task successfully deleted" });
  } catch (error) {
    res.status(500).send({ message: "error deleting task" });
  }
};
