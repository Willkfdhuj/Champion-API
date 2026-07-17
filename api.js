console.log("🔥 THIS IS THE CHAMPION API FILE");

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;


// Get user profile
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


// Leaderboard
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
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 3);

    res.json(leaderboard);
});


// Sync economy from Discord bot
app.post("/api/sync-economy", (req, res) => {

    fs.writeFileSync(
        "./data/economy.json",
        JSON.stringify(req.body, null, 2)
    );

    console.log("✅ Economy synced from Discord bot");

    res.json({
        success: true
    });
});


app.listen(PORT, () => {
    console.log(`Champion Network API running on port ${PORT}`);
});
