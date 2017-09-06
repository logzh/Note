
工作中使用 nvm 管理不同版本的 node 十分方便。本文简单介绍 nvm 的安装与使用。

## 安装

官方文档中有多种安装方式

### 手动安装
- 下载对应release版本（https://github.com/creationix/nvm）
- 解压后移动到指定目录

```
unzip xxxx.zip
mv xxxx ~/.nvm
```
- 在  *~/.bashrc*  中添加配置

```
source ~/.nvm/nvm.sh
export NVM_NODEJS_ORG_MIRROR=xxxxxxxxx
```
- 使其立即生效：

```
source ~/.bashrc
```
- 检查是否安装成功：

```
nvm
```

## 常见命令

```
nvm ls # 列出本地安装的版本
nvm ls-remote # 列出远端可安装版本
nvm install $VERSION # 安装指定版本
nvm install --lts node #安装长期支援 (long-term support) 版本
nvm alias default 6.11.0
nvm use v8.1.0 # 切换至指定版本node
```
