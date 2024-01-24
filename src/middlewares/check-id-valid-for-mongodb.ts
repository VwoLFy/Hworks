import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { HTTP_Status } from '../enums';

export const checkIdValidForMongodb = (req: Request, res: Response, next: NextFunction) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.sendStatus(HTTP_Status.NOT_FOUND_404);
  } else {
    next();
  }
};
