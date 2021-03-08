
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
docker run -it -p 3000:3000 hicetnunc:1.0
---remove
docker container rm --force hicetnunc
```

.env
```
REACT_APP_UNGRUND_POST_FILE='http://0.0.0.0:5001/ipfs/post_file'
REACT_APP_UNGRUND_MINT='http://0.0.0.0:3001/api/v1/objkt/mint'
REACT_APP_UNGRUND_CURATE='http://0.0.0.0:3001/api/v1/objkt/curate'
REACT_APP_UNGRUND_COLLECT='http://0.0.0.0:3001/api/v1/objkt/collect'
REACT_APP_UNGRUND_OBJKT_FEED='http://0.0.0.0:5000/objkt/feed'
REACT_APP_UNGRUND_OBJKT_SWAPS='http://0.0.0.0:5000/objkt/swaps'
REACT_APP_UNGRUND_OBJKT_ID='http://0.0.0.0:5000/objkt/id'
REACT_APP_UNGRUND_OBJKT_TZ_LEDGER='http://0.0.0.0:5000/objkt/tz_ledger'
REACT_APP_UNGRUND_OBJKT_TZ_SWAPS='http://0.0.0.0:5000/objkt/tz_swaps'
REACT_APP_UNGRUND_OBJKT_SWAPS_METADATA='http://0.0.0.0:5000/objkt/swap_metadata'
REACT_APP_UNGRUND_OBJKT_LEDGER='http://0.0.0.0:5000/objkt/ledger'
```

in the present version you must have ungrund running accessing hicetnunc's module https://github.com/hicetnunc2000/ungrund

check the issues for contributing
