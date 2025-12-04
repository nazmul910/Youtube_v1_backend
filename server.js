import express from 'express';

const app  = express();

app.use(express.json());

const PORT = 5000;


app.get('/api/joke', (req, res) => {
    res.send('Hello, World!');
})



app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
})

