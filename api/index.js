const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CONNECTION_STRING = "mongodb+srv://pspranjal:abc1234@cluster0.oqb298n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASENAME = "Sampledb";
let database;

app.listen(5038, async () => {
  try {
    const client = await MongoClient.connect(CONNECTION_STRING, {
      tls: true,
      tlsInsecure: false,
    });

    database = client.db(DATABASENAME);
    console.log("MongoDB Connection Successful");


  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});

app.get('/api/Sampledb/GetNotes', async (req, res) => {
  try {
      const notes = await database.collection("Sampledbcollection").find({}).toArray();
      res.json(notes);
  } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).send("Error fetching notes");
  }
});

  app.post('/api/Sampledb/AddNotes', multer().none(), async (request, response) => {
    try {
        const newNotes = request.body.newNotes;
        if (!newNotes) {
            return response.status(400).json({ error: "newNotes is required" });
        }
        await database.collection("Sampledbcollection").insertOne({
            desc: newNotes
        });
        response.json("Added Successfully");
    } catch (error) {
        console.error("Error adding note:", error);
        response.status(500).json({ error: "Error adding note" });
    }
});

app.delete('/api/Sampledb/DeleteNotes', async (request, response) => {
  try {
      const id = request.query.id;
      if (!id) {
          return response.status(400).json({ error: "id is required" });
      }
      await database.collection("Sampledbcollection").deleteOne({
          _id: new ObjectId(id)
      });
      response.json("Deleted Successfully");
  } catch (error) {
      console.error("Errorr deleting note:", error);
      response.status(500).json({ error: "Error deleting note" });
  }
});