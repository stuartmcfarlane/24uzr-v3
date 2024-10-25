import { getSession } from "@/actions/session"
import Link from "next/link"

const Home = async () => {
  const session = await getSession()

  return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5">
        Welcome to 24uzr
      </h1>
      <p className="max-w-[750px] mx-auto leading-8">
        Optimize you 24 hour sailing race decisions.
      </p>
      <button
        className="mt-4 bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
      >
        <Link href={session.isLoggedIn ? '/race' : '/login'} >
          Start planning
        </Link>
      </button>
    </main>
  )
}

export default Home