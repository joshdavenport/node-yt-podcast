import fs from 'fs';
import Store from './feed/store';
import Podcast from 'podcast';
import YouTube from 'simple-youtube-api';
import mp3Duration from 'mp3-duration';

class Feed {

	constructor (feedData) {
		if(!feedData.name || !feedData.description || !feedData.id || !feedData.key || !feedData.regex) {
			throw new Error('Missing data for feed');
		}

		this.name = feedData.name;
		this.description = feedData.description;
		this.id = feedData.id;
		this.key = feedData.key;
		this.regex = feedData.regex;

		this.store = new Store(this.key);
	}

	getStore () {
		return this.store;
	}

	getName () {
		return this.name;
	}

	getDescription () {
		return this.description;
	}

	getId () {
		return this.id;
	}

	getChannelUrl () {
		return `https://www.youtube.com/channel/${this.getId()}`;
	}

	getKey () {
		return this.key;
	}

	getRegex () {
		const regexParsed = this.regex.match(/^\/([^\/]*?)\/([gimuy]*?)$/);

		if(regexParsed.length !== 3) {
			throw new Error('Invalid feed regex');
		}

		return new RegExp(regexParsed[1], regexParsed[2]);
	}

	isVideoValidForFeed (video) {
		return this.getRegex().exec(video.getTitle());
	}

	isVideoInStore (video) {
		return this.getStore().hasVideo(video);
	}

	async getPodcastXml () {
		const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
		const channel = await youtube.getChannelByID(this.getId());
		
		// TODO: Add more metadata: thumbnail, author, url
		const feedPodcast = new Podcast({
			title: this.getName(),
			description: this.getDescription(),
			site_url: this.getChannelUrl(),
			image_url: channel.thumbnails.high.url
		});

		this.getStore().getVideos(true).forEach(video => {
			const fileStats = fs.statSync(video.getFilePath());

			feedPodcast.addItem({
				title: video.getTitle(),
				url: video.getUrl(),
				enclosure: {
					url: video.getFileUrl(),
					type: 'audio/mpeg',
					size: fileStats.size
				},
				guid: video.getId(),
				// TODO: parse in moment and convert to standard datetime format
				date: video.getDate(),
				itunesImage: video.getThumbnail(),
				// itunesDuration: mp3Duration(video.getFilePath()),
			})
		});

		return feedPodcast.buildXml(true);
	}

}

export default Feed;