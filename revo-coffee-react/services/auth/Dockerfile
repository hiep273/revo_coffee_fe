FROM php:8.2-apache

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Set document root
ENV APACHE_DOCUMENT_ROOT /var/www/html
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 8001

# Update Apache to listen on port 8001
RUN sed -i 's/Listen 80/Listen 8001/' /etc/apache2/ports.conf
RUN sed -i 's/:80/:8001/' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]

