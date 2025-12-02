const app = require("./app");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");


const PORT = process.env.PORT || 5000;

app.use("/auth", authRoutes)

app.listen(PORT, () => {
    console.log("server is listening on Port 5000");
})