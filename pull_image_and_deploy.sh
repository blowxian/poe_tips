#!/bin/bash

# 更新代码库
echo "正在更新代码库..."
if git pull; then
    echo "代码库更新成功。"
else
    echo "代码库更新失败！"
    exit 1
fi

# 拉取最新的 Docker 镜像
echo "正在拉取最新的 Docker 镜像..."
if docker-compose -f docker-compose.prod.yml pull aipg; then
    echo "Docker 镜像拉取成功。"
else
    echo "Docker 镜像拉取失败！"
    exit 1
fi

# 停止 Docker 容器
echo "正在停止 Docker 容器..."
if docker-compose -f docker-compose.prod.yml stop poe_tips; then
    echo "Docker 容器停止成功。"
else
    echo "Docker 容器停止失败！"
    exit 1
fi

# 启动 Docker 容器
echo "正在启动 Docker 容器..."
if docker-compose -f docker-compose.prod.yml up poe_tips -d; then
    echo "Docker 容器启动成功。"
else
    echo "Docker 容器启动失败！"
    exit 1
fi

# 清理系统
echo "正在清理系统..."
if docker system prune -a -f; then
    echo "系统清理成功。"
else
    echo "系统清理失败！"
    exit 1
fi

echo "所有操作成功完成。"
