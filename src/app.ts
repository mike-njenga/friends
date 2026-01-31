import express from "express"
//import helmet from "helmet"
import cors from "cors"
import morgan from "morgan" 
import friendsRoute from "./routes/friends.router.js"
import authRoute from "./routes/auth.routes.js"
import myconfig from "./config/env.js"


const app = express()
//app.use(helmet()
app.use(morgan("dev"));
app.use(cors({
    origin: myconfig.frontendUrl | true ,
    credentials: true,
    methods: ['GET', 'POST','DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
    
}));

// body parsing and middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// HEALTH ENDPOINT
app.get("/api/health",(req,res)=>{
    res.status(200).json({messsage: "server is running"})
})

//api routes
app.use("/api/friends", friendsRoute);
app.use("/api/auth", authRoute);

// SUPBASE 
import { supabaseAdmin } from './config/supabase.js'
import { config } from "dotenv"

app.get('/supabase-test', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('auth.users')
    .select('id')
    .limit(1)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ connected: true, data })
})



export default app;
