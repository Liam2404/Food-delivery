import connection from '../index.js';
import bcrypt from 'bcryptjs';

const userRegister = async (req, res) => {
    const { username, email_address, password } = req.body;

    try {
        if (!username || !email_address || !password) {
            return res.status(400).json({ message: 'Les champs username, email_address et password sont requis' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query(
            'INSERT INTO client (username, email_address, password) VALUES (?, ?, ?)',
            [username, email_address, hashedPassword],
            (error, results) => {
                if (error) {
                    console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }
                res.status(201).json({ message: 'Utilisateur enregistré avec succès', results });
            }
        );

    } catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const loginUser = async (req, res) => {
    const { email_address, password } = req.body;
    console.log('Requête de connexion:', req.body);

    try {
        const sql = 'SELECT * FROM client WHERE email_address = ?';
        connection.query(sql, [email_address], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la recherche du compte:', err);
                return res.status(500).send({ message: 'Erreur lors de la connexion au compte' });
            }

            console.log('Résultats de la recherche du compte:', results);

            if (results.length === 0) {
                return res.status(401).send({ message: 'Adresse email incorrecte ou compte inexistant' });
            }

            const hashedPassword = results[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            console.log('Vérification du mot de passe:', passwordMatch);

            if (!passwordMatch) {
                return res.status(401).send({ message: 'Mot de passe incorrect' });
            }

            // Si l'authentification réussit, enregistrer l'utilisateur dans la session
            req.session.user = {
                id: results[0].id,
                username: results[0].username,
                email_address: results[0].email_address
            };

            res.status(200).json({ id: results[0].id, username: results[0].username, email_address: results[0].email_address });
        });
    } catch (error) {
        console.error('Erreur lors de la connexion au compte:', error);
        res.status(500).send({ message: 'Erreur lors de la connexion au compte' });
    }
};

const userUpdate = async (req, res) => {
    const clientId = req.params.id;
    const updatedClient = req.body;
    connection.query('UPDATE client SET ? WHERE id = ?', [updatedClient, clientId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.send('Utilisateur mis à jour avec succès');
        }
    });
};

const userDelete = async (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM client WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.send('Utilisateur supprimé avec succès');
        }
    });
};



const userInfo = async (req, res) => {
    const { username, password } = req.query;
    console.log('Requête reçue:', req.query);

    // Vérifiez si les champs username et password sont présents
    if (!username || !password) {
        res.status(400).send('Nom d\'utilisateur et mot de passe sont requis');
        return;
    }

    // Loggez les valeurs reçues pour le débogage
    console.log('Nom d\'utilisateur:', username);
    console.log('Mot de passe:', password);

    connection.query('SELECT * FROM client WHERE username = ?', [username], async (error, results) => {
        if (error) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            if (results.length > 0) {
                const hashedPassword = results[0].password;
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    // Utilisateur trouvé, renvoyer le nom d'utilisateur
                    res.send(`Utilisateur connecté : ${results[0].username}`);
                } else {
                    res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
                }
            } else {
                res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
            }
        }
    });
};



const getUserbyId = async (req, res) => {
    const clientId = req.params.id;
    connection.query('SELECT * FROM client WHERE id = ?', [clientId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Utilisateur non trouvé');
            }
        }
    });
};

const getAllUsers = async (req, res) => {
    connection.query('SELECT * FROM client', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.json(results);
        }
    });
};

const userSession = async (req, res) =>{
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Utilisateur non connecté' });
    }
};

const userLogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            res.status(500).send('Erreur lors de la déconnexion');
        } else {
            console.log('Déconnexion réussie');
            res.clearCookie('session.id');
            res.send('Déconnexion réussie');
        }
    });
};


export {
    loginUser,
    userUpdate,
    userDelete,
    userRegister,
    userInfo,
    getUserbyId,
    getAllUsers,
    userSession,
    userLogout,
};
