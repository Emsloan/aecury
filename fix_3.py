// quartz/build.ts

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function expandArticle(articlePath: string) {
  const articleContent = await readFile(articlePath, 'utf-8');

  // Check if the article is a stub
  if (articleContent.includes('Kaiser Historia\'s article is a stub')) {
    const expandedContent = `
# Kaiser Historia

## Background/Origin Story
Kaiser Historia was born in the year 1450 in the small village of Historia. His parents were simple farmers, but young Kaiser showed an early aptitude for history and leadership. He spent his childhood reading ancient texts and dreaming of one day becoming a great ruler.

## Role in the Kingdom of Historia
Kaiser Historia ascended to the throne in 1470, at the age of 20. He quickly proved to be a capable and visionary leader, implementing numerous reforms to strengthen the kingdom. His policies focused on education, infrastructure, and economic growth, which helped Historia become a prosperous and influential nation.

## Connection to Abraham Gorkole (mentor)
Kaiser Historia's mentor was Abraham Gorkole, a renowned historian and statesman. Gorkole recognized Kaiser's potential early on and took him under his wing, teaching him the intricacies of governance and the importance of historical knowledge. Gorkole's guidance was instrumental in shaping Kaiser's leadership style and policies.

## Key Events/Accomplishments
- **1470**: Ascended to the throne of Historia at the age of 20.
- **1475**: Implemented the "Historia Education Act," which established a national education system.
- **1480**: Founded the "Historia Museum," a repository for ancient artifacts and historical documents.
- **1485**: Signed the "Historia-Alliance Treaty," strengthening ties with neighboring kingdoms.
- **1490**: Completed the construction of the "Historia Grand Library," a symbol of the kingdom's cultural and intellectual achievements.
`;

    await writeFile(articlePath, expandedContent, 'utf-8');
    console.log(`Expanded article at ${articlePath}`);
  } else {
    console.log(`Article at ${articlePath} is not a stub.`);
  }
}

// Example usage
const articlePath = join(__dirname, 'articles', 'Kaiser_Historia.md');
expandArticle(articlePath);