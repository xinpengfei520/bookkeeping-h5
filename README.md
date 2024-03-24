# bookkeeping-h5

my bookkeeping html5 project.

## 部署

## Nginx 部署

- 将代码压缩打包上传到服务器，或者使用 git 将代码 clone 到服务器；
- 放到指定目录，进行解压；
- 添加 nginx 配置；

使用 VI 编辑器：```vi etc/nginx/nginx.conf```

```
cd etc/nginx/ # booking/index.html 使用相同IP，相同端口，不同域名，必须要监听80端口否则匹配不到
    server {
        listen       80;
        server_name  example.com;
        server_tokens off;
        return   301 https://$server_name$request_uri;
    }

    server {
        listen      443 ssl;
        server_name example.com;
        root /opt/html/booking;
        index index.html;
        ssl_certificate cert/example.com.pem;
        ssl_certificate_key cert/example.com.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
        ssl_prefer_server_ciphers on;

        location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
            root /opt/html/booking;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

需要修改其中 4 行：

```
server_name example.com; # 域名
root /opt/html/booking; # HTML位置
ssl_certificate cert/example.com.pem; # SSL 证书
ssl_certificate_key cert/example.com.key; # SSL 证书
```

## Vercel 部署（推荐）

- Fork 项目到你的仓库；
- 打开 [Vercel](https://vercel.com/) 使用 GitHub 登录；
- import 项目，如果找不到，说明没有权限，建议将 只需要使用 Vercel 部署的项目开发给 Vercel；
- 导入之后部署；
- 根据需要，绑定自定义域名（可选），绑定域名后会自动帮我们生成 SSL 证书；

## FAQ

如果访问不到 js 文件，报 403 Forbidden error 错误，一般是权限问题，修改权限即可，一般的权限规则如下：

- Folders: 755
- Static Content: 644
- Dynamic Content: 700