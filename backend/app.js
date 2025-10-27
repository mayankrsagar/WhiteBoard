const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const http = require("http");
const socketIO = require("socket.io");
const sharp = require('sharp');
const connection = require("./db");
const { userJoin, getUsers, userLeave } = require("./utils/users");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server);

connection();

app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.json());


const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    images: [String], // Store image filenames associated with the user
});
const User = mongoose.model('UserData', UserSchema);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './img';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    },
});


const upload = multer({ storage: storage });

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            images: [], // Initialize user images as empty array
        });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.json({ message: 'Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Profile endpoint
app.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user information (email and username)
        res.json({ email: user.email, username: user.username });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { userId } = req.body; // Assuming userId is sent from the authenticated user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.images.push(req.file.filename);
        await user.save();

        res.json({ status: 'ok', data: req.file });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Get all images for a user endpoint
app.get('/images/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ images: user.images });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete image endpoint
app.delete('/image/:filename/:userId', async (req, res) => {
    try {
        const { filename, userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const index = user.images.indexOf(filename);
        if (index !== -1) {
            // Remove the filename from the user's images array
            user.images.splice(index, 1);
            await user.save();

            // Delete the file from the server
            const imgPath = path.join(__dirname, 'img', filename);
            fs.unlink(imgPath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    return res.status(500).json({ error: 'Error deleting image' });
                }
                res.json({ message: 'Image deleted successfully' });
            });
        } else {
            res.status(404).json({ error: 'Image not found for the user' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Socket.io handling
let imageUrl, userRoom;
io.on("connection", (socket) => {
    socket.on("user-joined", (data) => {
        const { roomId, userId, userName, host, presenter } = data;
        userRoom = roomId;
        const user = userJoin(socket.id, userName, roomId, host, presenter);
        const roomUsers = getUsers(user.room);
        socket.join(user.room);
        socket.emit("canvasImage", { imageURL: imageUrl });
        socket.emit("message", {
            message: "Welcome to Live Drawing Room",
        });
        socket.broadcast.to(user.room).emit("message", {
            message: `${user.username} has joined`,
        });

        io.to(user.room).emit("users", roomUsers);
        io.to(user.room).emit("canvasImage", imageUrl);
    });

    socket.on("drawing", (data) => {
        imageUrl = data;
        io.emit("draw", imageUrl);
        socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
    });

    socket.on("disconnect", () => {
        const userLeaves = userLeave(socket.id);
        const roomUsers = getUsers(userRoom);

        if (userLeaves) {
            io.to(userLeaves.room).emit("message", {
                message: `${userLeaves.username} left the room`,
            });
            io.to(userLeaves.room).emit("users", roomUsers);
        }
    });
});

// Default route
app.get("/", async (req, res) => {
    res.send("Success!!!!!!");
});

// Define the port
const PORT = process.env.PORT || 9000;

// Start the server
server.listen(PORT, () =>
    console.log(`Server is listening on http://localhost:${PORT}`)
);