module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.error("error : ", error)
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};
