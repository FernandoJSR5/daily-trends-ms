import express, { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { requestLimit } from './env';

const swaggerDocument = YAML.load(path.join(__dirname, '../settings/api.yml'));

export default async function setupSwaggerAndRoutes(
  app: Application,
  routes: (application: Application) => void
): Promise<void> {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(express.json({ limit: requestLimit }));

  routes(app);
}
