import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { requestId } from './middleware/requestId.middleware';

const app = express();

app.use(requestId);
app.use(helmet());
app.use(cors());
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' }));

export default app;
