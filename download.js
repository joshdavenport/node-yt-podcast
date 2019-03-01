import async from 'async';
import getFeeds from './src/feed/list';
import util from 'util';
import delay from 'delay';

require('dotenv').config();

(async () => {
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		console.log(`[${feed.getId()}] Processing feed`);

		const videosToProcess = feed.getStore().getVideos(false);

		await videosToProcess.reduce(async (videoPromise, video) => {
			await videoPromise;

			await video.download();
			feed.getStore().updateVideo(video);

			await delay(2000);
		}, Promise.resolve())

		feed.getStore().write();

		await delay(2000);
	}, Promise.resolve());
})()