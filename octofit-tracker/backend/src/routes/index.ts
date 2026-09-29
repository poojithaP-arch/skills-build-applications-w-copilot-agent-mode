import { Router, Request, Response } from 'express';
import { Model } from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

function createResourceRouter(model: Model<any>, sort?: Record<string, 1 | -1>) {
  const router = Router();

  router.get('/', async (_request: Request, response: Response) => {
    try {
      const records = await model.find().sort(sort ?? { createdAt: -1 });
      response.json(records);
    } catch (error) {
      response.status(500).json({ error: 'Unable to fetch records' });
    }
  });

  router.get('/:id', async (request: Request, response: Response) => {
    try {
      const record = await model.findById(request.params.id);
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.json(record);
    } catch (error) {
      response.status(400).json({ error: 'Invalid record ID' });
    }
  });

  router.post('/', async (request: Request, response: Response) => {
    try {
      const record = await model.create(request.body);
      response.status(201).json(record);
    } catch (error) {
      response.status(400).json({ error: 'Unable to create record' });
    }
  });

  router.patch('/:id', async (request: Request, response: Response) => {
    try {
      const record = await model.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
      });
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.json(record);
    } catch (error) {
      response.status(400).json({ error: 'Unable to update record' });
    }
  });

  router.delete('/:id', async (request: Request, response: Response) => {
    try {
      const record = await model.findByIdAndDelete(request.params.id);
      if (!record) {
        response.status(404).json({ error: 'Record not found' });
        return;
      }
      response.status(204).end();
    } catch (error) {
      response.status(400).json({ error: 'Invalid record ID' });
    }
  });

  return router;
}

export const apiRouter = Router();

apiRouter.get('/', (_request: Request, response: Response) => {
  response.json({ message: 'OctoFit Tracker API' });
});
apiRouter.use('/users', createResourceRouter(User));
apiRouter.use('/teams', createResourceRouter(Team));
apiRouter.use('/activities', createResourceRouter(Activity));
apiRouter.use('/leaderboard', createResourceRouter(Leaderboard, { points: -1 }));
apiRouter.use('/workouts', createResourceRouter(Workout));