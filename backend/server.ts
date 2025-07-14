import express, {Request,Response,NextFunction}  from 'express'
import * as dotenv from 'dotenv'
import routerAuth from './src/router/authRouter'
import cors from "cors"
import categegoryrouter from "./src/router/CategoryRoute"
import articlerouter from "./src/router/ArticleRoute"
import favoriterouter from "./src/router/favoriteRoute"
import uploadrouter from './src/router/uploadRoute' 
dotenv.config()
const  app=express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use("/uploads",express.static("uploads"))

app.use (express.json())
app.use("/auth",routerAuth)
app.use("/category",categegoryrouter)
app.use("/article",articlerouter)
app.use("/favorite",favoriterouter)
app.use("/api", uploadrouter) 

app.listen(process.env.port,()=>{
    console.log(`server is runing ${process.env.port}`);

})
