class DBController {
    constructor(sql, sqlConfig) {
        this.sql = sql;
        this.connection = this.sql.createConnection(sqlConfig
        );
        this.connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }
    executeQuery(query, callback) {
        console.log("QUERY ============== " + query + "\n");
        return this.connection.query(query, (e, r) => {
            console.log("QUERY RES ============== " + this.convertCircularJSONtoJSON(r) + "\n");
            callback(this.convertCircularJSONtoJSON(r), e);
        })
    }
    convertCircularJSONtoJSON(json) {
        return JSON.parse(JSON.stringify(json));
    }
}

module.exports = DBController;