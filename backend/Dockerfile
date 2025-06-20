FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    zip unzip git curl libzip-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/symfony

COPY . .

RUN composer install --no-dev --optimize-autoloader \
    && composer dump-env prod \
    && php bin/console cache:clear --env=prod --no-debug \
    && php bin/console cache:warmup --env=prod --no-debug

CMD ["php", "-S", "0.0.0.0:9000", "-t", "public"]


