import * as fs from 'fs';
import * as path from 'path';

const GamedataLoader = {
    loadJson: (filePath: string) => {
        const fullPath = path.join(__dirname, '..', 'public', filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(fileContent);
    }
}

const main = async () => {
    const isDryRun = process.argv.includes('--dry-run');

    const translations = await GamedataLoader.loadJson('locales/en.json');

    const directoriesToScan = ['./components', './game', './'];
    const filesToScan: string[] = [];
    const excludedDirs = ['node_modules', '.git', 'dist', 'dist-test'];

    const findFiles = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (excludedDirs.some(excluded => fullPath.includes(excluded))) {
                continue;
            }
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                findFiles(fullPath);
            } else if (/\.(ts|js|tsx|jsx)$/.test(file)) {
                filesToScan.push(fullPath);
            }
        }
    };

    for (const dir of directoriesToScan) {
        const fullPath = path.join(__dirname, '..', dir);
        findFiles(fullPath);
    }

    const usedKeys = new Set<string>();
    const keyRegex = /t\(['"`]([^'"`]+)['"`]/g;

    for (const file of filesToScan) {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = keyRegex.exec(content)) !== null) {
            usedKeys.add(match[1]);
        }
    }

    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                Object.assign(acc, flattenObject(obj[k], pre + k));
            } else {
                acc[pre + k] = obj[k];
            }
            return acc;
        }, {} as Record<string, any>);
    };

    const translationKeys = new Set(Object.keys(flattenObject(translations)));

    const unusedKeys = [...translationKeys].filter(key => !usedKeys.has(key));
    const missingKeys = [...usedKeys].filter(key => !translationKeys.has(key));

    console.log('\n--- Translation Analysis ---');
    console.log(`Deleted keys (${unusedKeys.length}):`);
    unusedKeys.forEach(key => console.log(`- ${key}`));

    console.log(`\nMissing keys (${missingKeys.length}):`);
    missingKeys.forEach(key => console.log(`- ${key}`));

    if(missingKeys.length > 0) {
        console.log('\n--- Prompt for Coding Agent ---');
        let prompt = `Please add the following missing translation keys to public/locales/en.json, respecting the existing lore and style. Make sure to include placeholders for dynamic data where appropriate (e.g., {name}, {count}).\n\n`;
        prompt += '{\n';
        missingKeys.forEach(key => {
            prompt += `  "${key}": "",\n`
        });
        prompt += '}';
        console.log(prompt);
    }

    if (isDryRun) {
        console.log('\n--- Dry Run ---');
        console.log('No files were modified.');
        return;
    }

    const deleteKey = (obj: any, key: string) => {
        const keys = key.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
            if (current === undefined) return;
        }
        delete current[keys[keys.length - 1]];
    }

    unusedKeys.forEach(key => deleteKey(translations, key));

    const sortObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        return Object.keys(obj).sort().reduce((result: any, key: string) => {
            result[key] = sortObject(obj[key]);
            return result;
        }, {});
    };

    const sortedTranslations = sortObject(translations);

    const outputPath = path.join(__dirname, '..', 'public', 'locales', 'en.json');
    fs.writeFileSync(outputPath, JSON.stringify(sortedTranslations, null, 2));

    console.log('\nSuccessfully sorted en.json and removed unused keys.');
};

main().catch(error => {
    console.error("An error occurred:", error);
    process.exit(1);
});
