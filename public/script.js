document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const saveBtn = document.getElementById('save-btn');
    const artContainer = document.getElementById('art-container');
    const placeholder = document.getElementById('placeholder');
    const sliderPola = document.getElementById('slider-pola');
    const sliderGelapTerang = document.getElementById('slider-gelap-terang');
    const sliderCoolWarm = document.getElementById('slider-cool-warm');
    const artistSelect = document.getElementById('artist-select');

    // Fungsi untuk membuat prompt berdasarkan input slider
    function createPrompt() {
        const pola = sliderPola.value;
        const gelapTerang = sliderGelapTerang.value;
        const coolWarm = sliderCoolWarm.value;
        const artist = artistSelect.value;
        
        let polaText = '';
        if (pola == 1) polaText = 'simple random pattern';
        else if (pola == 2) polaText = 'low complexity random pattern';
        else if (pola == 3) polaText = 'medium complexity random pattern';
        else if (pola == 4) polaText = 'high complexity random pattern';
        else if (pola == 5) polaText = 'extremely detailed random pattern';

        let gelapTerangText = '';
        if (gelapTerang == 1) gelapTerangText = 'dominant bright colors';
        else if (gelapTerang == 2) gelapTerangText = 'mostly bright colors';
        else if (gelapTerang == 3) gelapTerangText = 'balanced light and dark tones';
        else if (gelapTerang == 4) gelapTerangText = 'mostly dark colors';
        else if (gelapTerang == 5) gelapTerangText = 'dominant dark colors';

        let coolWarmText = '';
        if (coolWarm == 1) coolWarmText = 'predominantly cool colors';
        else if (coolWarm == 2) coolWarmText = 'mostly cool colors';
        else if (coolWarm == 3) coolWarmText = 'balanced cool and warm colors';
        else if (coolWarm == 4) coolWarmText = 'mostly warm colors';
        else if (coolWarm == 5) coolWarmText = 'predominantly warm colors';

        return `Generate an abstract painting in the style of ${artist}. The art should have a ${polaText}. It should feature ${gelapTerangText} and use a ${coolWarmText}. Make it a 9:16 aspect ratio painting.`;
    }

    generateBtn.addEventListener('click', async () => {
        const prompt = createPrompt();

        // Tampilkan loading state
        artContainer.innerHTML = '';
        artContainer.classList.add('loading');
        saveBtn.style.display = 'none';

        try {
            const response = await fetch('/.netlify/functions/generate-art', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error');
            }

            const data = await response.json();
            const imageUrl = data.imageUrl; // Gemini Flash API akan mengembalikan URL gambar

            const imgElement = document.createElement('img');
            imgElement.id = 'art-image';
            imgElement.src = imageUrl;
            imgElement.alt = 'Generated Art';

            artContainer.innerHTML = '';
            artContainer.appendChild(imgElement);
            saveBtn.style.display = 'block';

        } catch (error) {
            console.error('Error generating art:', error);
            artContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        } finally {
            artContainer.classList.remove('loading');
        }
    });

    deleteBtn.addEventListener('click', () => {
        artContainer.innerHTML = '<p id="placeholder">Tekan "Generate" untuk membuat karya seni.</p>';
        saveBtn.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => {
        const imgElement = document.getElementById('art-image');
        if (imgElement) {
            const link = document.createElement('a');
            link.href = imgElement.src;
            link.download = 'generative_art.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});