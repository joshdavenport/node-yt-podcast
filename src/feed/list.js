import _ from 'lodash';
import feeds from '../../config/feeds.json';
import Feed from '../feed';

export default () => {
	return feeds.filter(feedData => !feedData.disabled)
		.map(feedData => {
			let feed = new Feed(feedData);

			return feed;
		});
}