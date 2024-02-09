/* import express from "express";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const routerViews = express.Router();


routerViews.get("/", (req, res) => {
  const productsFilePath = join(__dirname, '../products.json');
  const productsData = fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(productsData);

  res.render("home", { products });
});

routerViews.get("/realtimeproducts", (req, res) => {
  const productsFilePath = join(__dirname, '../products.json');
  const productsData = fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(productsData);

  res.render("realTimeProducts", { products });
});

export default routerViews;
 */