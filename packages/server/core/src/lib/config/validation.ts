import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  hostname: Joi.string(),
  database: Joi.string(),
  username: Joi.string(),
  passowrd: Joi.string(),
  protocol: Joi.string(),
});
