#!/bin/bash

# 检查是否有未提交的变更
if ! git diff-index --quiet HEAD --; then
    echo "存在未提交的变更，请提交所有变更后再运行脚本。"
    exit 1
fi

# 检查当前分支
current_branch=$(git symbolic-ref --short -q HEAD)
if [ "$current_branch" != "main" ]; then
    echo "当前不在main分支上，请切换到main分支后再运行脚本。"
    exit 1
fi

# 更新代码库
echo "正在更新代码库..."
if git pull; then
    echo "代码库更新成功。"
else
    echo "代码库更新失败！"
    exit 1
fi

# 构建并推送Docker镜像
echo "正在构建并推送Docker镜像..."
if docker buildx build --platform linux/amd64 --build-arg NODE_ENV=production -t blowxian/poe_tips:latest --push .; then     # 需要替换为你的镜像名称
    echo "Docker镜像构建并推送成功。"
else
    echo "Docker镜像构建或推送失败！"
    exit 1
fi

echo "所有操作成功完成。"