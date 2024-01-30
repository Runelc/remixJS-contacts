import dotenv from "dotenv";
dotenv.config(); // load .env file

import "./server/database.js"; // connect to database

import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { broadcastDevReady } from "@remix-run/node";

// notice that the result of `remix build` is "just a module"
import * as build from "./build/index.js";
import contacts from "./server/routes/contacts.route.js";

const app = express();
app.use(express.static("public"));

app.use("/api/contacts", contacts);

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
  console.log("App listening on http://localhost:3000");
});
