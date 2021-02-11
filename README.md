
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
REACT_APP_UNGRUND_POST_FILE='http://0.0.0.0:5000/dev/ipfs/post_file'
REACT_APP_UNGRUND_MINT='https://ci7muk9qia.execute-api.us-east-1.amazonaws.com/dev/api/v1/objkt/mint'
REACT_APP_UNGRUND_CURATE='https://ci7muk9qia.execute-api.us-east-1.amazonaws.com/dev/api/v1/objkt/curate'
REACT_APP_UNGRUND_COLLECT='https://ci7muk9qia.execute-api.us-east-1.amazonaws.com/dev/api/v1/objkt/collect'
REACT_APP_UNGRUND_OBJKT_FEED='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/feed'
REACT_APP_UNGRUND_OBJKT_SWAPS='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/swaps'
REACT_APP_UNGRUND_OBJKT_ID='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/id'
REACT_APP_UNGRUND_OBJKT_TZ_LEDGER='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/tz_ledger'
REACT_APP_UNGRUND_OBJKT_TZ_SWAPS='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/tz_swaps'
REACT_APP_UNGRUND_OBJKT_SWAPS_METADATA='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/swap_metadata'
REACT_APP_UNGRUND_OBJKT_LEDGER='https://jy187ti9ke.execute-api.us-east-1.amazonaws.com/dev/objkt/ledger'
```

in the present version you must have ungrund running accessing hicetnunc's module https://github.com/hicetnunc2000/ungrund

check the issues for contributing

`MIT license`