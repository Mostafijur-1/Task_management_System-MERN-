import validator from "validator";

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || name.trim() === "") {
    errors.push({ param: "name", msg: "Name is required" });
  }

  if (!email || !validator.isEmail(email)) {
    errors.push({ param: "email", msg: "Please include a valid email" });
  }

  if (!password) {
    errors.push({ param: "password", msg: "Password is required" });
  } else if (password.length < 6) {
    errors.push({
      param: "password",
      msg: "Password must be at least 6 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  let errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push({ param: "email", msg: "Please include a valid email" });
  }

  if (!password) {
    errors.push({ param: "password", msg: "Password is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title } = req.body;
  let errors = [];

  if (!title || title.trim() === "") {
    errors.push({ param: "title", msg: "Task title is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateProject = (req, res, next) => {
  const { name } = req.body;
  let errors = [];

  if (!name || name.trim() === "") {
    errors.push({ param: "name", msg: "Project name is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const id = req.params.id || req.params.userId;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  next();
};

export {
  validateRegister,
  validateLogin,
  validateTask,
  validateProject,
  validateObjectId,
};
