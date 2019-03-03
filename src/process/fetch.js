import YoutubeChannel from 'youtube-channel-video-fetcher';
import getFeeds from '../feed/list';
import Video from '../feed/video';

export default async () => {
	await getFeeds().reduce(async (feedPromise, feed) => {
		await feedPromise;

		console.log(`[${feed.getId()}] Processing feed`);

		const youtubeChannel = new YoutubeChannel(feed.getId());
		const youtubeVideos = await youtubeChannel.getVideos();

		youtubeVideos.videos.reverse().forEach(youtubeVideo => {
			let video = new Video({
				id: youtubeVideo.id,
				title: youtubeVideo.title,
				thumbnail: youtubeVideo.thumbnail,
				date: youtubeVideo.timestamp
			});

			if(feed.isVideoValidForFeed(video) && !feed.isVideoInStore(video)) {
				console.log(`[${feed.getId()}] Added video ${video.getId()}`);

				feed.getStore().addVideo(video);
			}
		});

		feed.getStore().write();
	}, Promise.resolve());
}