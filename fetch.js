import YoutubeChannel from 'youtube-channel-video-fetcher';
import getFeeds from './src/feed/list';
import Video from './src/feed/video';

require('dotenv').config();

(async () => {
	await getFeeds().map(async feed => {
		const youtubeChannel = new YoutubeChannel(feed.getId());
		const youtubeVideos = await youtubeChannel.getVideos();
		const feedTitleRegex = new RegExp(feed.regex);

		youtubeVideos.videos.reverse().forEach(youtubeVideo => {
			let video = new Video({
				id: youtubeVideo.id,
				title: youtubeVideo.title,
				thumbnail: youtubeVideo.thumbnail,
				date: Math.floor(youtubeVideo.timestamp / 1000)
			});

			if(feed.isVideoValidForFeed(video) && !feed.isVideoInStore(video)) {
				feed.getStore().addVideo(video);
			}
		});

		feed.getStore().write();
	});
})()