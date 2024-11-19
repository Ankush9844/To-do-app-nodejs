const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

// Models
const TodoTask = require("./models/TodoTask");

dotenv.config();

// Middleware
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db!");

    // Start server
    app.listen(3000, () => console.log("Server Up and running"));
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit process on failure
  }
};

startServer();

// Routes
// GET METHOD
app.get("/", async (req, res) => {
  try {
    const todoTasks = await TodoTask.find({});
    res.render("todo.ejs", { todoTasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("An error occurred while fetching tasks");
  }
});

// POST METHOD
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    console.error("Error saving task:", err);
    res.redirect("/");
  }
});

// UPDATE METHOD
app
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      console.error("Error fetching tasks for editing:", err);
      res.status(500).send("An error occurred while fetching tasks");
    }
  })
  .post(async (req, res) => {
    try {
      const id = req.params.id;
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      console.error("Error updating task:", err);
      res.status(500).send("An error occurred while updating the task");
    }
  });

// DELETE METHOD
app.route("/remove/:id").get(async (req, res) => {
  try {
    const id = req.params.id;
    await TodoTask.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("An error occurred while deleting the task");
  }
});
