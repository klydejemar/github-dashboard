import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()

    const profileRes = await fetch(`https://api.github.com/users/${username}`)
    const profileData = await profileRes.json()
    setProfile(profileData)

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos`)
    const reposData = await reposRes.json()
    setRepos(Array.isArray(reposData) ? reposData : [])
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          className="flex-1 border px-2 py-1"
        />
        <button className="bg-black px-3 py-1 text-white">Search</button>
      </form>

      {profile && !profile.message && (
        <div className="mt-6 flex items-center gap-4">
          <img src={profile.avatar_url} alt={profile.login} className="h-16 w-16 rounded-full" />
          <div>
            <p className="font-semibold">{profile.name || profile.login}</p>
            <p className="text-sm text-gray-500">{profile.bio}</p>
            <p className="text-sm text-gray-500">{profile.public_repos} public repos</p>
          </div>
        </div>
      )}

      {profile?.message && (
        <p className="mt-6 text-red-600">User not found.</p>
      )}

      <ul className="mt-6 flex flex-col gap-2">
        {repos.map((repo) => (
          <li key={repo.id} className="border p-3">
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-medium underline">
              {repo.name}
            </a>
            <p className="text-sm text-gray-500">{repo.description}</p>
            <p className="text-xs text-gray-400">
              {repo.language} · ⭐ {repo.stargazers_count}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App