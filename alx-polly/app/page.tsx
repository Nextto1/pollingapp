import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to polls dashboard
  redirect('/polls')
}
