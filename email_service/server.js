const express = require("express"),
const    morgan = require("morgan");

const { PORT, MODE } = require("./config");
const { connect } = require("./api/v1/helper/dbconnect");
const emailRouter = require("./api/v1/email.router");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
// routes
app.use("/", emailRouter);

app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

// dead end
app.use((req, res) => {
    res.status(404).json({ message: "verb not supported" }).end();
});

const start = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`Server is running in ${MODE} at port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
};
start();
