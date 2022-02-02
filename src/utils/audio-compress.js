import axios from 'axios';

const AWS_API_BASE_URL = 'ADD_YOUR_END_POINT_HERE/dev';
const AWS_WEBSOCKET_URL = 'wss:ADD_YOUR_END_POINT_HERE/dev'

export async function getPresignedUrls(fileType) {
    const { data: presignedPostUrl } = await axios.get(
        `${AWS_API_BASE_URL}/presigned-url?fileType=${fileType}`,
    );

    return presignedPostUrl;
}



export const callCompression = (filePath, getUrl) => {
    return new Promise(resolve => {

        const socket = new WebSocket(AWS_WEBSOCKET_URL);

        socket.onopen = function (e) {
            console.log("[open] Connection established");
            console.log("Sending to server");
            const payload = `{"action":"audio-compression","data":{"filename":"${filePath}"}}`;
            console.log(payload)
            socket.send(payload);
        }

        socket.onmessage = async (event) => {
            console.log(`[message] Data received from server: ${event.data}`);
            if (event.data === "COMPLETE") {
                console.log("Downloading compressed");
                console.log(getUrl)
                const response = await axios({
                    url: getUrl,
                    method: 'GET',
                    responseType: 'blob',
                });
                resolve(response)
            }
        }
        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            }
            else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.log('[close] Connection died');
            }
        };
        socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
        };


    })
}


export async function uploadToS3(fileType, fileContents, presignedPostUrl) {

    console.log(fileType)
    const formData = new FormData();
    formData.append('Content-Type', fileType);
    console.log('ppu', presignedPostUrl)
    Object.entries(presignedPostUrl.fields).forEach(([k, v]) => {
        formData.append(k, v);
    });
    formData.append('file', fileContents); // The file has be the last element

    const response = await axios.post(presignedPostUrl.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(response);

    return presignedPostUrl.filePath;
}
