import app from './app';
import * as dotenv from 'dotenv';
import { runMigrations } from './migrations/migrations_runner';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Run migrations before starting the server
        await runMigrations();

        // Now, start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1); // Exit the process if migrations fail
    }
};

startServer();
