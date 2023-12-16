/**
 * Convert emoji text to HTML codes
 * @param {String} text
 * @returns {String}
 */
function convertEmojisToHTML(text) {
    const emojiMap = {
        ":)": "&#128578;", // Smiling face with smiling eyes
        ":-)": "&#128578;", // Smiling face with smiling eyes
        ":D": "&#128512;", // Grinning face
        ":-D": "&#128512;", // Grinning face
        ":(": "&#128577;", // Frowning face
        ":-(": "&#128577;", // Frowning face
        ";)": "&#128521;", // Winking face
        ";-)": "&#128521;", // Winking face
        "<3": "&#10084;", // Heart
        ":O": "&#128558;", // Face with open mouth
        ":-O": "&#128558;", // Face with open mouth
        ":P": "&#128539;", // Face with stuck-out tongue
        ":-P": "&#128539;", // Face with stuck-out tongue
        ":*": "&#128536;", // Kissing face
        ":-*": "&#128536;", // Kissing face
        ":|": "&#128528;", // Neutral face
        ":-|": "&#128528;", // Neutral face
        ":]": "&#128516;", // Slightly smiling face
        ":-]": "&#128516;", // Slightly smiling face
        ":}": "&#128516;", // Slightly smiling face
        ":-}": "&#128516;", // Slightly smiling face
        ":/": "&#128533;", // Confused face
        ":-/": "&#128533;", // Confused face
        ":\\": "&#128533;", // Confused face
        ":-\\": "&#128533;", // Confused face
        ":D": "&#128515;", // Smiling face with open mouth and rosy cheeks
        ":-D": "&#128515;", // Smiling face with open mouth and rosy cheeks
        ":>": "&#128523;", // Smiling face with sunglasses
        ":-&gt;": "&#128523;", // Smiling face with sunglasses
        ":o)": "&#129303;", // Clown face
        ":-o)": "&#129303;", // Clown face
        ":'(": "&#128546;", // Crying face
        ":'-(": "&#128546;", // Crying face
        XD: "&#128518;", // Face with stuck-out tongue and tightly-closed eyes
        "X-D": "&#128518;", // Face with stuck-out tongue and tightly-closed eyes
        ">:(": "&#128545;", // Angry face
        ">:-(": "&#128545;", // Angry face
        ":X": "&#128556;", // Face with finger covering closed lips
        ":-X": "&#128556;", // Face with finger covering closed lips
        ":\\": "&#128533;", // Confused face
        ":-\\": "&#128533;", // Confused face
        ":*": "&#10024;", // Star
        ":-*": "&#10024;", // Star
        "(Y)": "&#129303;", // Thumbs-up (Facebook)
        // Add more mappings if needed
    };

    // Use regular expression to replace text-based emoticons with HTML entities
    const regexPattern = new RegExp(
        Object.keys(emojiMap).map(escapeRegExp).join("|"),
        "g"
    );
    return text.replace(regexPattern, (match) => emojiMap[match]);
}
/**
 * Helper to escape regex used for emoji detection in above function
 * @param {String} string
 * @returns
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default { convertEmojisToHTML };
