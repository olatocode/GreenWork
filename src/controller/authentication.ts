/** @format */

import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
      
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication((await user).authentication.salt, password);
    if((await user).authentication.password !== expectedHash){
      return res.sendStatus(403);
    }

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};