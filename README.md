my-app/
│
├── backend/             # Symfony app
├── frontend/            # React app
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   └── Dockerfile
│   └── mysql/
│
├── docker-compose.yml
└── README.md



# installation des service dans l'application, à la racine du projet
# react
### npx create-react-app frontend
#### dockerfile

# symfony
### composer create-project symfony/skeleton backend
#### dockerfile

## docker-compose.yml

# nginx
### default.config

# base de donnée
## installer les outils qui permettent de créer les entités ...
### composer require symfony/orm-pack
### composer require --dev symfony/maker-bundle
### composer require symfony/maker-bundle --dev
## entrée dans le container back
#### docker compose exec symfony-backend-sc bash

#### php bin/console make:entity


