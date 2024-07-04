import connection from "../index.js";


const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            if (results.length > 0) {
                // Utilisateur trouvé, créer une session
                req.session.user = results[0];
                res.send(req.session.user);
            } else {
                res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
            }
        }
    });
};

const userUpdate = async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    connection.query('UPDATE user SET ? WHERE id = ?', [updatedUser, userId], (error, results) => {
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
    connection.query('DELETE FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.send('Utilisateur supprimé avec succès');
        }
    });
};

const userRegister = async (req, res) => {
    const newUser = req.body;
    connection.query('INSERT INTO user SET ?', newUser, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.status(201).send('Utilisateur inscrit avec succès');
        }
    });
};

const userInfo = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur :', error);
            res.status(500).send('Erreur serveur');
        } else {
            if (results.length > 0) {
                // Utilisateur trouvé, créer une session
                req.session.user = results[0];
                res.send(req.session.user);
            } else {
                res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
            }
        }
    });
};

const getUserbyId = async (req, res) => {
    const userId = req.params.id;
    connection.query('SELECT * FROM user WHERE id = ?', [userId], (error, results) => {
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
    connection.query('SELECT * FROM user', (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.json(results);
        }
    });
};

const userLogout= async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            res.status(500).send('Erreur lors de la déconnexion');
        } else {
            console.log('Déconnexion réussie');
            res.clearCookie('session_id');
            res.send('Déconnexion réussie');
        }
    });
};



export {loginUser, userUpdate, userDelete, userRegister, userInfo, getUserbyId, getAllUsers, userLogout}