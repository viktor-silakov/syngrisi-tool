/// <reference types="vitest" />
import { suite } from 'vitest';
import { checkEmptyDirectory, checkNodeVersion, checkDocker } from './index.js';

export default suite('index', test => {
    test('checkEmptyDirectory - empty directory', () => {
        const directory = './test/empty_directory';
        console.log(`Creating an empty directory at ${directory}...`);
        fs.mkdirSync(directory);
        const result = checkEmptyDirectory(directory);
        console.log(`Result: ${result}`);
        console.log(`Deleting directory ${directory}...`);
        fs.rmdirSync(directory);
        assert(result, 'checkEmptyDirectory should return true for an empty directory');
    });

    test('checkEmptyDirectory - non-empty directory', () => {
        const directory = './test/non_empty_directory';
        console.log(`Creating a non-empty directory at ${directory}...`);
        fs.mkdirSync(directory);
        fs.writeFileSync(`${directory}/file1.txt`, 'test');
        const result = checkEmptyDirectory(directory);
        console.log(`Result: ${result}`);
        console.log(`Deleting directory ${directory}...`);
        fs.unlinkSync(`${directory}/file1.txt`);
        fs.rmdirSync(directory);
        assert(!result, 'checkEmptyDirectory should return false for a non-empty directory');
    });

    test('checkNodeVersion - supported version', () => {
        const origVersion = process.version;
        process.version = 'v14.0.0';
        checkNodeVersion();
        console.log(`Setting process.version back to ${origVersion}`);
        process.version = origVersion;
        assert(true, 'checkNodeVersion should not throw an error for a supported version');
    });

    test('checkNodeVersion - unsupported version', () => {
        const origVersion = process.version;
        process.version = 'v13.0.0';
        let error;
        try {
            checkNodeVersion();
        } catch (e) {
            error = e;
        }
        console.log(`Setting process.version back to ${origVersion}`);
        process.version = origVersion;
        assert(!!error, 'checkNodeVersion should throw an error for an unsupported version');
    });

    test('checkDocker - installed', () => {
        child_process.execSync = () => {};
        const result = checkDocker();
        console.log(`Result: ${result}`);
        assert(result, 'checkDocker should return true when Docker is installed');
    });

    test('checkDocker - not installed', () => {
        child_process.execSync = () => { throw new Error(); };
        const result = checkDocker();
        console.log(`Result: ${result}`);
        assert(!result, 'checkDocker should return false when Docker is not installed');
    });
});
