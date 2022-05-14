import mongoose from "mongoose";
const { connect } = mongoose;

// (async function () {
//   try {
//     await connect("mongodb://localhost:27017/tasks-list-db");
//     console.log("Success connected to MONGODB");
//   } catch (error) {
//     console.log(error);
//   }
// })();

connect("mongodb://localhost:27017/tasks-list-db")
  .then(() => console.log("success connected to MONGO"))
  .catch((err) => console.log(err));
