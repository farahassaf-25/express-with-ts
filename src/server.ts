import app from "./app";
import { connectToDB } from "./config/database";

const PORT = process.env.PORT || 5000;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error starting server:", error);
        process.exit(1);
    });
