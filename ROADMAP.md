# Frontend Roadmap

## Database

Integrate with upcoming db, will be new endpoints in API
- improves site performance
- allows to query by tag and query by search
- allows to automatically generate a displayUri for old objkts (audio, images, etc)
- proportional UI (menu/minting form/profile/loading)
- config page (configurable hDAO votes/configurable aliases and profiles)

Consider better pagination structure like:
```
{
  items: [...],
  next: 'https://api.hicetnunc.xyz/feed?counter=2',
  previous: 'https://api.hicetnunc.xyz/feed?counter=0',
}
```
## Social sharing

In order to implement SSR I would suggest we migrate from RCA to Next.js. Next.js acts as a single page application but also as a static site generator. which will allow us to generate html pages for all the objkts.

We can consider other solutions to avoid migration to next.js.
