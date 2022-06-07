import mongoose from "mongoose";
import config from "../config.js";

const { connect } = mongoose;

connect(config.mongooseUrl)
  .then(() => console.log("success connected to MONGO"))
  .catch((err) => console.log(err));
