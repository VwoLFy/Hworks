import { NextFunction, Request, Response } from 'express';
import { atob } from 'buffer';
import { HTTP_Status } from '../enums';

export const checkAuthorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header('Authorization');
  if (!authorization?.startsWith('Basic') /*|| authorization?.indexOf(":") > -1*/) {
    return res.sendStatus(HTTP_Status.UNAUTHORIZED_401);
  }
  try {
    const [login, pass] = atob(authorization?.split(' ')[1]).split(':');
    if (login !== 'admin' || pass !== 'qwerty') {
      return res.sendStatus(HTTP_Status.UNAUTHORIZED_401);
    } else {
      next();
    }
  } catch (e) {
    return res.sendStatus(HTTP_Status.UNAUTHORIZED_401);
  }
};
