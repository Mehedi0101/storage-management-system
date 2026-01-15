// external imports
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// internal imports
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter');
const dashboardRouter = require('./routes/dashboardRouter');

const errorHandler = require("./middlewares/errorHandlers");

const app = express();

/* -------------------- Global Middlewares -------------------- */
app.use(cors({
    // origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/* -------------------- Static Files -------------------- */
app.use("/uploads", express.static("uploads"));

/* -------------------- Routes -------------------- */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/files", fileRouter);
app.use("/api/dashboard", dashboardRouter);

/* -------------------- Entry point -------------------- */
app.get("/", (req, res) => {
    res.send("Storage Management System API is running");
});

/* -------------------- Error Handler -------------------- */
app.use(errorHandler);

module.exports = app;