# olevod-api
API helper to get info from olevod.com


## Installation

```
npm install @lawchihon/olevod-api
```

## Peer Dependencies
- [@johman/helper](https://www.npmjs.com/package/@johman/helper): Joined mini functions to help minimize duplicated coding between projects.
- [axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js.
- [cheerio](https://github.com/cheeriojs/cheerio): Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- [lodash](https://github.com/lodash/lodash): A modern JavaScript utility library delivering modularity, performance & extras.

`Note: Peer dependencies are required to be installed.`

## Documentation
`Note: All functions are returning in promise and optional to pass a custom axios instance`

- `alive`: Check if olevod.com is accessible

```
const alive = await Olevod.alive();
```

```
const alive = await Olevod.alive(axiosInstance);
```

```
const alive = await Olevod.alive({instance: axiosInstance});
```

- `getFilters`: Get the filters that is supported on olevod.com

```
const filters = await Olevod.getFilters();
```

```
const filters = await Olevod.getFilters(false, axiosInstance);
```

```
const filters = await Olevod.getFilters({isAdult: false, instance: axiosInstance});
```

- `getVideos`: Search for videos on olevod.com

`Note: When search applied, typeId will not apply to the search results`

`Note2: 'page' default to be 1`

```
const videos = await Olevod.getVideos(search, typeId, page, order, year, letter, area, language, condition, instance);
```

```
const videos = await Olevod.getVideos({search, typeId, page, order, year, letter, area, language, condition, instance});
```

- `getVideo`: Get the video info base on detailId

```
const video = await Olevod.getVideo(detailId, instance);
```

```
const video = await Olevod.getVideo({detailId, instance});
```

- `getPlayInfo`: Get the play info base on playId

```
const playInfo = await Olevod.getPlayInfo(playId, instance);
```

```
const playInfo = await Olevod.getPlayInfo({playId, instance});
```

### Video format
```
{
    // video detail id
    detailId: String,
    // title of video
    title: String,
    // string of video picture link - Not available when getVideos() without search or typeId
    picture: String,
    // video description - Only available when return from getVideo() and getPlayInfo()
    description: String,
    // array of play info - Only available when return from getVideo()
    playInfos: Array<PlayInfo>
}
```

### Play Info format
```
{
    // play id
    playId: playId,
    // title of the play
    title: String,
    // video url of the play - Only available when return from getPlayInfo()
    videoUrl: String
    // video detail of the play - Only available when return from getPlayInfo()
    detail: Video
}
```

## Testing

```
npm run test
```

## License
[MIT](LICENSE)
