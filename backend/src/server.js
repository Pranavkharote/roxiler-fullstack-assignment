const app = require("./app");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const PORT = process.env.PORT || 5000;
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/owner", ownerRoutes);

app.listen(PORT, () => {
  console.log("server is listening on Port 5000");
});
