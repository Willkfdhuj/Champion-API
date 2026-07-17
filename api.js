console.log("🔥 THIS IS THE CHAMPION API FILE");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

app.use(cors());

const PORT = 3000;

app.get("/api/user/:id", (req, res) => {
    const economy = JSON.parse(
        fs.readFileSync("./data/economy.json", "utf8")
    );
    const user = economy[req.params.id];

    if (!user) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    res.json({
        balance: user.balance,
        monthlyCC: user.monthlyCC || 0,
        casino: user.casino || {},
        crates: user.crates || 0
    });
});

app.get("/api/leaderboard", (req, res) => {
    const economy = JSON.parse(
        fs.readFileSync("./data/economy.json", "utf8")
    );

    const users = JSON.parse(
        fs.readFileSync("./data/users.json", "utf8")
    );

    const leaderboard = Object.entries(economy)
        .map(([id, data]) => ({
            id: id,
            username: users[id]?.username || "Unknown",
            balance: data.balance || 0,
            monthlyCC: data.monthlyCC || 0
        }))
        .sort((a, b) => b.balance - a.balance);

    res.json(leaderboard);
});

app.listen(PORT, () => {
    console.log(`Champion Network API running on port ${PORT}`);
});
