import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/user/user.event.routes";
import accountRoutes from "./routes/user/user.account.routes";

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
app.use("/api", eventRoutes);
app.use("/api", accountRoutes);
