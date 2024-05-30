const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
const uri = ""; // Your mongodb connection URL here 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version 
const client = new MongoClient(uri, { 
  serverApi: { 
    version: ServerApiVersion.v1, 
    strict: true, 
    deprecationErrors: true, 
  } 
}); 

async function run() { 
  try { 
    // Connect the client to the server (optional starting in v4.7) 
    await client.connect(); 
    // Send a ping to confirm a successful connection 
    const database = await client.db("todo-app"); 
    const todosCollection = database.collection("todos"); 
    const getCount = await todosCollection.countDocuments();
    console.log('Number of Records: ', getCount); 
  } 
  catch (error) { 
    console.log(error); 
  } 
} 

run().catch(console.dir); 

async function getTodos() { 
  const todosCollection = await client.db("todo-app").collection("todos"); 
  const todos = await todosCollection.find({}).toArray(); 
  return todos; 
} 

async function getTodo(id) {
  const todosCollection = await client.db("todo-app").collection("todos");
  const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
  return todo;
}

async function createTodo(todo) {
  const todosCollection = await client.db("todo-app").collection("todos");
  const result = await todosCollection.insertOne(todo);
  return result.ops[0]; // Return the created todo
}

async function updateTodo(id, update) {
  const todosCollection = await client.db("todo-app").collection("todos");
  const result = await todosCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnOriginal: false }
  );
  return result.value;
}

async function deleteTodo(id) {
  const todosCollection = await client.db("todo-app").collection("todos");
  const result = await todosCollection.findOneAndDelete({ _id: new ObjectId(id) });
  return result.value;
}

module.exports = { 
  getTodos, 
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo 
};
