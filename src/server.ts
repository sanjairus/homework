import { inspect } from "node:util";
import "./config";
import express from "express";

const PORT = process.env.SERVER_PORT;

const app = express();

async function initServer() {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.listen(PORT, () => {
      console.log(`Listening to PORT:${PORT}`);
    });
  } catch (error) {
    console.log("Error occurred while starting server");
    console.log(inspect(error, false, Infinity));
  }
}

initServer();
