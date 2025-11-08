module.exports = {
    apps: [
        {
            name: "yurei-agent",
            script: "dist/agent/agent.js",
            instances: 1,
            autorestart: true
        },
        {
            name: "yurei-api",
            script: "dist/index.js",
            instances: 1,
            autorestart: true
        },
        {
            name: "yurei-alert",
            script: "dist/alert/engine.js",
            instances: 1,
            autorestart: true
        }
    ]
};