#!/bin/bash
echo "===== 启动项目: ${PROJECT_NAME} ====="
cd /app
exec node dist/apps/${PROJECT_NAME}/src/main.js
