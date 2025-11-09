import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY

export async function POST({ request }: { request: Request }) {
	try {
		// Get the authorization header
		const authHeader = request.headers.get('Authorization')

		if (!authHeader) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
		}

		// Create a Supabase client with the user's session
		const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			global: {
				headers: { Authorization: authHeader },
			},
		})

		// Verify the user is authenticated
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
		}

		// Get the form data
		const formData = await request.formData()
		const file = formData.get('avatar') as File

		if (!file) {
			return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 })
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
		if (!allowedTypes.includes(file.type)) {
			return new Response(
				JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }),
				{ status: 400 }
			)
		}

		// Validate file size (5MB max)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			return new Response(JSON.stringify({ error: 'File size must be less than 5MB' }), {
				status: 400,
			})
		}

		// Generate a unique file name
		const fileExt = file.name.split('.').pop()
		const fileName = `${user.id}-${Date.now()}.${fileExt}`

		// Upload to Supabase Storage
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('avatars')
			.upload(fileName, file, {
				contentType: file.type,
				upsert: false,
			})

		if (uploadError) {
			console.error('Error uploading file:', uploadError)
			return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 })
		}

		// Get the public URL
		const {
			data: { publicUrl },
		} = supabase.storage.from('avatars').getPublicUrl(fileName)

		return new Response(
			JSON.stringify({
				url: publicUrl,
				path: uploadData.path,
			}),
			{ status: 200 }
		)
	} catch (error: any) {
		console.error('Error in upload-avatar API:', error)
		return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
			status: 500,
		})
	}
}
