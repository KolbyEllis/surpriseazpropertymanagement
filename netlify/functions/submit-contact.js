function normalizeText(text) {
    return (text || "")
        .toLowerCase()
        .replace(/\u2018|\u2019/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

const blockedPhrases = [
    "i currently own several rental units across arizona and am looking for a dependable property manager who can oversee these properties effectively. as i work toward expanding my real estate portfolio, managing everything on my own has become increasingly demanding, and i'm reaching the point where i need dedicated support to ensure everything continues to run smoothly."
];

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const rawBody = event.body || "";
    const params = new URLSearchParams(rawBody);
    const message = normalizeText(params.get("Message"));
    const isBlocked = blockedPhrases.some((phrase) => message.includes(phrase));

    if (isBlocked) {
        return {
            statusCode: 422,
            body: "Your submission was rejected."
        };
    }

    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
    if (!siteUrl) {
        return {
            statusCode: 500,
            body: "Server configuration error."
        };
    }

    try {
        const response = await fetch(siteUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: rawBody
        });

        if (!response.ok) {
            return {
                statusCode: 502,
                body: "Unable to process your submission right now."
            };
        }

        return {
            statusCode: 303,
            headers: {
                Location: "/contact/?submitted=true"
            },
            body: ""
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Submission failed."
        };
    }
};
