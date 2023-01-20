import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ params }) => {
  const id = params.id

  const response = await fetch(
    'https://api.replicate.com/v1/predictions/' + id,
    {
      headers: {
        Authorization: `Token ${import.meta.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const result = await response.json()

  if (response.status !== 200) {
    return new Response(JSON.stringify({ detail: result.detail }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
