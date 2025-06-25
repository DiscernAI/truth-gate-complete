
async function reflect() {
    const input = document.getElementById('userInput').value;
    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = "Reflecting...";

    try {
        const response = await fetch('/api/reflect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });
        const data = await response.json();
        responseDiv.innerHTML = data.response || "No reflection returned.";
    } catch (error) {
        responseDiv.innerHTML = "Error: " + error.message;
    }
}
