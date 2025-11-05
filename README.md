
# Content to Email Generator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTeja-s-au6%2FContent-to-Email-Generator)

An AI-powered application that transforms your notes, articles, or any content into a polished, ready-to-send email. Select the desired tone, edit the result, and let Gemini craft the perfect message for you.

## Features

- **AI-Powered Generation**: Uses the Google Gemini API to intelligently convert raw text into a structured email.
- **Tone Selection**: Choose from multiple tones (e.g., Professional, Casual, Formal) to match your audience.
- **Fully Editable Output**: Modify the AI-generated subject and body directly in the app before sending.
- **Auto-Populate Recipient**: Automatically detects `To:` in your source text to fill the recipient field.
- **One-Click Actions**:
    - **Send**: Opens your default email client with the 'To', 'CC', 'Subject', and 'Body' fields pre-filled.
    - **Copy**: Copies the entire email to your clipboard.
    - **Share**: Uses the native Web Share API on supported devices.
- **Bilingual Support**: Translate the generated email to and from Telugu with a single click.
- **Responsive Design**: Modern UI built with Tailwind CSS that works seamlessly on all devices.

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later recommended)
- A package manager like `npm` or `yarn`
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/content-to-email-generator.git
    cd content-to-email-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a new file named `.env` in the root of your project.
    - Add your Gemini API key to this file:
      ```
      VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
      ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will now be running at `http://localhost:5173`.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository** (e.g., on GitHub).
2.  **Import the repository** into Vercel. Vercel will automatically detect the Vite configuration.
3.  **Add the Environment Variable**:
    - In your Vercel project settings, navigate to the "Environment Variables" section.
    - Add your Gemini API key with the name `import.meta.env.VITE_GEMINI_API_KEY`.
4.  **Deploy!** Vercel will build and deploy your application.

---
Developed by Teja
