const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/get-spotify-data", async (req, res) => {
	const childPython = spawn("python3", ["main.py"]);

	childPython.stdout.on("data", (data) => {
		//console.log(data.toString("utf8"));
		res.json(data.toString("utf8"));
	});
});

app.listen(3001, () => {
	console.log("Server is running on PORT 3001");
});
