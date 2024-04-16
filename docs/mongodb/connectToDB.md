---
sidebar_position: 3
---

# Connect with Mongoose

This simple code helps you to connect MongoDB database with mongoose in Next.js. \
Don't forget install [mongoose](https://www.npmjs.com/package/mongoose)


Create a file at `utils/connectToDb.jsx`:

```jsx
const {default: mongoose} = require("mongoose");

const connection = {};
export const connectToDb = async ()=>{
  try{
    if(connection.isConnected){
      console.log("Using existing connection")
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_URL);
    connection.isConnected = db.connections[0].readyState;
  }catch(error){
    console.log(error);
    throw new Error(error);
  }
}
```

if Export Default Error:

```jsx
const mongoose = require("mongoose");

const connect = async ()=>{
    try {
        if (mongoose.connections[0].readyState){
            return false;
        }
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI)
        console.log("Connected!")
    } catch (err){
        console.log("Error => ", err);
    }
}

export default connect;
```
