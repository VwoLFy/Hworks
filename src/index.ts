import {runDb} from "./main/repositories/db";
import {app} from "./main/app";

const PORT = process.env.PORT || 5000;

const startApp = async () => {
    await runDb();
    app.listen(PORT, () => {
        console.log(`Server listening ${PORT}`)
    })
}

startApp()