const express = require("express");
const mongoose = require("mongoose");
const Person = require("./personModel");
require("dotenv").config();

const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.post("/person", async (req, res) => {
  try {
    const { name, age, favoriteFoods } = req.body;
    const person = new Person({ name, age, favoriteFoods });
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/people/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const people = await Person.find({ name });

    res.status(200).json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/person/:food", async (req, res) => {
  try {
    const food = req.params.food;

    const person = await Person.findOne({ favoriteFoods: food });

    res.status(200).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/person/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/person/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    person.favoriteFoods.push("hamburger");
    await person.save();
    res.status(200).json(person);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.put("/person/:name", async (req, res) => {
  try {
    const personName = req.params.name;
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(updatedPerson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.delete("/person/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const deletedPerson = await Person.findByIdAndRemove(personId);
    if (!deletedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.status(200).json(deletedPerson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
