import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoute from './routes/auth.route.js';
import formRoute from './routes/form.route.js';
import resRoute from './routes/response.route.js';
dotenv.config();

//  db connection
connectDB();

const app = express();
const port = 5000 || process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://questions-form.vercel.app"],
    credentials: true,
}))


app.get('/', (req, res) => {
    res.send("✅ server is working fine");
})


app.use('/api/auth', authRoute);
app.use('/api/form', formRoute);
app.use('/api/response', resRoute);


app.listen(port, () => {
    console.log("server is running on port : ", port);
})