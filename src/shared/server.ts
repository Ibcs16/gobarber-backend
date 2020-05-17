import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import Routes from './infra/http/routes';
import upload from '@config/upload';
import AppError from './errors/AppError';
import './infra/typeorm/index';

const app = express();

app.use(express.json());

app.use('/files', express.static(upload.directory));
app.use(Routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen( 3333, () => {
  console.log('server on 3333')
});