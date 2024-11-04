import axios from 'axios';

async function translate(text: string, sourceLang: string = 'en', targetLang: string = 'es'): Promise<string | null> {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await axios.get(url);
        return response.data.responseData.translatedText;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

export {
    translate,
};
