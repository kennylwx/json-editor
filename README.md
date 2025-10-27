# JSON Editor

A powerful Next.js 16 JSON editor with AI-powered error fixing, real-time validation, and dark/light mode support.

## Features

- 🎨 **Monaco Editor** - Full-featured code editor with syntax highlighting
- ✨ **Format JSON** - One-click JSON formatting
- 🔍 **Real-time Validation** - Instant error detection and highlighting
- 🤖 **AI Error Fixing** - Hover over errors and click "Fix with AI" to automatically fix JSON issues
- 🌓 **Dark/Light Mode** - Toggle between themes
- 📊 **Error Panel** - Summary of all validation errors

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up your OpenAI API key:

Create a `.env.local` file in the root directory and add:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3030](http://localhost:3030) to view the editor.

## Usage

1. **Edit JSON**: Paste or type your JSON in the editor
2. **Format**: Click the "Format" button to beautify valid JSON
3. **Fix Errors**: Hover over error lines to see details and click "Fix with AI" to automatically fix issues
4. **Toggle Theme**: Switch between dark and light mode using the theme toggle

## Technologies

- **Next.js 16** - React framework with App Router
- **Monaco Editor** - VS Code's editor
- **Vercel AI SDK** - AI-powered error fixing
- **OpenAI** - GPT-4 for intelligent JSON fixing
- **Tailwind CSS** - Styling
- **next-themes** - Theme management

## Project Structure

```
app/
├── api/fix-json/     # AI error fixing endpoint
├── layout.tsx        # Root layout with theme provider
└── page.tsx          # Main editor page

components/
├── JSONEditor.tsx    # Monaco editor wrapper
├── ThemeToggle.tsx   # Dark/light mode toggle
├── ErrorPanel.tsx    # Error summary display
└── ThemeProvider.tsx # Theme context provider
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
