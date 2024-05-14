const express = require("express");
const app = express();
const userRoutes = require("./routes/routes");

const port = 3005;
app.use(express.json());
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to ScaleX  Book Managment" });
});

app.use("/api/auth", userRoutes);


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});