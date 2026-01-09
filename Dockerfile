# --- 第一阶段：构建 ---

# 使用 Node.js 构建阶段
FROM node:20 as builder
WORKDIR /appbuilder
COPY . .
RUN rm -rf dist
RUN npm install --prefer-offline --no-audit && npm run build

# --- 第二阶段：生产依赖提取 ---
# 这一步可以确保生产镜像只包含运行所需的最小依赖
FROM node:20-alpine as runner
WORKDIR /app

# 拷贝构建后的结果
COPY --from=builder /appbuilder/dist ./dist
COPY --from=builder /appbuilder/package*.json ./
COPY --from=builder /appbuilder/bash.sh ./
COPY --from=builder /appbuilder/swaggerJson ./swaggerJson

# 关键：只安装生产环境依赖
# 使用 --mount=type=cache 可以大幅加速第二次构建
RUN npm install --production --ignore-scripts --prefer-offline --mount=type=cache

# 设置权限
RUN chmod +x ./bash.sh

# 删除构建阶段残余文件（可选）
RUN rm -rf /appbuilder


ENTRYPOINT ["/bin/sh", "./bash.sh"]
