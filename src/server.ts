import { inspect } from "node:util";
import "./config";
import express from "express";
import initDatasource from "@database/client";
import AppointmenRouter from "@appointment/appointment.router";

const PORT = process.env.SERVER_PORT;

const app = express();

async function initServer() {
  try {
    const datasource = await initDatasource();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // custom routes
    app.use("/appointments", new AppointmenRouter(datasource).getRouter());

    app.listen(PORT, () => {
      console.log(`Listening to PORT:${PORT}`);
    });
  } catch (error) {
    console.log("Error occurred while starting server");
    console.log(inspect(error, false, Infinity));
  }
}

initServer();
