#!/bin/bash

# Nom de l'utilisateur à créer
USER_NAME="githubactions"

# Créer un nouvel utilisateur
sudo adduser --quiet --disabled-password --shell /bin/bash --home /home/$USER_NAME --gecos "User" $USER_NAME

# Définir un mot de passe pour le nouvel utilisateur
echo "$USER_NAME:password" | sudo chpasswd

# Changer d'utilisateur
su - $USER_NAME

# Générer une nouvelle paire de clés SSH pour cet utilisateur
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f $HOME/.ssh/id_rsa -q -N ""

# Autoriser la clé publique pour les connexions SSH
cat $HOME/.ssh/id_rsa.pub >> $HOME/.ssh/authorized_keys

# Afficher la clé privée
cat $HOME/.ssh/id_rsa