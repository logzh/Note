## 安装 Reids

```
tar xzf redis-stable.tar.gz
cd redis-stable
make #src目录中生成若干可执行文件
make install #将可执行文件复制到/usr/local/bin
make test
```

## 启动 Reids

### 直接启动

```
redis-server # 默认使用 6379 端口
redis-server --port 6380 # 指定端口启动
```
### 通过初始化脚本启动

生产环境中推荐

在 Reids 源代码目录的 utils 中有个 redis_init_script 脚本：
```
#!/bin/sh
#
# Simple Redis init.d script conceived to work on Linux systems
# as it does use of the /proc filesystem.

REDISPORT=6379
EXEC=/usr/local/bin/redis-server
CLIEXEC=/usr/local/bin/redis-cli

PIDFILE=/var/run/redis_${REDISPORT}.pid
CONF="/etc/redis/${REDISPORT}.conf"

case "$1" in
    start)
        if [ -f $PIDFILE ]
        then
                echo "$PIDFILE exists, process is already running or crashed"
        else
                echo "Starting Redis server..."
                $EXEC $CONF
        fi
        ;;
    stop)
        if [ ! -f $PIDFILE ]
        then
                echo "$PIDFILE does not exist, process is not running"
        else
                PID=$(cat $PIDFILE)
                echo "Stopping ..."
                $CLIEXEC -p $REDISPORT shutdown
                while [ -x /proc/${PID} ]
                do
                    echo "Waiting for Redis to shutdown ..."
                    sleep 1
                done
                echo "Redis stopped"
        fi
        ;;
    *)
        echo "Please use start or stop as first argument"
        ;;
esac
```

我们需要配置 Redis 的运行方式和持久化文件、日志文件的存储位置等。具体步骤如下：

* 配置初始化脚本。
```
mv utils/redis_init_script /etc/init.d/redis_6379
```

* 新建文件夹
```
mkdir /etc/redis         # 存放 redis 配置
mkdir /data/redis/6379   # 存放 redis 持久文件
```

* 修改配置文件
```
 mv redis.conf /etc/redis/6379.conf
```

修改具体配置
```
daemonize yes                        # 使得 Redis 以守护进程模式运行
pidfile   /var/run/redis_6379.pid    # 设置 Redis 的 PID 文件文职
port      6379                       # 设置监听端口
dir       /data/redis/6379           # 设置持久化文件位置
```

启动 Redis
```
/etc/init.d/redis_6379 start
```

设置 Redis 随系统启动

```
sudo update-rc.d redis_6379 defaults 
```

## 停止 Redis

强行终止 Redis 进程可能导致数据丢失。正确的方式是向 Redis 发送 shutdown 命令

```
redis-cli shutdown
```

或

```
/etc/init.d/redis_6379 stop
```

## 使用 Reids 命令行客户端

```
redis-cli                                # 默认服务器 127.0.0.1 端口 6379
redis-cli -h 10.23.34.56 -p 6379         # 指定服务器与端口
redis-cli -h r1.redis.test.db -p 30000   # 指定服务器与端口
```

```
auth testpsw
select 1
info
ping
dbsize # 数据库键个数
...
```
## Redis 配置

具体参考 */etc/redis/6379.conf*，文档详细

* 持久化：
 * RDB
 * AOF
