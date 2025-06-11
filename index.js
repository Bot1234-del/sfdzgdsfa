// SillyManga Extension for Sillytavern

// SillyManga Extension for Sillytavern

import { comfyuiWorkflow } from './costiflux_workflow.js';
import { getContext, modules } from '../../extensions.js'; // Uncommented for Sillytavern API access

// --- Configuration ---
const COMFYUI_API_URL = 'http://localhost:8188/prompt'; // Default ComfyUI API URL
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // [TODO] Replace with your actual Gemini API Key
const GEMINI_MODEL_NAME = 'gemini-1.5-pro-preview-0506'; // Or 'gemini-1.5-pro-preview-0605' if available

// --- Global variables for the extension ---
let extensionSettings;

// --- Utility function to send messages to Sillytavern chat ---
function sendSystemMessage(message) {
    if (modules && modules.chat && modules.chat.printMessage) {
        modules.chat.printMessage(message, 'SillyManga', true); // true for system message
    } else {
        console.log(`[SillyManga System]: ${message}`);
    }
}

// --- Helper function to fetch image and convert to Base64 ---
async function imageUrlToBase64(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to Base64:', error);
        throw error;
    }
}

// --- Function to initialize the extension ---
async function onExtensionReady() {
    console.log('SillyManga extension is ready!');
    sendSystemMessage('SillyManga extension loaded. Type /manga [prompt] to generate an image.');

    // Get context and register event listener for MESSAGE_SENT
    const context = getContext();
    if (context && context.eventSource) {
        context.eventSource.on('MESSAGE_SENT', onChat);
        console.log('SillyManga: Registered onChat for MESSAGE_SENT event.');
    } else {
        console.warn('SillyManga: Could not access eventSource to register MESSAGE_SENT listener.');
        sendSystemMessage('Warning: SillyManga could not fully initialize. Chat command might not work.');
    }

    // extensionSettings = context.extensionSettings; // Uncomment if using Sillytavern settings
    // [TODO] Add UI elements if necessary, e.g., a button in the extension tab
}

// --- Function to handle chat messages ---
async function onChat(chat) {
    console.log('SillyManga received chat:', chat);

    if (chat.text.startsWith('/manga ')) {
        const userPrompt = chat.text.substring('/manga '.length).trim();
        sendSystemMessage(`Generating manga image for: "${userPrompt}"...`);

        try {
            // 1. Generate ComfyUI parameters using Gemini
            const comfyParams = await getGeminiParameters(userPrompt);
            sendSystemMessage('Gemini generated ComfyUI parameters.');

            // 2. Generate image with ComfyUI
            const imageUrl = await generateImage(comfyParams);
            sendSystemMessage(`Image generated: ${imageUrl}`);

            // 3. Edit image with Gemini (add text/bubbles)
            const editedImageHtml = await editImageWithGemini(imageUrl, userPrompt);
            sendSystemMessage('Image edited with Gemini and displayed in chat.');
            displayImageInChat(editedImageHtml);

        } catch (error) {
            console.error('SillyManga error:', error);
            sendSystemMessage(`Error generating image: ${error.message}`);
        }
        return { ...chat, text: '' }; // Consume the command, prevent it from appearing in chat
    }

    return chat; // Return the chat object to continue processing
}

// --- Function to interact with ComfyUI for image generation ---
async function generateImage(parameters) {
    console.log('Generating image with ComfyUI...');

    // Clone the workflow to modify it
    const workflow = JSON.parse(JSON.stringify(comfyuiWorkflow));

    // Update positive and negative prompts based on generated parameters
    // Assuming parameters will have 'positive_prompt' and 'negative_prompt'
    if (workflow["6"] && workflow["6"].inputs) {
        workflow["6"].inputs.text = parameters.positive_prompt || workflow["6"].inputs.text;
    }
    if (workflow["42"] && workflow["42"].inputs) {
        workflow["42"].inputs.text = parameters.negative_prompt || workflow["42"].inputs.text;
    }
    // Update other parameters in the workflow based on `parameters` object
    if (workflow["25"] && workflow["25"].inputs) { // RandomNoise seed
        workflow["25"].inputs.noise_seed = parameters.seed !== undefined ? parameters.seed : Math.floor(Math.random() * 1000000000000000);
    }
    if (workflow["27"] && workflow["27"].inputs) { // EmptySD3LatentImage width/height
        workflow["27"].inputs.width = parameters.width || workflow["27"].inputs.width;
        workflow["27"].inputs.height = parameters.height || workflow["27"].inputs.height;
    }
    if (workflow["30"] && workflow["30"].inputs) { // ModelSamplingFlux width/height
        workflow["30"].inputs.width = parameters.width || workflow["30"].inputs.width;
        workflow["30"].inputs.height = parameters["30"].inputs.height;
    }
    if (workflow["85"] && workflow["85"].inputs) { // UltimateSDUpscale seed, steps, cfg, denoise
        workflow["85"].inputs.seed = parameters.upscale_seed !== undefined ? parameters.upscale_seed : Math.floor(Math.random() * 1000000000000000);
        workflow["85"].inputs.steps = parameters.upscale_steps || workflow["85"].inputs.steps;
        workflow["85"].inputs.cfg = parameters.upscale_cfg || workflow["85"].inputs.cfg;
        workflow["85"].inputs.denoise = parameters.upscale_denoise || workflow["85"].inputs.denoise;
    }


    try {
        const response = await fetch(COMFYUI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: workflow }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ComfyUI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('ComfyUI response:', data);

        if (data.prompt_id) {
            // In a real scenario, you'd poll the /history endpoint or use websockets
            // to get the image output. For this example, we'll just return a dummy URL.
            sendSystemMessage('ComfyUI prompt submitted. Waiting for image...');
            // This is a simplification. A real implementation would need to poll
            // the /history endpoint or use websockets to get the actual image.
            // For now, we'll return a placeholder.
            return `http://localhost:8188/view?filename=ComfyUI_00001_.png&subfolder=&type=output`; // Example dummy URL
        } else {
            throw new Error('ComfyUI response did not contain a prompt_id.');
        }

    } catch (error) {
        console.error('Error communicating with ComfyUI:', error);
        throw error;
    }
}

