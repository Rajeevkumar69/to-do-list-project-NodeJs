import express from "express";
import path from 'path';
const arg = process.argv;


const app = express();
const publicPath = path.resolve('public');
app.set('view engine', 'ejs');
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render('dashboard');
});

app.get('/add-task', (req, res) => {
    res.render('add-task');
});




app.listen(arg[2], () => {
    console.log(`Server is running on ${arg[2]}`);
})