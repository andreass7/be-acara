import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";

async function init() {
  try {
    const PORT = 3000;

    const result = await db();
    console.log("Database Status", result);

    const app = express();

    app.use(cors());

    app.use(bodyParser.json());

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Success hit endpoint /",
        data: null,
      });
    });

    app.use("/api", router);
    docs(app);

    app.use(errorMiddleware.serverRoute());
    app.use(errorMiddleware.serverError());

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
