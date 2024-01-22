import express from "express";
import http from 'http';
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import routerProduct from "./routes/products.router.js";
import routerCart from "./routes/carts.router.js";
import routerViews from "./routes/views.router.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('handlebars', handlebars.engine());
app.set('views', join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use(express.static(join(__dirname, '/public')));
app.use(express.json());
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);
app.use('/', routerViews);
app.use("/realtimeproducts", routerViews);

app.get("/ping", (req, res) => {
  res.send("pong");
});

socketServer.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });


  socket.on('addProduct', (newProduct) => {

    const productsFilePath = join(__dirname, 'products.json');
    const productsData = fs.readFileSync(productsFilePath, 'utf-8');
    let updatedProducts = JSON.parse(productsData);


    updatedProducts.push(newProduct);


    fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2));


    socketServer.emit('updateProducts', updatedProducts);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
