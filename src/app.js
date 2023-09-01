import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./router/viewsRouter.js";

import {dirname} from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express();
const httpServer = app.listen(8080, () => console.log('funcando'));
const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/', viewsRouter);

const mensajes = [];

socketServer.on('connection', socket => {
    console.log('Se conectó el usuario', socket.id);
    socket.on('mensaje', (data) => {
        mensajes.push(data);
        console.log(mensajes);
        socketServer.emit('nuevo_mensaje', mensajes);
    });
});
