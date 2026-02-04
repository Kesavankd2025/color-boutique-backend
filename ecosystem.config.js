module.exports = {
  apps: [
    {
      name: 'color-boutique-backend',
      script: './node_modules/.bin/ts-node',
      args: './index.ts',
      interpreter: 'node',
      watch: true,
      error_file: './pm2logs/err.log',
      out_file: './pm2logs/out.log',
      log_file: './pm2logs/combined.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
