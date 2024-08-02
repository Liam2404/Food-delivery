import { db } from "../index.js";
import bcrypt from 'bcryptjs';

// Fonction de login
const restaurantLogin = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
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

            req.session.user = {
                id: results[0].id,
                name: results[0].name,
                email_address: results[0].email_address
            };

            res.status(200).json({ id: results[0].id, name: results[0].name, email_address: results[0].email_address });
        });
    } catch (error) {
        console.error('Erreur lors de la connexion au compte restaurant:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion au compte restaurant' });
    }
};

// Fonction de registre
const restaurantRegister = async (req, res) => {
    const { name, email_address, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO restaurant (name, email_address, password) VALUES (?, ?, ?)`;
        db.query(sql, [name, email_address, hashedPassword], (err, result) => {
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

const addMeal = (req, res) => {
    const { meal_name, meal_description, meal_price } = req.body;
    const meal_img = req.file ? req.file.filename : null;

    // Vérification si les champs requis sont présents
    if (!meal_name || !meal_description || !meal_price) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Requête SQL pour insérer le plat dans la base de données
    const sql = `INSERT INTO meal (meal_name, meal_description, meal_price, meal_img) VALUES (?, ?, ?, ?)`;
    db.query(sql, [meal_name, meal_description, meal_price, meal_img], (err, result) => {
        if (err) {
            // En cas d'erreur, affiche l'erreur dans la console et renvoie une réponse d'erreur
            console.error('Erreur lors de l\'ajout du repas:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du repas' });
        }

        // Réponse de succès avec les détails du plat ajouté
        res.status(201).json({ id: result.insertId, meal_name, meal_description, meal_price, meal_img });
    });
};



const getMealsByRestaurant = async (req, res) => {
    const restaurantId = req.session.user.id; 

    const query = 'SELECT * FROM meal WHERE restaurant_id = ?';
    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des repas:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des repas' });
        }
        res.json(results);
    });
};



const deleteMeal = async (req, res) => {
    const { id } = req.params;
    const restaurantId = req.session.user.id; 

    try {
        const [meal] = await db.query('SELECT * FROM meal WHERE meal_id = ? AND restaurant_id = ?', [id, restaurantId]);
        if (meal.length === 0) {
            return res.status(404).json({ message: 'Repas non trouvé ou non autorisé' });
        }

        await db.query('DELETE FROM meal WHERE meal_id = ?', [id]);
        res.status(200).json({ message: 'Repas supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du repas:', error);
        res.status(500).json({ error: error.message });
    }
};


const getMealsById = async (req, res) => {
    const { id } = req.params;
    try {
        const [meals] = await db.query(
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

const restaurantAll = async (req, res) => {
    try {
        const [restaurants] = await db.query(`SELECT * FROM restaurant`);
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const restaurantDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM restaurant WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json({ message: 'Restaurant supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du restaurant:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du restaurant' });
    }
};
const restaurantInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const [restaurant] = await db.query('SELECT * FROM restaurant WHERE id = ?', [id]);
        if (restaurant.length === 0) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json(restaurant[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des informations du restaurant:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des informations du restaurant' });
    }
}

const restaurantUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, email_address, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query('UPDATE restaurant SET name = ?, email_address = ?, password = ? WHERE id = ?', [name, email_address, hashedPassword, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json({ message: 'Restaurant mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du restaurant:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du restaurant' });
    }
};

const updateMeal = async (req, res) => {
    const { id } = req.params;
    const { meal_name, meal_description, meal_price } = req.body;
    const restaurantId = req.session.user.id; 

    try {
        const [result] = await db.query(
            'UPDATE meal SET meal_name = ?, meal_description = ?, meal_price = ? WHERE meal_id = ? AND restaurant_id = ?',
            [meal_name, meal_description, meal_price, id, restaurantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Repas non trouvé ou non autorisé' });
        }

        res.status(200).json({ message: 'Repas mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du repas:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du repas' });
    }
};



export {
    restaurantLogin,
    restaurantRegister,
    addMeal,
    getMealsByRestaurant,
    deleteMeal,
    getMealsById,
    restaurantAll,
    restaurantDelete,
    restaurantInfo,
    restaurantUpdate,
    updateMeal
};
