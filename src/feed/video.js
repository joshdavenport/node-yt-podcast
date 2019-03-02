import ytdl from 'ytdl-core';
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
			const stream = fs.createWriteStream(this.getFilePath());
			const video = ytdl(
				this.getUrl(), 
				{   
					filter: 'audioonly',
					quality: 'highestaudio',
					format: 'mp3'
				}
			);
			let previousPercentage = 0;

			console.log(`[${this.getId()}] Starting download`);

			video.pipe(stream);
			video.on('response', res => {
				const totalSize = res.headers['content-length'];
				let dataRead = 0;

				res.on('data', data => {
					dataRead += data.length;
					const percent = Math.round(dataRead / totalSize * 100);

					if(percent !== previousPercentage) {
						previousPercentage = percent;
						process.stdout.cursorTo(0);
						process.stdout.clearLine(1);
						process.stdout.write(`[${this.getId()}] ${percent}%`);
					}
				});
			})

			stream.on('close', () => {
				console.log(`\n[${this.getId()}] Finished download`);
				resolve();
			});
		});

		await download;
		return this;
	}

}

export default Video;