/**
 * Converts a base64 string and mimetype into a File object
 * @param base64 - The base64 string
 * @param filename - The desired filename
 * @param mimetype - The MIME type of the file
 * @returns {File} - A File object
 */
export function base64ToFile(base64: string, filename: string, mimetype: string): File {
    // Decode base64 to binary
    const binaryString = atob(base64);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a File object
    return new File([bytes], filename, {type: mimetype});
}