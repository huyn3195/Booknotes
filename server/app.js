import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import jwtAuthRoutes from './routes/jwtAuth.js'


const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//register and login routes
app.use("/auth", jwtAuthRoutes);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})
