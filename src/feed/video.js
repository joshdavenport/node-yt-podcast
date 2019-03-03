import youtubedl from 'youtube-dl';
import fs from 'fs';
import path from 'path';

class Video {

	constructor (videoData) {
		if(!videoData.id || !videoData.title || !videoData.thumbnail || !videoData.date) {
			throw new Error('Missing data for video');
		}

		this.id = videoData.id;
		this.title = videoData.title;
		this.thumbnail = videoData.thumbnail;
		this.date = videoData.date;
		this.file = videoData.file;
	}

	getId () {
		return this.id;
	}

	getUrl () {
		return `https://www.youtube.com/watch?v=${this.id}`;
	}

	getTitle () {
		return this.title;
	}

	getThumbnail () {
		return this.thumbnail.replace(/hqdefault.*$/, 'maxresdefault.jpg');
	}

	getDate () {
		return this.date;
	}

	getFile () {
		return fs.existsSync(this.getFilePath()) ? this.getFileName() : null;
	}

	getFileUrl () {
		return `${process.env.APP_URL}audio/${this.getFileName()}`;
	}

	getFilePath () {
		return path.resolve(__dirname, `../../public/audio/${this.getFileName()}`);
	}

	getFileName () {
		return `${this.id}.mp3`;
	}

	getStoreData () {
		return {
			id: this.getId(), 
			title: this.getTitle(), 
			thumbnail: this.getThumbnail(), 
			date: this.getDate(),
			file: this.getFile()
		}
	}

	async download () {
		let download = new Promise((resolve, reject) => {
			const video = youtubedl.exec(
				this.getUrl(), 
				[
					'-x',
					'--audio-format','mp3',
					'--audio-quality','8',
					'--prefer-ffmpeg',
					'-o',`${this.getId()}.%(ext)s`
				],
				{ 
					cwd: path.resolve(__dirname, '../../public/audio')
				},
				(err, output) => {
					resolve();
				}
			);
		});

		await download;
		return this;
	}

}

export default Video;