import { db } from "../index.js";
import bcrypt from 'bcryptjs';
import upload from '../middlewares/multer.js';


const getAllRestaurants = (req, res) => {
    const query = 'SELECT id, name, description, cuisine, rating, deliveryTime, restaurant_img FROM restaurant';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des restaurants:', err);
            return res.status(500).send({ message: 'Erreur lors de la récupération des restaurants' });
        }

        const restaurants = results.map(restaurant => ({
            ...restaurant,
            image: `http://localhost:3000/uploads/${restaurant.restaurant_img}`  // Chemin complet de l'image
        }));

        res.json(restaurants);
    });
};

// Fonction de login
const restaurantLogin = async (req, res) => {
    const { email_address, password } = req.body;
    console.log('Requête de connexion:', req.body);

    try {
        const sql = 'SELECT * FROM restaurant WHERE email_address = ?';
        req.db.query(sql, [email_address], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la recherche du compte:', err);
                return res.status(500).send({ message: 'Erreur lors de la connexion au compte' });
            }
            console.log('Résultats de la requête:', results)
            if (results.length === 0) {
                return res.status(401).send({ message: 'Adresse email incorrecte ou compte inexistant' });
            }

            const hashedPassword = results[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (!passwordMatch) {
                return res.status(401).send({ message: 'Mot de passe incorrect' });
            }

            // Stockez les informations du restaurant dans req.session.restaurant
            req.session.restaurant = {
                id: results[0].id,
                name: results[0].name,
                email_address: results[0].email_address
            };

            console.log('Session restaurant après connexion:', req.session);

            res.status(200).json(req.session.restaurant);
        });
    } catch (error) {
        console.error('Erreur lors de la connexion au compte:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion au compte' });
    }
};






// Fonction de registre avec gestion de l'image
const restaurantRegister = async (req, res) => {
    const { name, email_address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;  // Récupérer le chemin de l'image

    const sql = `INSERT INTO restaurant (name, email_address, password, restaurant_img) VALUES (?, ?, ?, ?)`;

    db.query(sql, [name, email_address, hashedPassword, imagePath], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données:', err);
            return res.status(500).send({ message: 'Erreur lors de la création du compte restaurant' });
        } else {
            res.status(201).send({ id: result.insertId, name, email_address });
        }
    });
};







const getMealsByRestaurant = async (req, res) => {

    const restaurantId = req.session.restaurant.id;
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
    const restaurantId = req.session.restaurant.id;

    db.query('SELECT * FROM meal WHERE meal_id = ? AND restaurant_id = ?', [id, restaurantId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la suppression du repas:', err);
            return res.status(500).json({ error: 'Erreur lors de la suppression du repas' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Repas non trouvé ou non autorisé' });
        }

        db.query('DELETE FROM meal WHERE meal_id = ?', [id], (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression du repas:', err);
                return res.status(500).json({ error: 'Erreur lors de la suppression du repas' });
            }
            res.status(200).json({ message: 'Repas supprimé avec succès' });
        });
    });
};


const getMealsById = async (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM meal WHERE meal_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du repas:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération du repas' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Repas non trouvé' });
        }
        res.json(results[0]);
    });
};

const restaurantAll = async (req, res) => {
    db.query('SELECT * FROM restaurant', (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(results);
    });
};



const restaurantDelete = async (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM restaurant WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du restaurant:', err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du restaurant' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant non trouvé' });
        }
        res.status(200).json({ message: 'Restaurant supprimé avec succès' });
    });

};
const restaurantInfo = async (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM restaurant WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.status(200).json(results);
    });
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

const addMeal = async (req, res) => {
    // Vérification si la session contient un restaurant connecté
    if (!req.session.restaurant) {
        return res.status(409).json({ message: 'Restaurant non connecté' });
    }

    const restaurantId = req.session.restaurant.id; // Obtenir l'ID du restaurant à partir de la session
    const { meal_name, meal_description, meal_price } = req.body;
    const meal_img = req.file ? req.file.path : null;

    if (!meal_name || !meal_description || !meal_price) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Insertion du plat dans la base de données
    const sql = `INSERT INTO meal (meal_name, meal_description, meal_price, meal_img, restaurant_id) VALUES (?, ?, ?, ?, ?)`;
    req.db.query(sql, [meal_name, meal_description, meal_price, meal_img, restaurantId], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du repas:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout du repas' });
        }

        // Renvoi de la réponse avec l'ID du nouveau plat
        res.status(201).json({ id: result.insertId, meal_name, meal_description, meal_price, meal_img });
    });
};





const updateMeal = (req, res) => {
    const { id } = req.params;
    const { meal_name, meal_description, meal_price } = req.body;
    const meal_img = req.file ? req.file.filename : null;
    const restaurantId = req.session.user.id;

    const sql = `UPDATE meal SET meal_name = ?, meal_description = ?, meal_price = ?, meal_img = ? WHERE meal_id = ? AND restaurant_id = ?`;
    db.query(sql, [meal_name, meal_description, meal_price, meal_img, id, restaurantId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du repas:', err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour du repas' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Repas non trouvé ou non autorisé' });
        }
        res.status(200).json({ message: 'Repas mis à jour avec succès' });
    });
};




export {
    restaurantLogin,
    restaurantRegister,
    addMeal,
    getMealsByRestaurant,
    getAllRestaurants,
    deleteMeal,
    getMealsById,
    restaurantAll,
    restaurantDelete,
    restaurantInfo,
    restaurantUpdate,
    updateMeal
};
