import { Response, Request, NextFunction } from 'express';

function ensureAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
)  {

  next();
}

export default ensureAuthentication;
