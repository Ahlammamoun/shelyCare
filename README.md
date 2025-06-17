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
## react
### npx create-react-app frontend


## symfony
### composer create-project symfony/skeleton backend

## créer un dockerfile la racine du front et un à la racine du back
### dockerfile.yml

## créer un docker-compose.yml à la racine du projet
### docker-compose.yml

## nginx, créer un repertoire nginx et un fichier default.config
### default.config


## démarrer et stoper les container 
### docker compose down
### docker compose up -d --build

## redémarrer un container 
### docker compose restart symfony-backend-sc


# base de donnée
## installer les outils qui permettent de créer les entités ...
### composer require symfony/orm-pack
### composer require --dev symfony/maker-bundle
### composer require symfony/maker-bundle --dev

## entrée dans le container back
### docker compose exec symfony-backend-sc bash

## entrée dans le container mysql 
### docker compose exec mysql-sc mysql -uroot -proot symfony

## vérifier les logs d'un container 
### docker compose logs symfony-backend-sc

## vérifier les container

## commande pour créer une entité
### php bin/console make:entity

## générer une migration
### php bin/console make:migration

## lancer la migration
### php bin/console doctrine:migrations:migrate

## créer un controller
### php bin/console make:controller Api/ProductController


## pour le upload installer pour deviner les extension du fichier 
### composer require symfony/mime



# Module de paiement Stripe / des commandes et paniers 
## Ajout du champ stripe dans l'entité order

###   #[ORM\Column(length: 255, nullable: true)]
###   private ?string $stripeSessionId = null;

## et les methodes 
#  public function getStripeSessionId(): ?string
# {
#    return $this->stripeSessionId;
# }

# public function setStripeSessionId(?string $stripeSessionId): static
# {
#  $this->stripeSessionId = $stripeSessionId;
#    return $this;
# }   

## installation de stripe php sdk
### composer require stripe/stripe-php