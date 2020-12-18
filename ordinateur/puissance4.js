class Puissance4 {
    /*
      On initialise un plateau de jeu avec les dimensions `lignes` × `colonnes` (par défaut 6×7),
      et on fait l'affichage dans l'élément `element_id` du DOM.
     */
    constructor(element_id, lignes=6, colonnes=7) {
        // On défini le nombre de lignes et de colonnes
        this.lignes = lignes;
        this.colonnes = colonnes;
        //On a un tableau qui définit l'état du jeu avec :
        //   0: Comme case vide
        //   1: Comme pion du joueur 1
        //   2: Comme pion du joueur 2
        this.tableau = Array(this.lignes);
        for (let i = 0; i < this.lignes; i++) {
            this.tableau[i] = Array(this.colonnes).fill(0);
        }
        // On a un entier égale à 1 ou 2 (le numéro du prochain joueur)
        this.tours = 1;
        // On a un nombre de coups joués
        this.coups = 0;
        /* On a un entier indiquant le gagnant:
            null: Alors la partie continue
               0: Alors la partie est nulle
               1: Alors joueur 1 a gagné
               2: Alors joueur 2 a gagné
        */
        this.gagnant = null;

        // On a l'élément du DOM où se fait l'affichage
        this.element = document.querySelector(element_id);
        // On ajoute le gestionnaire d'événements pour gérer le click
        //On lance la fonction handle_click quand l'utilisateur click
        this.element.addEventListener('click', (event) => this.handle_click(event));
        // On fait l'affichage
        this.rendu();
    }


    /* Affiche le plateau de jeu dans le DOM */
    rendu() {
        let table = document.createElement('table');
        // La page html est écrite de haut en bas donc les indices pour le jeu vont de bas en haut (compteur i de la boucle)
        for (let i = this.lignes - 1; i >= 0; i--) {
            let tr = table.appendChild(document.createElement('tr'));
            for (let j = 0; j < this.colonnes; j++) {
                let td = tr.appendChild(document.createElement('td'));
                let couleur = this.tableau[i][j];
                if (couleur)
                    td.className = 'player' + couleur;
                td.dataset.colonne = j;
            }
        }
        this.element.innerHTML = '';
        this.element.appendChild(table);
    }

    animation(ligne, colonne, player) {
        // On colore la case
        this.tableau[ligne][colonne] = player;
        // On compte le coup
        this.coups++;
    }

    /* Cette fonction ajoute un pion dans une colonne */
    jouerHumain(colonne) {
            /// On trouve la première case libre dans la colonne
            let ligne;
            for (let i = 0; i < this.lignes; i++) {
                if (this.tableau[i][colonne] === 0) {
                    ligne = i;
                    break;
                }
            }
            if (ligne === undefined) {
                return null;
            } else {
                //On effectue le coup
                this.animation(ligne, colonne, this.tours);
                //On renvois la ligne où on a joué
                return ligne;
            }
    }

    handle_click(event) {
        //On vérifie si la partie est encore en cours
        if (this.gagnant !== null) {
            if (window.confirm("Fin de partie!\n\nVous voulez rejouez?")) {
                this.reinitialiser();
                this.rendu();
            }
            return;
        }

        let colonne = event.target.dataset.colonne;
        if (colonne !== undefined) {
            //On convertit les variables en entier avec parseInt pour ne pas avoir de problèmes
            colonne = parseInt(colonne);
            let ligne = this.jouerHumain(parseInt(colonne));
            if (ligne === null) {
                window.alert("La colonne est pleine");
            } else {
                // On vérifie s'il y a un gagnant, ou si la partie est finie
                if (this.victoire(ligne, colonne, this.tours)) {
                    this.gagnant = this.tours;
                } else if (this.coups >= this.lignes * this.colonnes) {
                    this.gagnant = 0;
                }

                this.changement();

                //On met à jour l'affichage
                this.rendu()

                //On affiche le résultat
                switch (this.gagnant) {
                    case 0:
                        window.alert("Match nul!");
                        break;
                    case 1:
                        window.alert("Joueur 1 gagne");
                        break;
                    case 2:
                        window.alert("Joueur 2 gagne");
                        break;
                    default:
                        if (this.tours === 2 && adversaire === "ordinateur") {
                            this.jouerOrdinateur();
                        }
                }
            }
        }
    }

    verification(colonne) {
        let ligne;
        for (let i = 0; i < this.lignes; i++) {
            if (this.tableau[i][colonne] === 0) {
                ligne = i;
                break;
            }
        }
        if (ligne === undefined) {
            return null;
        } else {
            // Effectuer le coup
            this.animation(ligne, colonne, this.tours);
            // Renvoyer la ligne où on a joué
            return ligne;
        }
    }

    jouerOrdinateur() {
        let colonne;
        colonne = Math.floor(Math.random() * 7);
        const ligne = this.verification(colonne);
        if (ligne === null) {
            this.jouerOrdinateur();
        }
        if (this.victoire(ligne, colonne, this.tours)) {
            this.gagnant = this.tours;
        } else if (this.coups >= this.lignes * this.colonnes) {
            this.gagnant = 0;
        }
        this.changement();
        this.rendu();
        switch (this.gagnant) {
            case 0:
                window.alert("Null game!!");
                break;
            case 1:
                window.alert("Player 1 wins");
                break;
            case 2:
                window.alert("Player 2 wins");
                break;
        }
    }

    //Cette fonction est la pour définir le joueur qui joue
    changement(){
        if (this.tours === 1) {
            this.tours = 2;
        }else{
            this.tours = 1;
        }
    }

    /*
     Cette fonction vérifie si le coup dans la case `ligne`, `colonne` par
     le joueur `player` est un coup gagnant.

     Renvoie :
       true  : si la partie est gagnée par le joueur `player`
       false : si la partie continue
   */
    victoire(ligne, colonne, player) {
        // Horizontal
        let compter = 0;
        for (let j = 0; j < this.colonnes; j++) {
            compter = (this.tableau[ligne][j] == player) ? compter+1 : 0;
            if (compter >= 4) return true;
        }
        // Vertical
        compter = 0;
        for (let i = 0; i < this.lignes; i++) {
            compter = (this.tableau[i][colonne] == player) ? compter+1 : 0;
            if (compter >= 4) return true;
        }
        // Diagonal
        compter = 0;
        let shift = ligne - colonne;
        for (let i = Math.max(shift, 0); i < Math.min(this.lignes, this.colonnes + shift); i++) {
            compter = (this.tableau[i][i - shift] == player) ? compter+1 : 0;
            if (compter >= 4) return true;
        }
        // Anti-diagonal
        compter = 0;
        shift = ligne + colonne;
        for (let i = Math.max(shift - this.colonnes + 1, 0); i < Math.min(this.lignes, shift + 1); i++) {
            compter = (this.tableau[i][shift - i] == player) ? compter+1 : 0;
            if (compter >= 4) return true;
        }

        return false;
    }

    // Cette fonction vide le plateau et remet à zéro l'état
    reinitialiser() {
        for (let i = 0; i < this.lignes; i++) {
            for (let j = 0; j < this.colonnes; j++) {
                this.tableau[i][j] = 0;
            }
        }
        this.coups = 0;
        this.gagnant = null;
    }
}

// On initialise le plateau
let p4 = new Puissance4('#game');

let adversaire;
var value = document.location.href,
    params = value.split('?')[1].split('&'),
    data = {}, tmp;
for (var i = 0, l = params.length; i < l; i++) {
    tmp = params[i].split('=');
    data[tmp[0]] = tmp[1];
}
adversaire = document.getElementById('value').innerHTML = data.value;
