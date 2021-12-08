# N2RV

与 NSDBG-Next 共用数据库，提供看帖功能。

## 启动

```bash
git clone https://github.com/lixiang810/n2rv
```

之后请复制 `config/config.example.json` 到 `config/config.json` 并做好配置。

```bash
cd n2rv
yarn
# yarn dev 用于开发
yarn prod
```

## 配置说明与注意事项

使用前请安装 PostgreSQL 数据库。

main 分支的 commit 间不保证数据库迁移性，仅对不同 release 间有自动迁移支持，还请注意。

```jsonc
{
  "groupURL": "", // 小组URL，如：https://www.douban.com/group/717382/ 不要包含别的东西，尤其是问号 / 井号和它们后面那堆
  "httpsServerConfig": {
    // https 服务器的设置
    "servAddr": "", // 服务器工作地址（注意不是监听地址）
    "listenPort": 1145 // 服务器工作端口（注意不是监听端口）
  },
  "databaseConfig": {
    // 数据库相关设置
    "address": "", // 地址
    "port": 5555, // 端口
    "username": "", // 用户名
    "password": "", // 密码
    "database": "" // 数据库名
  },
  "usersConfig": {
    // 用户相关设置
    "allowSignUp": true, // 允许用户注册
    "allowAnonymous": true // 允许匿名发帖 / 回复
  },
  "bcryptConfig": {
    // bcrypt 配置
    "saltRounds": 19 // 加盐的参数，具体请学密码学
  },
  "signingConfig": {
    // 签名 / hash 相关配置
    "jwtSecrets": "FkYouChenRui", // jsonwebtoken 的 secrets，切勿外泄
    "uuidv5Namespace": "a0aa0eba-46dd-4e5b-aec1-6641c9931269" // 用于为匿名发帖的作者生成 uuidv5，可以了解一下 uuidv5 是什么
  },
  "uploadConfig": {
    // 上传文件相关配置
    "uploadFileStoragePath": "uploads/", // 上传文件存放目录
    "allowAllImages": true, // 允许所有 MIME 类型为图片的文件，开了以后，下面那个配置可以去掉 image/ 开头的 MIME-Type
    "allowedMimeType": ["image/jpeg", "image/png", "image/gif", "image/webp"] // 允许的 MIME 类型列表
  }
}
```
