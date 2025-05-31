# 指定基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 将 package.json 复制到容器中
COPY package.json ./

# 使用 npm 安装依赖
RUN npm install

# 将项目的所有文件复制到容器中
COPY . .

# 暴露应用的端口
EXPOSE 3030

# 启动应用
CMD ["node", "main.js"]
