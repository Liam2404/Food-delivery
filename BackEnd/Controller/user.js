import connection from "../index.js";
import bcrypt from 'bcryptjs';


const loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log(req.body);
    try {
        const sql = `SELECT * FROM client WHERE email_address = ?`;
        db.query(sql, [usernameOrEmail], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la recherche du compte:', err);
                return res.status(500).send({ message: 'Erreur lors de la connexion au compte' });
            }
            
            if (results.length === 0) {
                return res.status(401).send({ message: 'Adresse email incorrecte ou compte inexistant' });
            }
            
            const hashedPassword = results[0].password;
            const passwordMatch = await bcrypt.compare(password, hashedPassword);
            
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

const userRegister = async (req, res) => {
    const { username, email_address, password } = req.body;
  
    try {
      // Vérifier que les champs requis sont présents dans req.body
      if (!username || !email_address || !password) {
        return res.status(400).send('Les champs username, email_address et password sont requis');
      }
  
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insérer l'utilisateur dans la base de données
      connection.query(
        'INSERT INTO client (username, email_address, password) VALUES (?, ?, ?)',
        [username, email_address, hashedPassword],
        (error, results) => {
          if (error) {
            console.error('Erreur lors de l\'insertion de l\'utilisateur :', error);
            return res.status(500).send('Erreur serveur');
          }
          res.send('Utilisateur enregistré avec succès');
        }
      );
  
    } catch (error) {
      console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
      res.status(500).send('Erreur serveur');
    }
  };
  

const userInfo = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    connection.query('SELECT * FROM client WHERE username = ? AND password = ?', [username, password], (error, results) => {
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
    userLogout
};
