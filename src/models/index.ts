import { ModelDefinition } from '@nestjs/mongoose';
import { Regression, RegressionSchema } from './regression.model';

export const RegressionModelDefinition: ModelDefinition = {
  name: Regression.name,
  schema: RegressionSchema,
};
