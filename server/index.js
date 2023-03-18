"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const db_1 = require("./db");
const cors = require("cors");
const path = require("path");
const nanoid_1 = require("nanoid");
const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;
const userRef = db_1.firestore.collection("users");
const roomRef = db_1.firestore.collection("rooms");
app.post("/signup", (req, res) => {
    const email = req.body.email;
    const nombre = req.body.nombre;
    userRef
        .where("email", "==", email)
        .get()
        .then((snap) => {
        if (snap.empty) {
            userRef
                .add({
                email,
                nombre,
            })
                .then((newRef) => {
                res.json({
                    id: newRef.id,
                    new: true,
                });
            });
        }
        else {
            res.status(400).json("user already exists");
        }
    });
});
app.post("/auth", (req, res) => {
    const { email } = req.body;
    userRef
        .where("email", "==", email)
        .get()
        .then((snap) => {
        if (snap.empty) {
            res.status(404).json({
                message: "not found",
            });
        }
        else {
            res.json({
                id: snap.docs[0].id,
                data: snap.docs[0].data(),
            });
        }
    });
});
app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    userRef
        .doc(userId.toString())
        .get()
        .then((snap) => {
        if (snap.exists) {
            const newRoomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            newRoomRef
                .set({
                messages: [],
                owner: userId,
            })
                .then(() => {
                const roomPrivateId = newRoomRef.key;
                const roomPublicId = 1000 + Math.floor(Math.random() * 999);
                roomRef
                    .doc(roomPublicId.toString())
                    .set({
                    rtdbRoomId: roomPrivateId,
                })
                    .then(() => {
                    res.json({
                        id: roomPublicId.toString(),
                        privateId: roomPrivateId.toString(),
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existis",
            });
        }
    });
});
app.post("/rooms/:roomId/messages", (req, res) => {
    const chatRoomRef = db_1.rtdb.ref("/rooms/" + req.params.roomId + "/messages");
    chatRoomRef.push({
        from: req.body.from,
        message: req.body.message,
    }, function () {
        res.json("todo joya");
    });
});
app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    userRef
        .doc(userId.toString())
        .get()
        .then((snap) => {
        if (snap.exists) {
            roomRef
                .doc(roomId)
                .get()
                .then((docSnap) => {
                const data = docSnap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "no existis",
            });
        }
    });
});
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.listen(port, () => console.log("escuchando puerto" + port));
