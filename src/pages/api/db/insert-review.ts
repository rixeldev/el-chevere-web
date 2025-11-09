import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY

interface ReviewInsertData {
	user_id: string
	username: string
	rating: number
	title: string
	description: string
	image: string
}

export async function POST({ request }: { request: Request }) {
	try {
		// Get the authorization header
		const authHeader = request.headers.get('Authorization')

		if (!authHeader) {
			return new Response(
				JSON.stringify({ error: 'Unauthorized. Please sign in to submit a review.' }),
				{ status: 401 }
			)
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
			return new Response(
				JSON.stringify({ error: 'Unauthorized. Please sign in to submit a review.' }),
				{ status: 401 }
			)
		}

		const { rating, title, description, image } = await request.json()

		// Validate required fields
		if (!rating || !title || !description) {
			return new Response(
				JSON.stringify({ error: 'Rating, title, and description are required.' }),
				{ status: 400 }
			)
		}

		// Validate rating range
		if (rating < 1 || rating > 5) {
			return new Response(JSON.stringify({ error: 'Rating must be between 1 and 5.' }), {
				status: 400,
			})
		}

		// Validate title length
		if (title.length < 5 || title.length > 40) {
			return new Response(JSON.stringify({ error: 'Title must be between 5 and 40 characters.' }), {
				status: 400,
			})
		}

		// Use the authenticated user's email as username, or their email prefix
		const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

		// Insert review with user information and session data
		const reviewData: ReviewInsertData = {
			user_id: user.id, // Store the user ID from the authenticated session
			username,
			rating,
			title,
			description,
			image: image || '/statics/user.svg',
		}

		const { error } = await supabase.from('reviews').insert([reviewData])

		if (error) {
			console.error('Error inserting review:', error)
			return new Response(JSON.stringify({ error: error.message }), { status: 500 })
		}

		return new Response(JSON.stringify({ message: 'Review inserted successfully' }), {
			status: 200,
		})
	} catch (error: unknown) {
		console.error('Error in insert-review API:', error)
		const errorMessage = error instanceof Error ? error.message : 'Internal server error'
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
		})
	}
}
