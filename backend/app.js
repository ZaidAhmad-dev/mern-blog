import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user-routes';
import blogRouter from './routes/blog-routes';
const app = express();
const port = 4000;

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
mongoose.connect("mongodb+srv://zaid:123@cluster0.cjwec.mongodb.net/?retryWrites=true&w=majority").then(
    app.listen(port, () => console.log(`Listening on port ${port}`))
).catch(err => console.log(err));
