# EZLINKER 前端项目
## 1.本地运行
前端是个VUE项目，用的Elementui和D2admin.
```
npm install
npm run dev
```

## 2.打包Docker镜像
```shell
docker build -t ezlinker-frontend:latest .
```
> 注意：打包的时候，如果你有API路径前缀，可以修改.env文件中的`VUE_APP_API=/`为你的前缀。