import express, { Request, Response } from 'express';
import validateInputs from './middlewares/validateImage';
import resizeImage from './utils/resizeImage';
import { check } from 'express-validator';
const app = express();
const port = 8000;

app.get('/api', (req: Request, res: Response) => {
  res.send('tihs is an image processing API');
});

app.get(
  '/api/images',
  check('filename').isLength({ min: 3 }),
  check('width').isInt().isLength({ min: 3 }),
  check('height').isInt().isLength({ min: 3 }),
  validateInputs,
  (req: express.Request, res: express.Response):void => {
    resizeImage(req, res);
    res.status(200);
  }
);

app.listen(port, () =>
  console.log(`your server is running at http://localhost:${port}`)
);

export default app;
