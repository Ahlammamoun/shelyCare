FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony

# Copier uniquement les fichiers nécessaires à l'installation
COPY composer.json composer.lock ./

# Installer les dépendances sans exécuter Symfony (évite l'erreur Dotenv)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copier le reste de l'app
COPY . .

# Laisser Symfony gérer le cache au démarrage
CMD ["php", "-S", "0.0.0.0:9000", "-t", "public"]

