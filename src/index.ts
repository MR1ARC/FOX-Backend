import { app } from "./app";
import "dotenv/config"


app.listen( process.env.PORT || 8000, ()=>{
  console.log(`server is running on ${process.env.PORT}`)
})