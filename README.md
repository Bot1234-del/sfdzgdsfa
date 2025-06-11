# SillyManga Extension for Sillytavern

SillyManga is a Sillytavern extension that integrates with ComfyUI for image generation and Google Gemini for intelligent parameter generation and manga-style image editing.

## Features

*   **Image Generation**: Uses your local ComfyUI instance with the `costiflux.json` workflow to generate images based on prompts.
*   **Intelligent Parameter Generation**: Leverages Gemini 1.5 Pro Preview 06-05 to generate optimal ComfyUI parameters (positive/negative prompts, dimensions, seeds, etc.) from your natural language input.
*   **Manga-style Image Editing**: Sends generated images to Gemini for adding manga-like text and chat bubbles using HTML overlays, outputting directly into the Sillytavern chat.
*   **Character Face Consistency**: Gemini's prompt generation is designed to encourage consistent character facial features in generated images.

## Prerequisites

Before installing and using SillyManga, ensure you have the following set up:

1.  **Sillytavern**: A running instance of Sillytavern.
2.  **ComfyUI**: A running ComfyUI server, accessible from where Sillytavern is running (e.g., `http://localhost:8188`).
    *   Ensure you have all necessary models and custom nodes for the `costiflux.json` workflow installed in your ComfyUI setup.
3.  **Google Gemini API Key**: Obtain an API key for Google Gemini (specifically, access to `gemini-1.5-pro-preview-0605` or `gemini-1.5-pro-preview-0506`). You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Installation

1.  **Place the Extension Files**:
    *   Create a directory named `SillyManga` inside your Sillytavern extensions folder (e.g., `SillyTavern/public/scripts/extensions/SillyManga`).
    *   Place `manifest.json`, `index.js`, and `costiflux_workflow.js` into this `SillyManga` directory.
    *   Ensure the `costiflux.json` file (the original ComfyUI workflow) is also accessible to your ComfyUI server. The extension uses `costiflux_workflow.js` which is a JavaScript representation of `costiflux.json`.

2.  **Configure API Keys**:
    *   Open `SillyManga/index.js`.
    *   Locate the line `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';`
    *   Replace `'YOUR_GEMINI_API_KEY'` with your actual Google Gemini API key.

3.  **GitHub Repository (for easy installation in Sillytavern)**:
    *   Create a new public GitHub repository (e.g., `SillyManga`).
    *   Upload the `SillyManga` directory (containing `manifest.json`, `index.js`, `costiflux_workflow.js`, and this `README.md`) to the root of your GitHub repository.
    *   **Important**: Update the `repository` field in `SillyManga/manifest.json` to point to your actual GitHub repository URL (e.g., `"repository": "https://github.com/YourUsername/SillyManga"`).

4.  **Install in Sillytavern**:
    *   Start Sillytavern.
    *   Navigate to the "Extensions" tab.
    *   Click the "Install Extension" button.
    *   Paste the URL of your GitHub repository (e.g., `https://github.com/YourUsername/SillyManga`) into the input field and click "Install".
    *   The SillyManga extension should now appear in your Extensions list. Enable it if it's not already.

## Usage

Once installed and enabled:

1.  Ensure your ComfyUI server is running.
2.  In the Sillytavern chat, type `/manga ` followed by your desired image prompt.
    *   Example: `/manga a futuristic city at sunset with flying cars`
3.  The extension will:
    *   Send your prompt to Gemini to generate ComfyUI parameters.
    *   Send the parameters and the `costiflux.json` workflow to your ComfyUI server to generate an image.
    *   Fetch the generated image.
    *   Send the image and your original prompt to Gemini to add manga-style text and chat bubbles.
    *   Display the final HTML-edited image directly in the chat.

## Troubleshooting

*   **"Gemini API Key is not configured"**: Ensure you have replaced `YOUR_GEMINI_API_KEY` in `index.js` with a valid key.
*   **"ComfyUI API error"**: Check if your ComfyUI server is running and accessible at `http://localhost:8188`. Also, verify your ComfyUI setup has all necessary models and custom nodes for the `costiflux.json` workflow.
*   **Image not appearing in chat**: Check the browser's developer console for errors. Ensure `modules.chat.printMessage` is correctly handling HTML content in your Sillytavern version. If not, manual DOM manipulation might be required (advanced).
*   **Character consistency issues**: Refine your prompts to Gemini, explicitly asking for consistent character features. The Gemini model's capabilities and the ComfyUI models used will also play a significant role.

---
*This extension is a demonstration and may require further refinement for production use.*
