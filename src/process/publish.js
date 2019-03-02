import getFeeds from '../feed/list';
import fs, { writeFileSync } from 'fs';
import path from 'path';

export default async () => {
	if (await anyProcessRunning()) {
		console.log('Exiting as another process is running');
		process.exit();
	}
	
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;
		const xml = await feed.getPodcastXml()

		fs.writeFileSync(path.resolve(__dirname, `./public/feeds/${feed.getKey()}.xml`), xml);
	}, Promise.resolve());
}