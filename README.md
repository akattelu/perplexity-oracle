# Oracle

Oracle is a powerful command-line interface (CLI) for conducting AI-powered research using the Perplexity API. It provides instant answers with citations, supporting both standard and deep research modes.

## Features

- **Instant Answers**: Get direct answers to your queries powered by Perplexity's models.
- **Streaming Support**: Real-time output streaming (default in interactive mode).
- **Deep Research**: specific support for "deep agentic research" (pro-search) via the `--deep` flag.
- **Model Selection**: Choose specific models (e.g., `sonar`, `sonar-pro`) using the `--model` flag.
- **Clean Output**: Automatically filters out internal `<think>` tags for a cleaner reading experience.
- **Citations**: Always provides sources/citations for the information retrieved.

## Prerequisites

- [Bun](https://bun.sh/) runtime installed.
- A valid [Perplexity API Key](https://docs.perplexity.ai/).

## Installation

1.  Clone the repository:
    ```bash
    git clone git@github.com:akattelu/perplexity-oracle.git
    cd oracle
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

3.  Build the binary (optional):
    ```bash
    bun run build
    ```
    This will create a standalone executable named `oracle`.

## Configuration

You must set your Perplexity API key as an environment variable before using the tool.

```bash
export PERPLEXITY_API_KEY="pplx-xxxxxxxxxxxxxxxxxxxxxxxx"
```

You can add this to your shell's configuration file (e.g., `.bashrc`, `.zshrc`) to make it permanent.

## Usage

### Running the Binary

Build the binary using `bun run build`, then:

```bash
./oracle "What is the capital of France?"
```

### Options

```
Usage: oracle [options] <query>

AI-powered research CLI using Perplexity

Arguments:
  query                  The research query

Options:
  -V, --version          output the version number
  -d, --deep             Use deep agentic research (pro-search)
  -m, --model <model>    Specify the model to use (default: "sonar")
  -s, --stream           Stream the response in real-time
  --no-stream            Disable streaming
  -h, --help             display help for command
```

### Examples

**Basic Query:**
```bash
./oracle "Explain quantum entanglement"
```

**Deep Research (Pro Search):**
Uses the `sonar-deep-research` model for more in-depth analysis.
```bash
./oracle --deep "Analyze the economic impact of AI in healthcare over the next decade"
```

**Specify a Model:**
```bash
./oracle --model sonar-pro "Latest developments in fusion energy"
```

**Disable Streaming:**
```bash
./oracle --no-stream "List the planets in the solar system"
```

## Development

-   **Run locally:** `bun run src/index.ts ...`
-   **Typecheck:** `bun run check`
-   **Test:** `bun test`
-   **Build:** `bun run build`
