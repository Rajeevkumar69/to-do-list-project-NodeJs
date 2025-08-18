import express from "express";
const arg = process.argv;


const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


app.get("/", (req, res) => {
    res.render('dashboard');
});

app.get('/add-task', (req, res) => {
    res.render('add-task');
});




app.listen(arg[2], () => {
    console.log(`Server is running on ${arg[2]}`);
})