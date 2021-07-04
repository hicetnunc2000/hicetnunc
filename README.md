# hicetnunc UI

hicetnunc UI is intended to experiment with different smart contracts designs.

github deploy: https://main.d3cm9lcfrb8gaf.amplifyapp.com

```
node v12.18.3
npm 6.14.6
```

commands

```
npm i
npm start
```

docker

```
docker image build -t hicetnunc:1.0 .
docker run -it -p 3000:3000 hicetnunc:1.0
---remove
docker container rm --force hicetnunc
```

.env

```
REACT_APP_FEED='http://0.0.0.0:3001/feed'
REACT_APP_TZ='http://0.0.0.0:3001/tz'
REACT_APP_OBJKT='http://0.0.0.0:3001/objkt'
```

in the present version you must have ungrund running accessing hicetnunc's module https://github.com/hicetnunc2000/hicetnunc-api

check the issues for contributing

`MIT license`

# Contributing

Please read our CONTRIBUTING.md
