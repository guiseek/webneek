export const configuration = () => ({
  database: process.env.DATABASE ?? '',
  username: process.env.USERNAME ?? '',
  passowrd: process.env.PASSWORD ?? '',
  hostname: process.env.HOSTNAME ?? 'localhost',
  protocol: process.env.PROTOCOL ?? '',
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
});
