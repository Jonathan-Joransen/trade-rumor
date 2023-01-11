import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    console.log(req.method)
  if(req.method === 'POST') {
    const {userName, password} = JSON.parse(JSON.stringify(req.body.credentials))
    console.log(userName)
    console.log(password)
    console.log(process.env.ADMIN_PASSWORD)
    if(userName === "admin" && password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({name: "Admin", role: "admin"})
    }
    return res.status(404).json({})
  }
  return res.status(404).json({})
}
