// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if(req.method === 'POST') {
    const {userName, password} = req.body
    
    if(userName === "admin" && password === "hotdog") {
        return res.status(200).json({name: "Admin", role: "admin"})
    }
  }
  return res.status(403).json(null)
}