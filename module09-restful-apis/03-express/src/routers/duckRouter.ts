import { Router } from 'express';
import {
  createDuck,
  getAllDucks,
  getDuckById,
  updateDuck,
  deleteDuck,
} from '#controllers';

const duckRouter = Router();

// duckRouter.get('/', getAllDucks);
// duckRouter.post('/', createDuck);
// duckRouter.get('/:id', getDuckById);
// duckRouter.put('/:id', updateDuck);
// duckRouter.delete('/:id', deleteDuck);

duckRouter.route('/').get(getAllDucks).post(createDuck);
duckRouter.route('/:id').get(getDuckById).put(updateDuck).delete(deleteDuck);

export default duckRouter;
