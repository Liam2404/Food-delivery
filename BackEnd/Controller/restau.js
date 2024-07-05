import connection from "../index";

const restaurantLogin = async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM restaurant WHERE email = '${email}' AND password = '${password}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const restaurantRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const sql = `INSERT INTO restaurant (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const restaurantDelete = async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM restaurant WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const restaurantUpdate = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const sql = `UPDATE restaurant SET name = '${name}', email = '${email}', password = '${password}' WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const restaurantInfo = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM restaurant WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

const restaurantAll = async (req, res) => {
  const sql = `SELECT * FROM restaurant`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

export {
  restaurantLogin,
  restaurantRegister,
  restaurantDelete,
  restaurantUpdate,
  restaurantInfo,
  restaurantAll,
};