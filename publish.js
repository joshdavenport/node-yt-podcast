import getFeeds from './src/feed/list';
import fs from 'fs';
import path from 'path';

require('dotenv').config();

(async () => {
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		fs.writeFileSync(path.resolve(__dirname, `./public/feeds/${feed.getKey()}.xml`), feed.getPodcastXml());
	}, Promise.resolve());
})()