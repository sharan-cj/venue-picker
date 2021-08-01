const joi = require("joi");
const board = require("./models/board");
const User = require("./models/user");

const signup = async (req, res) => {
  const { error } = signupSchema.validate(req.body);
  if (!Boolean(error)) {
    try {
      const user = await new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      }).save();
      const usr = { name: user.name, id: user._id, email: user.email };
      console.log(usr);
      res.json({ user: usr });
      console.log("new signup @", new Date().toLocaleString(), user);
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    const err = error.details.map((e) => e.message);
    res.status(400).json({ error: err.toString() });
    console.log(err);
  }
};

const signin = async (req, res) => {
  const { error } = signinSchema.validate(req.body);
  if (!Boolean(error)) {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email });
      if (user.password === req.body.password) {
        const usr = { name: user.name, id: user._id, email: user.email };
        console.log(usr);
        res.json({ user: usr });
      } else {
        res.status(403).json({ error: "Incorrect password" });
      }
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    const err = error.details.map((e) => e.message);
    res.status(400).json({ errors: err });
    console.log(err);
  }
};

const users = async (req, res) => {
  try {
    const rawUsers = await User.find();
    const users = rawUsers.map((user) => ({ name: user.name, id: user._id }));
    console.log(users);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateBoard = async (req, res) => {
  try {
    const boardRes = await board.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    res.json({ board: boardRes });
  } catch (error) {
    console.log(error.messge);
    res.status(400).json({ error });
  }
};

const getBoard = async (req, res) => {
  try {
    const boardRes = await board.findOne();
    res.json({ board: boardRes });
  } catch (error) {
    console.log(error.messge);
    res.status(400).json({ error });
  }
};

module.exports = { signup, signin, users, updateBoard, getBoard };

// validation schemas

const signupSchema = joi.object({
  name: joi.string().max(50).required(),
  email: joi.string().email().required().max(50),
  password: joi.string().required().min(6).max(60),
});

const signinSchema = joi.object({
  email: joi.string().max(50).required(),
  password: joi.string().required().max(60),
});
