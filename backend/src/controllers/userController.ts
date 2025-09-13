import { Router, type Request, type Response } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import User, { type IUser } from "../models/userModal.js";
import colors from "colors";
import generateToken from "../utils/generateToken.js";

colors.enable();

//@desc Auth user & get token
//@route POST /api/users/login
//@access Public

const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = (await User.findOne({ email })) as IUser;

  if (user && (await user.matchPassword(password))) {
    if (user._id) {
      generateToken(user._id.toString(), res);
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc Register
//@route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    if (user._id) {
      generateToken(user._id.toString(), res);
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Logout user / clear cookie
//@route POST /api/users/logout
//@access Private

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

//@desc Get user profile
//@route GET /api/users/profile
//@access Private

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//@desc Update user profile, token not by id
//@route PUT /api/users/profile
//@access Private

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);
  const { email, password, name } = req.body;
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//@desc Get all users profiles
//@route GET /api/users
//@access Private/admin

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

//@desc Get  user by id
//@route GET /api/users/:id
//@access Private/admin

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//@desc Update user by id
//@route PUT /api/users/:id
//@access Private/admin

const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const { email, name, isAdmin } = req.body;
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//@desc Delete users
//@route DELETE /api/users/:id
//@access Private/admin

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await user.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserById,
};
