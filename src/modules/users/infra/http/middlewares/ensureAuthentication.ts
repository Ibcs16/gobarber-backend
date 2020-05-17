import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface TokenPayload {
  iat: string;
  ext: string;
  sub: string;
}

function ensureAuthentication(
  request: Request,
  res: Response,
  next: NextFunction,
)  {

  const authHeader = request.headers.authorization;

  if(!authHeader) {
    throw Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub
    }

    next();
  } catch {
    throw new Error('Invalid JWT token');
  }

}

export default ensureAuthentication;
