import { Command } from 'commander';
import Perplexity from '@perplexity-ai/perplexity_ai';

const program = new Command();

function isRunningInteractively(): boolean {
  return !!(process.stdin.isTTY && process.stdout.isTTY);
}

const defaultStream = isRunningInteractively();

program
  .name('oracle')
  .description('AI-powered research CLI using Perplexity')
  .version('1.1.0')
  .argument('<query>', 'The research query')
  .option('-d, --deep', 'Use deep agentic research (pro-search)', false)
  .option('-m, --model <model>', 'Specify the model to use', 'sonar')
  .option('-s, --stream', 'Stream the response in real-time', defaultStream)
  .option('--no-stream', 'Disable streaming')
  .action(async (query, options) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('Error: PERPLEXITY_API_KEY environment variable is not set.');
      console.error('Please set it using: export PERPLEXITY_API_KEY="your_api_key_here"');
      process.exit(1);
    }

    const client = new Perplexity({ apiKey });

    try {
      const model = options.deep ? 'sonar-deep-research' : options.model;
      
      const researchOptions = {
        model: model,
        stream: options.stream,
      };

      await handleChatCompletion(client, query, researchOptions);
    } catch (error) {
      console.error('\nError:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

interface ResearchOptions {
  model: string;
  stream: boolean;
}

async function handleChatCompletion(client: Perplexity, query: string, options: ResearchOptions) {
  if (options.stream) {
    const stream = await client.chat.completions.create({
      model: options.model,
      messages: [{ role: 'user', content: query }],
      stream: true,
    });

    let citations: string[] = [];

    for await (const chunk of stream) {
      const deltaContent = chunk.choices[0]?.delta?.content || '';
      let content = '';
      
      if (typeof deltaContent === 'string') {
        content = deltaContent;
      } else if (Array.isArray(deltaContent)) {
        content = deltaContent
          .map((c) => ('text' in c ? c.text : ''))
          .join('');
      }
      
      // Filter out <think> tags and their content
      const filteredContent = filterThinkTags(content);
      process.stdout.write(filteredContent);
      
      const chunkWithCitations = chunk as { citations?: string[] };
      if (chunkWithCitations.citations) {
        citations = chunkWithCitations.citations;
      }
    }

    if (citations.length > 0) {
      printSources(citations);
    } else {
      process.stdout.write('\n');
    }
  } else {
    const response = await client.chat.completions.create({
      model: options.model,
      messages: [{ role: 'user', content: query }],
    });

    const content = response.choices[0]?.message?.content;
    const citations = (response as { citations?: string[] }).citations || [];

    if (content) {
      if (typeof content === 'string') {
        const filteredContent = filterThinkTags(content);
        process.stdout.write(`${filteredContent}\n`);
      } else if (Array.isArray(content)) {
        const text = content
          .map((c) => ('text' in c ? c.text : ''))
          .join('');
        const filteredContent = filterThinkTags(text);
        process.stdout.write(`${filteredContent}\n`);
      }
      printSources(citations);
    }
  }
}

function filterThinkTags(content: string): string {
  // Remove <think> tags and their content using regex
  // This pattern matches <think>...</think> blocks and removes them
  return content.replace(/<think>.*?<\/think>/gs, '');
}

function printSources(citations: string[]) {
  if (citations && citations.length > 0) {
    process.stdout.write('\n\n### Sources\n');
    citations.forEach((url, index) => {
      process.stdout.write(`${index + 1}. ${url}\n`);
    });
  } else {
    process.stdout.write('\n');
  }
}

program.parse();
