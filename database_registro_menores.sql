-- MySQL Script generated by MySQL Workbench
-- Thu Nov 21 10:51:37 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema clinica_menores
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema clinica_menores
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clinica_menores` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `clinica_menores` ;

-- -----------------------------------------------------
-- Table `clinica_menores`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_menores`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(100) NOT NULL,
  `numero_documento` VARCHAR(50) NOT NULL,
  `usuario` VARCHAR(50) NULL DEFAULT NULL,
  `contrasena` VARCHAR(255) NULL DEFAULT NULL,
  `rol` ENUM('Administrador', 'Vigilante') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `numero_documento` (`numero_documento` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clinica_menores`.`pacientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_menores`.`pacientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_menor` VARCHAR(100) NOT NULL,
  `apellidos_menor` VARCHAR(100) NOT NULL,
  `numero_manilla` VARCHAR(50) NOT NULL,
  `edad` INT NOT NULL,
  `genero_menor` ENUM('M', 'F') NOT NULL,
  `tipo_documento_menor` ENUM('R.C', 'T.I', 'A.N') NOT NULL,
  `numero_documento_menor` VARCHAR(50) NOT NULL,
  `nacionalidad_menor` ENUM('Colombiana', 'Extranjera') NOT NULL,
  `nombres_acompanante` VARCHAR(100) NOT NULL,
  `tipo_documento_acompanante` ENUM('C.C', 'P.P', 'C.E') NOT NULL,
  `numero_documento_acompanante` VARCHAR(50) NOT NULL,
  `parentesco` ENUM('Padre', 'Madre', 'Abuelo', 'Tío', 'Hermano', 'Otro') NOT NULL,
  `genero_acompanante` ENUM('M', 'F') NOT NULL,
  `nacionalidad_acompanante` ENUM('Colombiana', 'Extranjera') NOT NULL,
  `fecha_ingreso` DATETIME NOT NULL,
  `fecha_salida` DATETIME NULL DEFAULT NULL,
  `entrada` ENUM('Consulta externa', 'Urgencias', 'Cafeteria') NOT NULL,
  `salida` ENUM('Consulta externa', 'Urgencias', 'Cafeteria') NULL DEFAULT NULL,
  `vigilante_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `numero_manilla` (`numero_manilla` ASC) VISIBLE,
  INDEX `fk_paciente_vigilante` (`vigilante_id` ASC) VISIBLE,
  CONSTRAINT `fk_paciente_vigilante`
    FOREIGN KEY (`vigilante_id`)
    REFERENCES `clinica_menores`.`usuarios` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 29
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
