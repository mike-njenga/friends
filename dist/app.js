import express from "express";
import cors from "cors";
import morgan from "morgan";
const app = express();
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.FRONTED_URL,
    credentials: false
}));
// body parsing and middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
app.get("/api/health", (req, res) => {
    res.status(200).json({ messsage: "server is running" });
});
export default app;
//# sourceMappingURL=app.js.map