import app from './src/interface/http/express/app';
import config from 'config';
import log from './src/logging/logger';
import connectDatabase from './src/database/connect';

const port: number = config.get<number>('port');
connectDatabase();

app.listen(port, () => {
  log.info(`App is running on port ${port}`);
});
