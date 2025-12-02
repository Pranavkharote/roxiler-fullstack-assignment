const pool = require("./src/config/db");

pool.query("SELECT NOW()", (err,result) => {
    if(err){
        console.error("DB connecttion failed", err);
    } else {
        console.log("PostgreSql successfully connceted.");
    }
    process.exit();
})