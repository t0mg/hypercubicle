import * as fs from 'fs';
import * as path from 'path';

// Utility to load the main translation file.
const GamedataLoader = {
    loadJson: (filePath: string) => {
        const fullPath = path.join(__dirname, '..', 'public', filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(fileContent);
    }
};

// Recursively finds all keys in a nested object.
const listKeys = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((res, el) => {
        const key = prefix ? `${prefix}.${el}` : el;
        if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...listKeys(obj[el], key)];
        }
        return [...res, key];
    }, [] as string[]);
};

// Recursively sorts an object's keys.
const sortObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    return Object.keys(obj).sort().reduce((result: any, key: string) => {
        result[key] = sortObject(obj[key]);
        return result;
    }, {});
};


const main = async () => {
    const shouldWrite = process.argv.includes('--write');
    console.log('Analyzing translations...');
    const translations = GamedataLoader.loadJson('locales/en.json');
    const translationKeys = new Set(listKeys(translations));

    const sourceDirectories = ['./components', './game', './'];
    const filesToScan: string[] = [];
    // Exclude test files, dependencies, and build artifacts.
    const excludedPatterns = [
        /node_modules/,
        /\.git/,
        /dist/,
        /tests/,
        /jules-scratch/,
        /\.test\.ts$/,
        /\.spec\.ts$/
    ];

    const findSourceFiles = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (excludedPatterns.some(pattern => pattern.test(fullPath))) {
                continue;
            }
            if (entry.isDirectory()) {
                findSourceFiles(fullPath);
            } else if (/\.(ts|js|tsx|jsx)$/.test(entry.name)) {
                filesToScan.push(fullPath);
            }
        }
    };

    for (const dir of sourceDirectories) {
        const fullPath = path.join(__dirname, '..', dir);
        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
            findSourceFiles(fullPath);
        }
    }

    // Store each key and a list of locations where it's used.
    const usedKeys = new Map<string, { path: string; line: number }[]>();
    // Regex to find t('key.name') usages.
    const keyRegex = /t\(['"`]([^'"`]+)['"`]/g;

    for (const file of filesToScan) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((lineContent, index) => {
            let match;
            while ((match = keyRegex.exec(lineContent)) !== null) {
                const key = match[1];
                // Ignore keys that are dynamically constructed.
                if (key.includes('${')) {
                    continue;
                }

                const location = { path: file, line: index + 1 };
                const existing = usedKeys.get(key) || [];
                existing.push(location);
                usedKeys.set(key, existing);
            }
        });
    }

    const unusedKeys = [...translationKeys].filter(key => !usedKeys.has(key));
    const missingKeys = [...usedKeys.keys()].filter(key => !translationKeys.has(key));

    console.log('\n--- Translation Analysis Report ---');

    if (unusedKeys.length > 0) {
        console.log(`\n[INFO] Found ${unusedKeys.length} unused translation keys in en.json:`);
        unusedKeys.forEach(key => console.log(`- ${key}`));
    } else {
        console.log('\n[INFO] No unused translation keys found.');
    }

    if (missingKeys.length > 0) {
        console.log(`\n[WARNING] Found ${missingKeys.length} missing translation keys in the code:`);
        missingKeys.forEach(key => {
            console.log(`- ${key}`);
            const locations = usedKeys.get(key);
            locations?.forEach(loc => {
                const relativePath = path.relative(process.cwd(), loc.path);
                console.log(`    at ${relativePath}:${loc.line}`);
            });
        });

        console.log('\n--- Prompt for Coding Agent ---');
        let prompt = `Please add the following missing translation keys to public/locales/en.json, respecting the existing lore and style. Make sure to include placeholders for dynamic data where appropriate (e.g., {name}, {count}).\n\n`;
        prompt += '{\n';
        missingKeys.forEach(key => {
            prompt += `  "${key}": "",\n`
        });
        prompt += '}';
        console.log(prompt);
    } else {
        console.log('\n[INFO] No missing translation keys found.');
    }

    if (shouldWrite) {
        console.log('\nWriting changes to en.json...');
        const deleteKey = (obj: any, keyPath: string) => {
            const keys = keyPath.split('.');
            let current = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
                if (current === undefined) return;
            }
            delete current[keys[keys.length - 1]];
        };

        unusedKeys.forEach(key => deleteKey(translations, key));
        const sortedTranslations = sortObject(translations);

        const outputPath = path.join(__dirname, '..', 'public', 'locales', 'en.json');
        fs.writeFileSync(outputPath, JSON.stringify(sortedTranslations, null, 2) + '\n');
        console.log('Successfully sorted en.json and removed unused keys.');
    } else {
        console.log('\nThis was a report-only analysis. No files were modified. Use the --write flag to apply changes.');
    }
};

main().catch(error => {
    console.error("\nAn error occurred during translation analysis:", error);
    process.exit(1);
});
