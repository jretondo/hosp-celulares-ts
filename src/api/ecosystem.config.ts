export = {
  apps: [
    {
      name: `${process.env.PORT}-hosp-celulares-prod`,
      script: 'dist/api/index.js',
      env: {
        PORT: process.env.PORT,
      },
    },
  ],
};
