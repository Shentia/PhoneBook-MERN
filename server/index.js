const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { times } = require("lodash");

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

//schema for phonebook

const phonebookSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
  },
  { timestamps: true }
);

const userPhonebook = mongoose.model("users", phonebookSchema);

//Read Data
app.get("/", async (req, res) => {
  const data = await userPhonebook.find({});
  res.json({ success: true, data: data });
});

//Create Data || save data in mongoDB
app.post("/create", async (req, res) => {
  const { name, phoneNumber, email } = req.body;
  const data = new userPhonebook({
    name,
    phoneNumber,
    email,
  });
  await data.save();
  res.json({ success: true, message: "data save successfully", data: data });
});

//Update Data
app.put("/update/:id", async (req, res) => {
  const { name, phoneNumber, email } = req.body;
  const data = await userPhonebook
    .findByIdAndUpdate(
      { _id: req.params.id },
      {
        name,
        phoneNumber,
        email,
      },
      { new: true }
    )
    .exec();
  res.json({ success: true, message: "data updated successfully", data: data });
});

//Delete Data
app.delete("/delete/:id", async (req, res) => {
  const data = await userPhonebook.findByIdAndDelete({ _id: req.params.id });
  res.json({ success: true, message: "data deleted successfully", data: data });
});

//Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/phonebook")
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });
