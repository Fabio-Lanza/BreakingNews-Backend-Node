import userService from "../services/user.service.js";

const create = async (req, res) => {
  try {
    const { name, username, password, avatar, background } = req.body;

    if (!name || !username || !password || !avatar || !background) {
      res.status(400).send({ message: "Fill up all fields for registration" });
    }

    const user = await userService.createService(req.body);

    if (!user) {
      return res.status(400).send({ message: "Error creating user" });
    }

    res.status(201).send({
      message: "User created successfully",
      user: { id: user._id, name, username, password, avatar, background },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllServices();

    if (users.length === 0) {
      return res.status(400).send({ message: "There are no registered users" });
    }
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const findById = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { name, username, password, avatar, background } = req.body;

    if (!name && !username && !password && !avatar && !background) {
      res
        .status(400)
        .send({ message: "Fill up at least one field for update" });
    }

    const { id, user } = req;

    await userService.updateServices(
      id,
      name,
      username,
      password,
      avatar,
      background
    );
    res.send({ message: "User successfully updated" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default { create, findAll, findById, update };
