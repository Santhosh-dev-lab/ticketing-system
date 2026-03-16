const GEMINI_API_KEY = "AIzaSyBF0GCukOKZ-kd3XHXUJ6Axa3YbmUWo4pM";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        console.log("Status:", response.status);
        if (data.models) {
            console.log("Models:", data.models.map(m => m.name).join(", "));
        } else {
            console.log("Response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

listModels();
