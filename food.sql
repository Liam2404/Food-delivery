CREATE TABLE `client`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email_address` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_admin` BOOLEAN NOT NULL
);
CREATE TABLE `meal`(
    `meal_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `meal_name` VARCHAR(255) NOT NULL,
    `meal_description` VARCHAR(255) NOT NULL,
    `meal_price` DECIMAL(8, 2) NOT NULL,
    `meal_img` BLOB NOT NULL
);
CREATE TABLE `restaurant`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `food_type` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `delivery_time` TIME NOT NULL,
    `meal_id` BIGINT NOT NULL,
    `email_address` VARCHAR(255) NOT NULL,
    `restaurant_img` BLOB NOT NULL
);
ALTER TABLE
    `restaurant` ADD CONSTRAINT `restaurant_meal_id_foreign` FOREIGN KEY(`meal_id`) REFERENCES `meal`(`meal_id`);