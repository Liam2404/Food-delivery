import { db } from "../index.js";
import bcrypt from 'bcryptjs';


const restaurantLogin = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log(req.body)
    try {
        const sql = `SELECT * FROM restaurant WHERE email_address = ?`;
        db.query(sql, [usernameOrEmail], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la recherche du compte restaurant:', err);
                return res.status(500).send({ message: 'Erreur lors de la connexion au compte restaurant' });
            }
            
            if (results.length === 0) {
                return res.status(401).send({ message: 'Adresse email incorrecte ou compte inexistant' });
            }
            
            const hashedPassword = results[0].password;

            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            
            if (!passwordMatch) {
                return res.status(401).send({ message: 'Mot de passe incorrect' });
            }

            const { id, name, email_address } = results[0];
            res.status(200).json({ id, name, email_address });
        });

    } catch (error) {
        console.error('Erreur lors de la connexion au compte restaurant:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion au compte restaurant' });
    }
};


const restaurantRegister = async (req, res) => {
    const { name, email_address, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // nombre de tours de hashage

        const sql = `INSERT INTO restaurant (name, email_address, password) VALUES ('${name}', '${email_address}', '${hashedPassword}')`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données:', err);
                res.status(500).send({ message: 'Erreur lors de la création du compte restaurant' });
            } else {
                res.status(201).send({ id: result.insertId, name, email_address });
            }
        });
    } catch (error) {
        console.error('Erreur lors du hashage du mot de passe:', error);
        res.status(500).send({ message: 'Erreur lors de la création du compte restaurant' });
    }
};


const restaurantDelete = async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM restaurant WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
};

const restaurantUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, email_address, password } = req.body;
    const sql = `UPDATE restaurant SET name = '${name}', email_address = '${email_address}', password = '${password}' WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
};

const restaurantInfo = async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM restaurant WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
};

const restaurantAll = async (req, res) => {
    const sql = `SELECT * FROM restaurant`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
};

const addMeal = async (req, res) => {
    const { meal_name, meal_description, meal_price, meal_img, restaurant_id } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO meal (meal_name, meal_description, meal_price, meal_img) VALUES (?, ?, ?, ?)',
            [meal_name, meal_description, meal_price, meal_img]
        );
        const mealId = result.insertId;
        await db.execute(
            'INSERT INTO meal_restaurant (meal_id, restaurant_id) VALUES (?, ?)',
            [mealId, restaurant_id]
        );
        res.status(201).json({ message: 'Meal added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMeal = async (req, res) => {
    const { id } = req.params;
    const { meal_name, meal_description, meal_price, meal_img } = req.body;
    try {
        await db.execute(
            'UPDATE meal SET meal_name = ?, meal_description = ?, meal_price = ?, meal_img = ? WHERE meal_id = ?',
            [meal_name, meal_description, meal_price, meal_img, id]
        );
        res.status(200).json({ message: 'Meal updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMeal = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM meal WHERE meal_id = ?', [id]);
        await db.execute('DELETE FROM meal_restaurant WHERE meal_id = ?', [id]);
        res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMealsByRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const [meals] = await db.execute(
            `SELECT m.* FROM meal m
            JOIN meal_restaurant mr ON m.meal_id = mr.meal_id
            WHERE mr.restaurant_id = ?`,
            [restaurantId]
        );
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMealsById = async (req, res) => {
    const { id } = req.params;
    try {
        const [meals] = await db.execute(
            `SELECT m.* FROM meal m
            JOIN meal_restaurant mr ON m.meal_id = mr.meal_id
            WHERE m.meal_id = ?`,
            [id]
        );
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    restaurantLogin,
    restaurantRegister,
    restaurantDelete,
    restaurantUpdate,
    restaurantInfo,
    restaurantAll,
    addMeal,
    updateMeal,
    deleteMeal,
    getMealsByRestaurant,
    getMealsById
};