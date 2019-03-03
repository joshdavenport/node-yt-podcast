import getFeeds from '../feed/list';
import fs, { writeFileSync } from 'fs';
import path from 'path';

export default async () => {
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		console.log(`[${feed.getId()}] Processing feed`);

		const publicFeedPath = path.resolve(__dirname, `../../public/feeds/${feed.getKey()}.xml`);
		let publicFeedSize = null;

		if(!fs.existsSync(publicFeedPath)) {
			console.log(`[${feed.getId()}] Creating new public feed`);
		} else {
			const publicFeedStat = fs.statSync(publicFeedPath);
			publicFeedSize = publicFeedStat.size;
		}

		const xml = await feed.getPodcastXml()

		fs.writeFileSync(publicFeedPath, xml);

		if(publicFeedSize) {
			const publicFeedStat = fs.statSync(publicFeedPath);
			if(publicFeedSize !== publicFeedStat.size) {
				console.log(`[${feed.getId()}] Public feed changed`);
			}
		}
	}, Promise.resolve());
}