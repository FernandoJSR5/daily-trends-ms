import express from 'express';
import feedRoutes from '../interface/routes/FeedRoutes';
import setupSwaggerAndRoutes from './swagger';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(express.json());
  }

  public async router(): Promise<void> {
    await setupSwaggerAndRoutes(this.app, (app) => {
      app.use('/api/v1', feedRoutes);
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default Server;
