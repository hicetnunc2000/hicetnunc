
# hicetnunc UI

hicetnunc UI is intended to experiment with different smart contracts designs.

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
docker run -it -p 80:3000 hicetnunc:1.0
---remove
docker container rm --force hicetnunc
```

.env
```
REACT_APP_POST_IPFS='http://localhost:5000/source/post_ipfs'
REACT_APP_UNGRUND_ORIGINATE='http://localhost:5000/source/publish'
REACT_APP_UNGRUND_CONTRIBUTE='http://localhost:5000/source/contribute'
REACT_APP_UNGRUND_WITHDRAW='http://localhost:5000/source/withdraw'
REACT_APP_UNGRUND_TRANSFER='http://localhost:5000/source/transfer'
REACT_APP_UNGRUND_FEED='http://localhost:5000/source/feed'
REACT_APP_UNGRUND_TZ='http://localhost:5000/source/tz'
REACT_APP_UNGRUND_KT='http://localhost:5000/source/kt'
```

in the present version you must have ungrund running accessing hicetnunc's module https://github.com/hicetnunc2000/ungrund

check the issues for contributing

`MIT license`