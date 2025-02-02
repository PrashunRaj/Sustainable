import express from'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import expertRouter from './routes/expertRoute.js';
import userRouter from './routes/userRoute.js';

//app config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();
//middleware
app.use(express.json());
app.use(cors());


//api endpoints
app.use('/api/expert',expertRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)


app.get('/', (req, res) => {
    res.status(200).send('Hello World')
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
