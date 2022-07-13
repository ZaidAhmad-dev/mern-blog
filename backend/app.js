import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes';
const app = express();
const port = 4000;

app.use(express.json());
app.use("/api/user", router);
mongoose.connect("mongodb+srv://zaid:123@cluster0.cjwec.mongodb.net/?retryWrites=true&w=majority").then(
    app.listen(port, () => console.log(`Listening on port ${port}`))
).catch(err => console.log(err));

