import { supabase } from '@/db/supabase'

interface RequestBody {
	limit?: number
	offset?: number
}

export async function POST({ request }: { request: Request }) {
	const { limit, offset = 0 }: RequestBody = await request.json()

	// Get total count separately
	const { count } = await supabase
		.from('reviews')
		.select('*', { count: 'exact', head: true })

	let query = supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false })

	if (offset) {
		query = query.range(offset, offset + (limit || 10) - 1)
	} else if (limit) {
		query = query.limit(limit)
	}

	const { data, error } = await query

	if (error) {
		return new Response(JSON.stringify({ error }), { status: 500 })
	}

	return new Response(JSON.stringify({ data, count }), { status: 200 })
}
