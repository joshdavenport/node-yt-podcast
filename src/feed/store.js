import fs from 'fs';
import path from 'path';
import Video from './video';

class Store {

	constructor (id) {
		this.id = id;
		this.data = [];

		this.init();
	}

	init () {;
		if(fs.existsSync(this.getStorePath())) {
			this.data = require(this.getStorePath()).map(videoData => {
				return new Video(videoData);
			});
		}

		return this;
	}

	getVideos (downloaded) {
		if(typeof downloaded === 'undefined') {
			return this.data;
		} else {
			return this.data.filter(storeVideo => !!storeVideo.file === downloaded)
		}
	}

	addVideo (video) {
		this.data.push(video);

		return this;
	}

	updateVideo (video) {
		return this.data.map(storeVideo => {
			if(storeVideo.getId() === video.getId()) {
				return video;
			} else {
				return storeVideo;
			}
		});
	}

	hasVideo (video) {
		return !!this.data.find(storeVideo => video.getId() === storeVideo.getId());
	}

	write () {
		let writeData = this.data.map(video => video.getStoreData());
		fs.writeFileSync(this.getStorePath(), JSON.stringify(writeData, null, 2));

		return this;
	}

	getStorePath () {
		return path.resolve(__dirname, `../../public/feeds/${this.id}.json`);
	}

}

export default Store;