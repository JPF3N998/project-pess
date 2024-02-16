import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants/HttpCodes.js';
import { usePrisma } from '../prisma/useClient.js';

export interface RequestWithUserId extends Request {
  params: {
    email: string
  },
  userId: number
}

const client = usePrisma()

/**
 * Attach user ID to req object by using `/:email`
 * @param req {Express.Request}
 */
export async function useUserId(req: RequestWithUserId, res: Response, next: NextFunction) {  
  if (!req.params.email) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST)
    return res.send('No user email provided.')
  }

  const user = await client.user.findUnique({
    select: { id: true },
    where : { email: req.params.email }
  })

  if (!user) {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).send('User not found')
  }

  req.userId = user.id

  next()
}