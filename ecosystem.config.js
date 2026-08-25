module.exports = {
  apps: [
    {
      name: "bilge-next",
      script: "server.js",
      cwd: "/var/www/bilge-next",
      instances: "max",
      exec_mode: "cluster",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
