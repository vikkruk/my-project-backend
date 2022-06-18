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

export const register: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
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
      user: createUserViewModel(createdUser),
      token: `Bearer ${token}`,
    });
  } catch (error) {
    let errorMessage = 'Server error';

    if (error instanceof Error.ValidationError) {
      if (error.errors.email) {
        errorMessage = 'This email is already taken';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;

      res.status(400).json({
        error: errorMessage,
      });
    }
  }
};

export const authenticate: RequestHandler<
  unknown,
  AuthResponseBody
> = async (req, res) => {
  try {
    if (req.tokenData === undefined) {
      throw new Error('Request does not contain tokenData');
    }
    const { email, token } = req.tokenData;
    const userDoc = await UserModel.findOne({ email });

    if (userDoc === null) {
      throw new Error(`User with email ${email} was not found`);
    }
    const user = createUserViewModel(userDoc);

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

export const checkAvailability: RequestHandler<
  unknown,
  { available: true } | ErrorResponseBody,
  unknown,
  { value: string, type: string }
> = async (req, res) => {
  try {
    const { value, type } = req.query;
    if (value === undefined || type === undefined) {
      throw new Error('Value and type needed for checking');
    }

    const userDoc = await UserModel.findOne({ [type]: value });

    if (userDoc !== null) {
      throw new Error(`This ${type} is already taken`);
    }
    res.status(200).json({
      available: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while logging in',
    });
  }
};

export const updateUser: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
  const userProps: Partial<UserProps> = req.body;
  try {
    if (req.tokenData === undefined) {
      throw new Error('Error occured while authenticating the user');
    }
    const { email } = req.tokenData;

    const userDoc = await UserModel.findOne({ email });
    if (userDoc === null) {
      throw new Error(`User with email ${email} was not found`);
    }

    if (userProps.email) userDoc.email = userProps.email;
    if (userProps.nickname) userDoc.nickname = userProps.nickname;
    if (userProps.avatar) userDoc.avatar = userProps.avatar;

    await userDoc.save();

    const newToken = jwt.sign({ email: userDoc.email, role: userDoc.role }, config.token.secret);

    res.status(200).json({
      user: createUserViewModel(userDoc),
      token: `Bearer ${newToken}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Couldn\'t authenticate the user',
    });
  }
};
