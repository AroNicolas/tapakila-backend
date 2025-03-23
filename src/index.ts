import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connexion à la base de données réussie !");
    app.listen(3000, () => console.log("🚀 Serveur démarré sur http://localhost:3000"));
  })
  .catch((error) => console.error("❌ Erreur de connexion à la base de données :", error));

app.use("/", authRoutes);