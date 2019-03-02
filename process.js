import program from 'commander';
import processFns from './src/process';
import { anyOtherProcessRunning } from './src/monitor';

require('dotenv').config();

(async () => {

    let command;

    program.version('1.0.0')
        .arguments('<cmd>')
        .option('--single-mode', 'Only allow a single process at once, exit if another is found')
        .action(cmd => {
            command = cmd;
        })
        .parse(process.argv);
    
    if(!command) {
        console.error('No command given');
        process.exit(1);
    }

    if(program.singleMode) {
        if (await anyOtherProcessRunning(command)) {
            console.error('Exiting as another process is running');
            process.exit();
        }
    }

    if(processFns[command]) {
        console.log(`> Starting ${command}`);
        await processFns[command]();
        console.log(`> Finished ${command}`);
    } else {
        console.log(`> Command not found: ${command}`);
    }

})();