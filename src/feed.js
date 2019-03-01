import path from 'path';
import Store from './feed/store';
import Podcast from 'podcast';
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

	getPodcastXml () {
		// TODO: Add more metadata: thumbnail, author, url
		const feedPodcast = new Podcast({
			title: this.getName(),
			description: this.getDescription(),
			image_url: 
		});

		this.getStore().getVideos(true).forEach(video => {
			feedPodcast.addItem({
				title: video.getTitle(),
				url: video.getFileUrl(),
				guid: video.getId(),
				// TODO: parse in moment and convert to standard datetime format
				date: video.getDate(),
				itunesImage: video.getThumbnail()
			})
		});

		return feedPodcast.buildXml();
	}

}

export default Feed;