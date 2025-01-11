/**
 * Error class for HTTP requests
 */
class HTTPRequestError extends Error {
    /**
     * @param {string} url
     * @param {string} status
     * @param {string} statusText
     */
    constructor (url, status, statusText) {
        super(`${url} returned ${status} ${statusText}`);
        this.name = "HTTPRequestError";
        this.url = url;
        this.status = status;
        this.statusText = statusText;
    }
}

/**
 * Creates a promise that downloads a file with the given URL or gets
 * the data from input file. The given callback is called whenever
 * the download makes progress.
 *
 * @param {string|object} fileInfo A File object or a file path to download
 * @return {Promise<Uint8Array>} A promise that resolves with the file's content
 */
function readFile (fileInfo) {
    return new Promise(async (resolve, reject) => {
        if (fileInfo instanceof File) {
            readFileFromObject(fileInfo).then((data) => {
                resolve(data);
            }).catch((reason) => {
                reject(reason);
            });
        } else if (typeof fileInfo == "string") {
            const name = fileInfo.split("/").pop();
            readFileFromUrl(name).then((data) => {
                resolve(data);
            }).catch((reason) => {
                reject(reason);
            });
        } else {
            reject(new Error("Invalid file"));
        }
    });
}

/**
 * Creates a promise that downloads a file with the given URL. The given
 * callback is called whenever the download makes progress.
 *
 * @param {string} fileUrl
 * @return {Promise<Uint8Array>} A promise that resolves with the file's content
 */
function readFileFromUrl (fileUrl) {
    return new Promise(async (resolve, reject) => {
        console.debug(`Loading ${fileUrl}`);
        fetch(fileUrl, {cache: "no-cache"}).then(async (response) => {
            if (false === response.ok) {
                throw new HTTPRequestError(fileUrl, response.status, response.statusText);
            }
            const reader = response.body.getReader();
            const totalBytes = +response.headers.get("Content-Length");

            let receivedBytes = 0;
            const chunks = [];
            while (true) {
                const {done, value} = await reader.read();
                if (done) {
                    break;
                }
                chunks.push(value);
                receivedBytes += value.length;
                console.debug(`Received ${receivedBytes}B of ${totalBytes}B`);
            }

            const concatenatedChunks = new Uint8Array(receivedBytes);
            let pos = 0;
            for (const chunk of chunks) {
                concatenatedChunks.set(chunk, pos);
                pos += chunk.length;
            }
            resolve(concatenatedChunks);
        }).catch((reason) => {
            reject(reason);
        });
    });
}

/**
 * Reads a file object using FileReader, resolves with the data from the file.
 *
 * @param {File} file File object to read data from.
 * @return {Promise<Uint8Array>} A promise that resolves with the file's content
 */
function readFileFromObject (file) {
    return new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(new Uint8Array(event.target.result));
        };
        // TODO Revisit errors when trying to read the file.
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsArrayBuffer(file);
    });
}

export {readFile};
