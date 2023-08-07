module.exports = {
  apps: [
    {
      name: "bande-dessinees",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
      },
    },
  ],
};

// Pour démarrer l'application avec PM2
// npx pm2 start ecosystem.config.js

// pm2 start ecosystem.config.js --name bande-dessinees

// Pour démarrer l'application avec PM2 sans que les console s'ouvreent
// npx pm2 start ecosystem.config.js --no-daemon

// Pour se débarrasser des processus pm2:
//  ps -ef | grep pm2
//  kill -9 <PID_OF_PM2>
