import express from 'express';
import Routes from './infra/http/routes';

const app = express();

app.use(Routes);

app.listen( 3333, () => {
  console.log('server on 3333')
});
