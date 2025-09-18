import express from 'express';
import '#db';
import {
  getAllDucks,
  getDuckById,
  createDuck,
  updateDuck,
  deleteDuck,
} from '#controllers';

const app = express();
const port = 3000;

app.use(express.json()); //Middleware

app.get('/ducks', getAllDucks);
app.get('/ducks/:id', getDuckById);
app.post('/ducks', createDuck);
app.put('/ducks', updateDuck);
app.delete('/ducks', deleteDuck);

app.listen(port, () =>
  console.log('Server is running on http://localhost:3000')
);
