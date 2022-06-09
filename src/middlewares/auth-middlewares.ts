import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user-model';

type DecodedInfo = {
  email: string,
  role: 'admin' | 'user',
  favoredActors: string[],
  iat?: number
};

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (authHeader === undefined) throw new Error('You have to be logged in');

    const token = authHeader.split(' ')[1];
    if (token === undefined) throw new Error('Error reading user\'s login data');

    const decodedInfo = jwt.verify(token, config.token.secret) as DecodedInfo;

    req.tokenData = {
      email: decodedInfo.email,
      role: decodedInfo.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error
        ? error.message
        : 'Authorization process failed',
    });
  }
};

export const userMiddleware: RequestHandler = async (req, res, next) => {
  try {
    if (req.tokenData === undefined) throw new Error('You have to be logged in');

    const foundUser = await UserModel.findOne({ email: req.tokenData.email });
    if (foundUser === null) throw new Error('User was not found');

    req.authUserDoc = foundUser;
    next();
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'User authentication error',
    });
  }
};

export const adminMiddleware: RequestHandler = (req, res, next) => {
  if (req.tokenData === undefined) {
    res.status(401).json({ error: 'You have to be logged in' });
    return;
  }
  if (req.tokenData.role !== 'admin') {
    res.status(401).json({
      error: 'Admin authorization required',
    });
    return;
  }
  next();
};
