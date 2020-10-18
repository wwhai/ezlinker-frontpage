#! /bin/bash
npm run build
#docker stop ezlinker-front-end:$VERSION
#docker rm ezlinker-front-end:$VERSION
docker build -t ezlinker-front-end:$VERSION .
docker run -p 9999:80 -d ezlinker-front-end:$VERSION