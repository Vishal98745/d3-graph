const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define where to temporarily store uploaded files
const fs = require('fs');
const port = 5000;

// Connect to your MongoDB database
const mongo_url = process.env.Database_url

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a schema for your data
const visualdataSchema = new mongoose.Schema({
  end_year: {type:String},
  intensity:{type:Number},
  sector: {type:String},
  topic: {type:String},
  insight: {type:String},
  url: {type:String},
  region: {type:String},
  start_year: {type:String},
  impact: {type:String},
  added: {type:String},
  published: {type:String},
  country: {type:String},
  relevance: {type:Number},
  pestle: {type:String},
  source: {type:String},
  title: {type:String},
  likelihood: {type:Number},
  
});

// Create a model for your data
const Item = mongoose.model('VisualData', visualdataSchema);

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route to get data from MongoDB
app.get('', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define a route to add data to MongoDB
app.post('/create', upload.single('file'), async (req, res) => {
    // Get the uploaded JSON file
    const filePath = req.file.path;
    const fileData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileData);
  
    try {
      // Insert the entire array of objects into the database
      await Item.insertMany(jsonData);
      res.json({ message: 'Data added successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    } finally {
      // Delete the temporary file
      fs.unlinkSync(filePath);
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
