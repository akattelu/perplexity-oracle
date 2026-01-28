export class StreamThinkFilter {
  private state: 'IDLE' | 'MATCHING_OPEN' | 'IN_THINK' | 'MATCHING_CLOSE' = 'IDLE';
  private buffer = '';
  private readonly OPEN_TAG = '<think>';
  private readonly CLOSE_TAG = '</think>';

  process(chunk: string): string {
    let output = '';
    for (const char of chunk) {
      output += this.processChar(char);
    }
    return output;
  }

  private processChar(char: string): string {
    if (this.state === 'IDLE') {
      if (char === this.OPEN_TAG[0]) {
        this.state = 'MATCHING_OPEN';
        this.buffer = char;
        return '';
      }
      return char;
    }

    if (this.state === 'MATCHING_OPEN') {
      this.buffer += char;
      if (this.OPEN_TAG.startsWith(this.buffer)) {
        if (this.buffer === this.OPEN_TAG) {
          this.state = 'IN_THINK';
          this.buffer = '';
        }
        return '';
      } else {
        // Mismatch, flush buffer
        const pending = this.buffer;
        this.buffer = '';
        this.state = 'IDLE';
        // Ideally we should re-process pending chars, but for simplicity we return them.
        // Note: this assumes we won't have nested partial matches like "<<think>" where the second < starts a real tag.
        // Given the specific tag <think>, this simple flush is mostly fine.
        return pending; 
      }
    }

    if (this.state === 'IN_THINK') {
       if (char === this.CLOSE_TAG[0]) {
         this.state = 'MATCHING_CLOSE';
         this.buffer = char;
       }
       return '';
    }

    if (this.state === 'MATCHING_CLOSE') {
      this.buffer += char;
      if (this.CLOSE_TAG.startsWith(this.buffer)) {
        if (this.buffer === this.CLOSE_TAG) {
          this.state = 'IDLE';
          this.buffer = '';
        }
        return '';
      } else {
         // Mismatch, this was content.
         this.buffer = '';
         this.state = 'IN_THINK';
         // Check if this char starts a new close tag
         if (char === this.CLOSE_TAG[0]) {
             this.state = 'MATCHING_CLOSE';
             this.buffer = char;
         }
         return '';
      }
    }
    return '';
  }

  flush(): string {
      if (this.state === 'MATCHING_OPEN') {
          const b = this.buffer;
          this.buffer = '';
          this.state = 'IDLE';
          return b;
      }
      return '';
  }
}

export function filterThinkTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/g, '');
}
