import { getSession } from "@/actions/session"
import LoggedInHomePage from "@/components/LoggedInHomePage"

const Home = async () => {
  const session = await getSession()

  if (!session.isLoggedIn) return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5">
        Welcome to 24uzr
      </h1>
      <p className="max-w-[750px] mx-auto leading-8">
        Optimize you 24 hour sailing race decisions.
      </p>
    </main>
  )
  return <LoggedInHomePage />
}

export default Home