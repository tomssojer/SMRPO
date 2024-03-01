import db from "../database.js";

export const getUser = (data, result) => {
  db.query(
    "SELECT * FROM users WHERE user = ? AND password = ?",
    [data.username, data.password],
    (err, results) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        console.log(results)
        result(null, results)
      }
    }
  );
};