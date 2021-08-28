export const longestWordCount = (text: string) => {
	const strSplit = text.split(' ')
	let longestWord = 0
	for (let i = 0; i < strSplit.length; i++) {
		if (strSplit[i].length > longestWord) {
			longestWord = strSplit[i].length
		}
	}
	return longestWord
}

export const resumeMediaPlay = async (audioContext: AudioContext) => {
	try {
		await audioContext.resume()
	} catch (e) {
		console.log(e)
	}
}

export const getMediaStreamByDeviceId = async (deviceId: string) => {
	try {
		return await navigator.mediaDevices.getUserMedia({
			audio: {
				advanced: [
					{
						deviceId,
					},
				],
			},
			video: false,
		})
	} catch (err) {
		console.log(err)
		return null
	}
}
