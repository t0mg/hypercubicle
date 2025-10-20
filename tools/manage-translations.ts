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

// Recursively finds all keys in a nested object for comparison.
const listKeys = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((res, el) => {
        const key = prefix ? `${prefix}.${el}` : el;
        if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...listKeys(obj[el], key)];
        }
        return [...res, key];
    }, [] as string[]);
};

// Recursively sorts an object's keys alphabetically.
const sortObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    return Object.keys(obj).sort().reduce((result: any, key: string) => {
        result[key] = sortObject(obj[key]);
        return result;
    }, {});
};

// Sorts the keys of a JSON object, but preserves the order of the top-level keys.
const sortObjectExceptFirstLevel = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const result: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = sortObject(obj[key]);
        }
    }
    return result;
};

const main = async () => {
    const shouldWrite = process.argv.includes('--write');
    console.log('Analyzing for missing translation keys...');
    
    const translations = GamedataLoader.loadJson('locales/en.json');
    const translationKeys = new Set(listKeys(translations));

    // --- Part 1: Find Missing Keys ---
    const sourceDirectories = ['./components', './game', './'];
    const filesToScan: string[] = [];
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
    
    const usedKeys = new Map<string, { path: string; line: number }[]>();
    const keyRegex = /(?<![a-zA-Z])t\(['"`]([^'"`]+)['"`]/g;

    for (const file of filesToScan) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((lineContent, index) => {
            let match;
            while ((match = keyRegex.exec(lineContent)) !== null) {
                const key = match[1];
                if (key.includes('${') || key.endsWith('.') || key.length < 2) {
                    continue;
                }
                const location = { path: file, line: index + 1 };
                const existing = usedKeys.get(key) || [];
                existing.push(location);
                usedKeys.set(key, existing);
            }
        });
    }

    const missingKeys = [...usedKeys.keys()].filter(key => !translationKeys.has(key));

    // --- Part 2: Report or Write ---
    if (shouldWrite) {
        const sortedTranslations = sortObjectExceptFirstLevel(translations);
        const outputPath = path.join(__dirname, '..', 'public', 'locales', 'en.json');
        fs.writeFileSync(outputPath, JSON.stringify(sortedTranslations, null, 2) + '\n');
        console.log('\n[SUCCESS] The en.json file has been sorted successfully.');
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

    if (!shouldWrite) {
        console.log('\nThis was a report-only analysis. Use the --write flag to sort the en.json file.');
    }
};

main().catch(error => {
    console.error("\nAn error occurred during translation analysis:", error);
    process.exit(1);
});
