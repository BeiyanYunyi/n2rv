# N2RV

与 NSDBG-Next 共用数据库，提供看帖功能。

## 启动

```bash
git clone https://github.com/lixiang810/n2rv
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
  "address": "", // 数据库地址
  "servAddr": "", // 服务器地址（用于网页链接等）
  "listenPort": 1145, // 服务器监听端口
  "port": 5555, // 数据库监听端口
  "username": "", // 数据库用户名
  "password": "", // 数据库密码
  "database": "nsdbg", // 数据库名
  "groupURL": "", // 豆瓣小组链接，例：https://www.douban.com/group/114514/ 注意不要包含别的东西
  "usersSettings": { "allowSignUp": true }, // 允许注册
  "bcryptConfig": {
    "saltRounds": 114514 // bcrypt 的 saltRounds
  },
  "jwtSecrets": "FkYouChenRui", // JsonWebToken 的密钥，注意保管
  "uuidv5Namespace": "a0aa0eba-46dd-4e5b-aec1-6641c9931269", // 一个 uuid（版本不限），用于生成 uuidv5
  "allowAnonymous": true, // 允许匿名发帖 / 回复
  "upload": {
    "uploadFileStoragePath": "uploads/", // 文件上传目录
    "allowAllImages": true, // 允许所有 MIME 类型为图片的文件，开了以后，下面那个配置可以去掉 image/ 开头的 MIME-Type
    "allowedMimeType": ["image/jpeg", "image/png", "image/gif", "image/webp"] // 允许的 MIME 类型列表
  }
}
```
