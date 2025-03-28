import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express";

const app = express();

const PORT = process.env.PORT || 8080

//middlewares
app.use(express.json());
app.use(cors())
app.use(appLimiter)
// app.use(cors({origin: "http://localhost:5173" , credentials: true} ));

// app.use(express.urlencoded({extended: false}));

app.get("/", (req,res) => {
   res.send("Yes inside status i am")
});

// Routes file
import routes from '../routes/index.js'
import { appLimiter } from "../config/rateLimiter.js";
app.use("/api", routes);
//http:localhost:8080/user



app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
});