import type { APIRoute } from 'astro'

export const post: APIRoute = async ({ request }) => {
  const data = await request.json()

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${import.meta.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Pinned to a specific version of MODnet
      // See https://replicate.com/pollinations/modnet/versions
      version:
        '4f40b36544786857fbc499be0996ba5152627ce61d614eeab7e19a7e1fd61ac6',
      input: { image: data.image },
    }),
  })

  const result = await response.json()

  if (response.status !== 201) {
    return new Response(JSON.stringify({ detail: result.detail }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
