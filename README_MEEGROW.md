# SEOMachine Integration for Meegrowlabs

This directory contains the [SEOMachine](https://github.com/TheCraigHewitt/seomachine) tool, integrated and ready for configuration.

## Prerequisites

1.  **Claude Code**: You need to have `claude-code` installed.
    *   Install it via npm: `npm install -g @anthropic-ai/claude-code`
    *   Or follow instructions at [Claude Code Documentation](https://docs.claude.com/claude-code).

## Setup

I have already created a virtual environment and installed the necessary Python dependencies for you.

To start using SEOMachine:

1.  **Activate the Environment**:
    Open your terminal in this directory (`/Users/prakhar/Desktop/Meegrow/Meegrowlabs Website`) and run:
    ```bash
    source seomachine/.venv/bin/activate
    ```

2.  **Configure Environment Variables**:
    I have created a configuration file at `seomachine/data_sources/config/.env`.
    You need to edit this file to add your API keys (Google Analytics, Search Console, DataForSEO).
    ```bash
    nano seomachine/data_sources/config/.env
    ```
    *Refer to `seomachine/data-sources-setup.md` for detailed instructions on getting these keys.*

3.  **Configure Context**:
    Before generating content, you **must** configure the context files to match Meegrowlabs' brand.
    Navigate to `seomachine/context/` and edit the following files:
    *   `brand-voice.md`: Define your brand voice.
    *   `features.md`: List your product features.
    *   `writing-examples.md`: Add examples of your best content.
    *   `target-keywords.md`: Add your keywords.

    *Tip: These files are currently templates. Open them and fill in the bracketed sections (e.g., `[YOUR COMPANY]`).*

## Usage with Google Antigravity

I have ported the SEOMachine commands to **Antigravity Workflows**. You can now use natural language to interact with the system.

### Available Workflows

1.  **Research a Topic**
    *   *Command*: "Research the topic 'Your Topic Name'"
    *   *What it does*: Performs keyword research, analyzes competitors, and creates a research brief in `seomachine/research/`.

2.  **Write an Article**
    *   *Command*: "Write an article about 'Your Topic Name'"
    *   *What it does*: Reads the research brief (if available), follows your brand voice, and creates a full draft in `seomachine/drafts/`.

3.  **Optimize an Article**
    *   *Command*: "Optimize the article at seomachine/drafts/your-draft.md"
    *   *What it does*: Audits the content for SEO best practices and generates an optimization report.

### Example Interaction

> **You**: "Research the topic 'AI in Marketing'"
>
> **Me**: *I will run the research workflow, check your keywords, analyze competitors, and produce a brief.*
>
> **You**: "Great, now write the article."
>
> **Me**: *I will take that brief and write a full 2000+ word article following your brand voice.*

## Configuration

Don't forget to still configure your context files in `seomachine/context/`! The quality of the output depends heavily on `brand-voice.md` and `writing-examples.md`.
