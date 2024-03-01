import { getUser } from "../models/userModel.js";

export const authUser = (req, res) => {
  const data = req.body;
  console.log(data);
  getUser(data, (err, results) => {
    if (err)
      res.send(err);
    else 
      res.json(results);
  })
};