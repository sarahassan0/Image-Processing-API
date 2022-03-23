import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

async function validateInputs(req: Request, res: Response, next: NextFunction):Promise<void> {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    console.log();
    res.send(
      'you have an invalid inputs, check the image name and the dimensions'
    );
    return;
  }
  next();
}

export default validateInputs;
