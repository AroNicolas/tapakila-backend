import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import userEventRoutes from "./routes/user/user.event.routes";
import userAccountRoutes from "./routes/user/user.account.routes";
import userReservationRoutes from "./routes/user/user.reservation.routes";
import adminEventRoutes from "./routes/admin/admin.event.routes"
import adminAccountRoutes from "./routes/admin/admin.account.routes";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connexion à la base de données réussie !");
    app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
  })
  .catch((error) => console.error("Erreur de connexion à la base de données :", error));

app.use("/", authRoutes);

//User side
app.use("/api/user", userEventRoutes);
app.use("/api/user", userAccountRoutes);
app.use("/api/user", userReservationRoutes);

//Admin side
app.use("/api/admin", adminEventRoutes);
app.use("/api/admin", adminAccountRoutes);
