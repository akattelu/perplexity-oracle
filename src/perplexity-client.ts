import Perplexity from '@perplexity-ai/perplexity_ai';

export interface ResearchOptions {
  model: string;
  stream: boolean;
}

export class PerplexityClient {
  private client: Perplexity;

  constructor(apiKey: string) {
    this.client = new Perplexity({ apiKey: apiKey.trim() });
  }

  /**
   * Creates a chat completion request to Perplexity API.
   * Returns a stream or a single response based on options.stream.
   */
  createCompletion(query: string, options: ResearchOptions) {
    const requestOptions: any = {
      model: options.model,
      messages: [{ role: 'user', content: query }],
    };

    if (options.stream) {
      requestOptions.stream = true;
    }

    return this.client.chat.completions.create(requestOptions);
  }
}
