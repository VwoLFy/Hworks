import {runDb} from "./repositories/db";
import {app} from "./app_config";
export const PORT = process.env.PORT || 5000;

const startApp = async () => {
    await runDb();
    app.listen(PORT, () => {
        console.log(`Server listening ${PORT}`)
    })
}

startApp()