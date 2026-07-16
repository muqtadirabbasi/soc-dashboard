const express = require('express');
const path = require('path');
const app = express();

// 1. Serve all static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Azure dynamically assigns a port via process.env.PORT. 
// If running locally, it defaults to port 8080.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});