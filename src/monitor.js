import _ from 'lodash';
import psaux from 'psaux';

export const anyOtherProcessRunning = async (exclude) => {
    const processes = await psaux();

    return processes.query({ command: '~node' })
        .filter(process => process.command.search('process.js') !== -1)
        .filter(process => process.command.search('--single-mode') !== -1)
        .filter(process => process.command.search(`process.js ${exclude}`) === -1)
        .length > 0;
}