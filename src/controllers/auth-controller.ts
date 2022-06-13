import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error } from 'mongoose';
import UserModel, { UserProps } from '../models/user-model';
import config from '../config';
import createUserViewModel, { UserViewModel } from '../view-model-creators/create-user-view model';

type AuthResponseBody = {
  user: UserViewModel,
  token: string,
} | ErrorResponseBody;

export const login: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const userDoc = await UserModel.findOne({ email });

    if (userDoc === null) throw new Error(`User with email ${email} does not exist`);

    const passwordIsCorrect = bcrypt.compareSync(password, userDoc.password);

    if (!passwordIsCorrect) throw new Error('Password is incorrect');

    const token = jwt
      .sign({ email, role: userDoc.role }, config.token.secret);

    res.status(200).json({
      user: createUserViewModel(userDoc),
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
