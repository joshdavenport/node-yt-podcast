import YoutubeChannel from 'youtube-channel-video-fetcher';
import getFeeds from '../feed/list';
import Video from '../feed/video';

export default async () => {
	await getFeeds().map(async feed => {
		const youtubeChannel = new YoutubeChannel(feed.getId());
		const youtubeVideos = await youtubeChannel.getVideos();
		const feedTitleRegex = new RegExp(feed.regex);

		youtubeVideos.videos.reverse().forEach(youtubeVideo => {
			let video = new Video({
				id: youtubeVideo.id,
				title: youtubeVideo.title,
				thumbnail: youtubeVideo.thumbnail,
				date: youtubeVideo.timestamp
			});

			if(feed.isVideoValidForFeed(video) && !feed.isVideoInStore(video)) {
				feed.getStore().addVideo(video);
			}
		});

		feed.getStore().write();
	});
}