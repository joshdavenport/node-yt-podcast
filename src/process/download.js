import getFeeds from '../feed/list';
import delay from 'delay';

export default async () => {
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		console.log(`[${feed.getId()}] Processing feed`);

		const videosToProcess = feed.getStore().getVideos(false);

		await videosToProcess.reduce(async (videoPromise, video) => {
			await videoPromise;

			console.log(`[${video.getId()}] Starting download`);
			try {
				await video.download();
			} catch (err) {
				console.error(`[${video.getId()}] ${e.message}`);
			}
			console.log(`\n[${video.getId()}] Finished download`);

			feed.getStore().updateVideo(video);
			feed.getStore().write();
			
			await delay(2000);
		}, Promise.resolve())

		await delay(2000);
	}, Promise.resolve());
}