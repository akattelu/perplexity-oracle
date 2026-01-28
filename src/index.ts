import Perplexity from '@perplexity-ai/perplexity_ai';

async function main() {
  const query = process.argv.slice(2).join(' ');

  if (!query) {
    console.error('Usage: oracle "<query>"');
    process.exit(1);
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error('Error: PERPLEXITY_API_KEY environment variable is not set.');
    console.error('Please set it using: export PERPLEXITY_API_KEY="your_api_key_here"');
    process.exit(1);
  }

  const client = new Perplexity({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const citations = (response as { citations?: string[] }).citations || [];

    if (content) {
      process.stdout.write(`${content}\n`);
      
      if (citations.length > 0) {
        process.stdout.write('\n### Sources\n');
        citations.forEach((url: string, index: number) => {
          process.stdout.write(`${index + 1}. ${url}\n`);
        });
      }
    } else {
      console.error('No response received from Perplexity.');
    }
  } catch (error) {
    console.error('Error fetching from Perplexity:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
