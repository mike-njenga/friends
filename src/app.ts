import express from "express"
import cors from "cors"
import morgan from "morgan" 

const app = express()
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.FRONTED_URL,
    credentials: false
    
}));

// body parsing and middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// HEALTH ENDPOINT
app.get("/api/health",(req,res)=>{
    res.status(200).json({messsage: "server is running"})
})
// SUPBASE 
import { supabaseAdmin } from './config/supabase.js'

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