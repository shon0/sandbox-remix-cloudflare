import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  console.log(context.cloudflare.env.SOME_SECRET)

  const { DB } = context.cloudflare.env

  const { results } = await DB.prepare('SELECT * FROM customers').all<{
    customer_id: number
    company_name: string | null
    contact_name: string | null
    nick_name: string | null
  }>()

  return { customers: results }
}

export default function Home() {
  const { customers } = useLoaderData<typeof loader>()

  return (
    <div className="flex h-screen items-center justify-center">
      <ul>
        {customers.map((c) => (
          <li key={c.customer_id}>{Object.values(c).join(', ')}</li>
        ))}
      </ul>
    </div>
  )
}
