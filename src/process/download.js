import getFeeds from '../feed/list';
import delay from 'delay';
import { anyProcessRunning } from '../monitor';

export default async () => {
	if (await anyProcessRunning()) {
		console.log('Exiting as another process is running');
		process.exit();
	}

	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		console.log(`[${feed.getId()}] Processing feed`);

		const videosToProcess = feed.getStore().getVideos(false);

		await videosToProcess.reduce(async (videoPromise, video) => {
			await videoPromise;

			await video.download();
			feed.getStore().updateVideo(video);

			feed.getStore().write();
			await delay(2000);
		}, Promise.resolve())

		await delay(2000);
	}, Promise.resolve());
}