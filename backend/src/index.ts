import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import gameRouter from './features/games/games.router';
import rngRouter from './features/rng/rng.router';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/games', gameRouter);
app.use('/api/v1/rng', rngRouter);

app.listen(3000);
