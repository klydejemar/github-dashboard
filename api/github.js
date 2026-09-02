export default async function handler(req, res) {
  const { path } = req.query

  const githubRes = await fetch(`https://api.github.com/${path}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  })

  const data = await githubRes.json()
  res.status(githubRes.status).json(data)
}