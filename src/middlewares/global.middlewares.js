import mongoose from "mongoose";
import userService from '../services/user.service.js'

export const validId = (req, res, next) => {
  const id = req.params.id;

  //padrao do mongoose para testar o ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid Id" });
  }
  next();
};

export const validUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await userService.findByIdServices(id);

  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }

  req.id = id;
  req.user = user;
  
  next();
};


