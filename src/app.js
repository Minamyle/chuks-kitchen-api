const express = require("express");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", foodRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Chuks Kitchen API running " });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
