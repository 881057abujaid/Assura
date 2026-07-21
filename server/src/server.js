import app from "./app.js";
import env from "./config/env.js";

const PORT = env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Assura server is running on http://localhost:${PORT}`);
});