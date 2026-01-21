import fetch from "node-fetch";

export const getTTS = async (req, res) => {
    const API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
    const teacher = req.query.teacher || "Nanami";
    const text = req.query.text
        .replace(/[-+]/g, ',')
        .replace(/\s+/g, ' ')
        .trim();
    
    const language = req.query.language || "English";

    let languageCode, voice;

    if (language.toLowerCase() === "hindi" || language.toLowerCase() === "english-hindi") {
        languageCode = "hi-IN";
        voice = teacher === "Nanami" ? "hi-IN-Neural2-A" : "hi-IN-Neural2-B";
    } else {
        languageCode = "en-IN";
        voice = teacher === "Nanami" ? "en-IN-Neural2-A" : "en-IN-Neural2-B";
    }

    const ttsRequest = {
        input: { text },
        voice: { languageCode, name: voice },
        audioConfig: {
            audioEncoding: "MP3"
        },
    };

    console.log(`TTS Request: voice=${voice}, lang=${languageCode}, textLength=${text.length}`);

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ttsRequest),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Google TTS API Error: ${response.status} ${response.statusText} - ${errorText}`);
            throw new Error(`TTS API failed: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        const audioBuffer = Buffer.from(jsonResponse.audioContent, 'base64');

        // Hardcoded visemes for now as in the original project
        const visemes = [
            [140, 21], [350, 5], [490, 21], [630, 0], [980, 21], [1050, 7], [1110, 21],
            [1180, 5], [1250, 21], [1460, 18], [1530, 21], [1600, 1], [1680, 21],
            [1770, 5], [1980, 19], [2050, 21], [2330, 5], [2500, 21], [2640, 0],
            [3190, 5], [3240, 21], [3420, 5], [3560, 8], [3770, 21], [3840, 1],
            [3920, 21], [3980, 5], [4110, 21], [4180, 5], [4250, 21], [4600, 5],
            [4670, 21], [4740, 0], [5160, 6], [5210, 21], [5320, 1], [5400, 5],
            [5440, 21], [5620, 1], [5710, 21], [5780, 5], [5840, 21], [6120, 5],
            [6260, 21], [6330, 5], [6470, 0], [6520, 0], [7009, 21], [7133, 14],
            [7321, 19], [7473, 5], [8992, 10], [10213, 3], [11060, 20], [11418, 0],
            [11910, 10], [12605, 1], [13621, 3], [14775, 20], [15744, 4], [16865, 4],
            [18045, 12], [18625, 18], [19721, 11], [20421, 21], [20959, 12], [21900, 7],
            [23241, 0], [24495, 8], [25730, 8], [27225, 20], [28921, 2], [30360, 13],
            [31944, 16], [33192, 21], [34737, 1], [35908, 5], [37256, 14], [38625, 18],
            [40130, 14], [41418, 8], [42999, 2], [44450, 9], [45576, 17], [46922, 16],
            [48259, 0], [49523, 16], [51084, 5], [52531, 15], [53856, 11], [55384, 19],
            [56792, 21], [58292, 19], [59856, 11]
        ];

        res.set({
            "Content-Type": "audio/mpeg",
            "Visemes": Buffer.from(JSON.stringify(visemes)).toString("base64"),
        });
        res.send(audioBuffer);

    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: error.message });
    }
};
