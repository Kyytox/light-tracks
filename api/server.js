import "@babel/register";
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import bodyParser from "body-parser";

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.get("/", function (req, res) {
    res.send({ name: "" });
});

app.listen(process.env.PORT, () => {
    console.log("app listening on port " + process.env.PORT);
});
