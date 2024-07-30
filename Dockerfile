# 使用官方的 Node.js 18 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制 Prisma schema
COPY prisma ./prisma

# 运行 Prisma generate
RUN npx prisma generate

# 复制应用代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 暴露应用的端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]