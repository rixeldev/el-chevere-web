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

		const { fullName, email, phone, avatarUrl } = await request.json()

		if (!fullName || !email) {
			return new Response(JSON.stringify({ error: 'Full name and email are required' }), {
				status: 400,
			})
		}

		// Save or update user profile in the users table
		const { error: insertError } = await supabase.from('profiles').upsert(
			{
				auth_id: user.id,
				full_name: fullName,
				email: email,
				phone: phone || null,
				avatar_url: avatarUrl || null,
			},
			{
				onConflict: 'auth_id',
			}
		)

		if (insertError) {
			console.error('Error saving user profile:', insertError)
			return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
		}

		return new Response(JSON.stringify({ message: 'User profile saved successfully' }), {
			status: 200,
		})
	} catch (error: unknown) {
		console.error('Error in save-user-profile API:', error)
		const errorMessage = error instanceof Error ? error.message : 'Internal server error'
		return new Response(JSON.stringify({ error: errorMessage }), {
			status: 500,
		})
	}
}
