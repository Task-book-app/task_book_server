import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema.js";
import "./db/mongo-connect.js";
import config from "./config.js";
// import auth from "./middlewares/authenticate.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticate from "./middlewares/authenticate.js";

const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(authenticate);

app.get("/", (req, res) => {
  res.send(`<h1>Tasks List Server</h1>`);
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(config.port, () => {
  console.log(`App listening 🦻 at http://localhost:8000`);
  console.log(`GraphQL listening at http://localhost:8000/graphql`);
});

app.use(function errorHandler(err, req, res, next) {
  //   console.log("I am the old handler: =>", err.message);
  res.status(err.status || 400).send({
    error: {
      message: err.message || null,
      status: err.status || null,
    },
  });
});
