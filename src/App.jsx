import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

function App() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState([])
  const languageCounts = repos.reduce((acc, repo) => {
    if (!repo.language) return acc
    acc[repo.language] = (acc[repo.language] || 0) + 1
    return acc
  }, {})
  const languageData = Object.entries(languageCounts).map(([name, value]) => ({ name, value }))
  const COLORS = ['#000000', '#666666', '#999999', '#cccccc', '#333333', '#aaaaaa']

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
      
      {languageData.length > 0 && (
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={languageData} dataKey="value" nameKey="name" outerRadius={80} label>
                {languageData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repos.map((r) => ({ name: r.name, stars: r.stargazers_count, forks: r.forks_count }))}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stars" fill="#000000" />
              <Bar dataKey="forks" fill="#999999" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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