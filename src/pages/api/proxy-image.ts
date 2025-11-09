export async function GET({ request }: { request: Request }) {
	const url = new URL(request.url)
	const imageUrl = url.searchParams.get('url')

	if (!imageUrl) {
		return new Response('Missing image URL', { status: 400 })
	}

	try {
		// Validate that it's an HTTP/HTTPS URL
		const imageUrlObj = new URL(imageUrl)
		if (!['http:', 'https:'].includes(imageUrlObj.protocol)) {
			return new Response('Invalid URL protocol', { status: 400 })
		}

		// Fetch the image with timeout and proper headers
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

		try {
			const imageResponse = await fetch(imageUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					'Referer': 'https://www.google.com/',
				},
				signal: controller.signal,
				redirect: 'follow',
			})

			clearTimeout(timeoutId)

			if (!imageResponse.ok) {
				return new Response('Failed to fetch image', { status: imageResponse.status })
			}

			// Check if it's actually an image
			const contentType = imageResponse.headers.get('content-type') || ''
			if (!contentType.startsWith('image/')) {
				return new Response('Not an image', { status: 400 })
			}

			// Get the image data
			const imageData = await imageResponse.arrayBuffer()

			// Return the image with proper CORS headers and caching
			return new Response(imageData, {
				headers: {
					'Content-Type': contentType,
					'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 1 day
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET',
				},
			})
		} catch (fetchError) {
			clearTimeout(timeoutId)
			if (fetchError instanceof Error && fetchError.name === 'AbortError') {
				return new Response('Request timeout', { status: 504 })
			}
			throw fetchError
		}
	} catch (error) {
		console.error('Error proxying image:', error)
		return new Response('Error fetching image', { status: 500 })
	}
}

