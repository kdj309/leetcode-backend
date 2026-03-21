import axios from 'axios';
import { config } from 'src/config/config';

export const judgeApi = axios.create({
  baseURL: config().judge.url,
  headers: {
    'x-rapidapi-key': config().judge.key,
    'x-rapidapi-host': config().judge.host,
    'Content-Type': 'application/json',
  },
});