// --- Function to interact with Gemini for parameter generation ---
async function getGeminiParameters(userPrompt) {
    console.log('Getting Gemini parameters for ComfyUI...');
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        throw new Error('Gemini API Key is not configured. Please set GEMINI_API_KEY in index.js');
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
        You are an AI assistant specialized in generating parameters for a ComfyUI image generation workflow.
        The user will provide a text prompt. Your task is to generate a JSON object containing suitable parameters for the ComfyUI workflow.
        Focus on generating a 'positive_prompt' and a 'negative_prompt'.
        Additionally, you can suggest 'width', 'height', 'seed', 'upscale_seed', 'upscale_steps', 'upscale_cfg', 'upscale_denoise' if relevant.
        Ensure character face consistency by including relevant terms in the positive prompt, such as "consistent facial features", "same character", "similar face".
        The output MUST be a valid JSON object. Do NOT include any other text or markdown outside the JSON.

        User prompt: "${userPrompt}"

        Example JSON output:
        {
            "positive_prompt": "a beautiful woman, consistent facial features, long flowing hair, highly detailed, cinematic lighting",
            "negative_prompt": "ugly, deformed, bad anatomy, blurry",
            "width": 1024,
            "height": 768,
            "seed": 123456789,
            "upscale_seed": 987654321,
            "upscale_steps": 30,
            "upscale_cfg": 7,
            "upscale_denoise": 0.3
        }
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini raw response:', data);

        // Extract the JSON string from the response and parse it
        const jsonString = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonString);

    } catch (error) {
        console.error('Error communicating with Gemini for parameters:', error);
        throw error;
    }
}

// --- Function to interact with Gemini for image editing (manga text/bubbles) ---
async function editImageWithGemini(imageUrl, chatContent) {
    console.log('Editing image with Gemini for manga text/bubbles...');
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        throw new Error('Gemini API Key is not configured. Please set GEMINI_API_KEY in index.js');
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Fetch the image and convert to base64
    const base64Image = await imageUrlToBase64(imageUrl);
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));
    const imageData = base64Image.split(',')[1];


    const prompt = `
        You are an AI assistant specialized in creating manga-style chat bubbles and text for images.
        The user will provide an image and the chat content related to it.
        Your task is to generate HTML that overlays manga-like text and chat bubbles onto the image.
        Use HTML tags for styling and positioning. The image should be displayed using an <img> tag.
        The chat bubbles should be styled to look like manga speech bubbles.
        Consider the chat content to place the text appropriately.
        Ensure the output is valid HTML.

        Chat content: "${chatContent}"

        Example HTML output (simplified):
        <div style="position: relative; display: inline-block;">
            <img src="[image_url_placeholder]" style="max-width: 100%; height: auto;">
            <div style="position: absolute; top: 10%; left: 50%; transform: translateX(-50%); background-color: white; border: 2px solid black; border-radius: 15px; padding: 10px; font-family: 'Comic Sans MS', cursive; font-size: 1.2em; text-align: center;">
                <p>Hello, world!</p>
            </div>
        </div>
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: imageData
                            }
                        }
                    ]
                }],
                generationConfig: {
                    responseMimeType: "text/html", // Request HTML output
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error for image editing: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini raw response for image editing:', data);

        // Assuming Gemini returns the HTML directly in the text part
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error communicating with Gemini for image editing:', error);
        throw error;
    }
}

// --- Function to display image in Sillytavern chat ---
function displayImageInChat(htmlContent) {
    if (modules && modules.chat && modules.chat.printMessage) {
        // Assuming printMessage can render HTML directly
        modules.chat.printMessage(htmlContent, 'SillyManga', false); // false for not a system message, allowing HTML rendering
    } else {
        console.log('Attempting to display HTML in chat (modules.chat.printMessage not available):', htmlContent);
        // Fallback for environments where modules.chat.printMessage is not available or doesn't render HTML
        sendSystemMessage('Image with manga text/bubbles generated. Please check the console for the HTML content to manually insert, or ensure Sillytavern\'s UI API is correctly integrated.');
    }
}

// --- Register the extension functions with Sillytavern ---
// Sillytavern's loader will pick up these exported functions.
export {
    onExtensionReady,
    onChat,
    // If you need to expose functions for UI elements in Sillytavern's extension tab,
    // you would export them here and define them in manifest.json's "ui" section.
};
