import User from "../models/User.js";

const createService = (body) => User.create(body);

const findAllServices = () => User.find();

const findByIdServices = (id) => User.findById(id);

const updateServices = (id, name, username, password, avatar, background) =>
  User.findOneAndUpdate(
    { _id: id },
    { name, username, password, avatar, background }
  );

export default {
  createService,
  findAllServices,
  findByIdServices,
  updateServices,
};
