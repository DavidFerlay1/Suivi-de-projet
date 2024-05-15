FROM php:8.2.17-fpm

RUN apt-get update && apt-get install zip unzip git -y

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-setup.php

RUN docker-php-ext-install pdo_mysql

RUN useradd -m symf
USER symf:1000

WORKDIR /home/symf