import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';
import UserModel from '../models/user-model';
import config from '../config';

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const user = await UserModel.findOne({ email });

    if (user === null) throw new Error(`User with email ${email} does not exist`);

    const passwordIsCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordIsCorrect) throw new Error('Invalid password');

    const token = jwt
      .sign({ email, role: user.role }, config.token.secret);

    res.status(200).json({
      user,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while logging in',
    });
  }
};

export const register: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const hashedPassword = bcrypt.hashSync(password, 5);
    const createdUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign({ email, role: createdUser.role }, config.token.secret);

    res.status(201).json({
      user: createdUser,
      token: `Bearer ${token}`,
    });
  } catch (error) {
    let errorMessage;

    if (error instanceof Error.ValidationError) {
      if (error.errors.email) {
        errorMessage = 'This email is already taken';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Server error';
    }
    res.status(400).json({
      error: errorMessage,
    });
  }
};
