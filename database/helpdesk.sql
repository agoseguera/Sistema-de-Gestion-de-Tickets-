-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: helpdesk
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('22f02566-e6a9-4fdf-b024-c49e520d3602','9af4d2f73cefaa9be71d26f53fc68235d546a48c151358580f6cc9b3b7abdc9f','2026-08-11 23:56:16.508','20260811214455_add_categorias_comentarios',NULL,NULL,'2026-08-11 23:56:16.266',1),('5f457452-ee80-4ccd-909c-69f1832c19fc','7769a3c2d3e14fe10ac0c06468f7aa671bd8713be57e7231d2ee7cf157252152','2026-08-11 23:56:16.263','20260811210011_init',NULL,NULL,'2026-08-11 23:56:15.972',1),('88aee282-c1c0-4eb2-ab06-e96a6f7f4b8d','42b3b77ffe700f503151372a7c887b80ceb873ded253382c758886343a3f5a8d','2026-08-11 23:56:36.747','20260811235636_add_activo',NULL,NULL,'2026-08-11 23:56:36.729',1),('e90a5d6d-15ba-4631-9b29-fbfa9478677a','fe388e40d4e63906063c21348631157e2e493e5961ca6e7c7bddcc8fa1495d70','2026-08-12 01:30:41.850','20260812013041_add_activo_usuarios',NULL,NULL,'2026-08-12 01:30:41.831',1),('ff56b88a-ab78-4e31-9a28-53b9c5b90c8f','de8f2372d930ebce31699acab9d07871735537782e206fb503a5a29a52eb0807','2026-08-12 02:53:30.747','20260812025330_add_password_usuarios',NULL,NULL,'2026-08-12 02:53:30.729',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorias_nombre_key` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (19,'Accesos'),(20,'General'),(16,'Hardware'),(18,'Redes'),(17,'Software');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `texto` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `fecha_creacion` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `comentarios_id_ticket_fkey` (`id_ticket`),
  CONSTRAINT `comentarios_id_ticket_fkey` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
INSERT INTO `comentarios` VALUES (7,'Se envió enlace temporal de activación al correo registrado. Contraseña restablecida con éxito.','Carlos Mendoza',25,'2026-08-09 12:00:00.000'),(9,'Se ha solicitado el monitor','Administrador Soporte',24,'2026-08-12 03:39:07.550'),(10,'Si se ha solicitado a administracion.','Sofía Castro',24,'2026-08-12 03:43:00.861'),(11,'Se realizó reinicio del Access Point AP-FIN-02 y se está monitoreando el tráfico.','Carlos Mendoza',22,'2026-08-11 08:35:00.000'),(12,'Listo','Carolina Ruiz',22,'2026-08-12 03:45:50.471'),(14,'Respuesta recibida , gracias.','Laura Morales',29,'2026-08-12 04:11:34.287'),(15,'Okay','Admin Soporte',29,'2026-08-12 04:12:54.271');
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_ticket`
--

DROP TABLE IF EXISTS `estado_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `estado_ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `estado_ticket_nombre_key` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_ticket`
--

LOCK TABLES `estado_ticket` WRITE;
/*!40000 ALTER TABLE `estado_ticket` DISABLE KEYS */;
INSERT INTO `estado_ticket` VALUES (13,'Abierto'),(16,'Cerrado'),(14,'En progreso'),(17,'Inválido'),(15,'Resuelto');
/*!40000 ALTER TABLE `estado_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prioridades`
--

DROP TABLE IF EXISTS `prioridades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prioridades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prioridades_nombre_key` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prioridades`
--

LOCK TABLES `prioridades` WRITE;
/*!40000 ALTER TABLE `prioridades` DISABLE KEYS */;
INSERT INTO `prioridades` VALUES (15,'Alta'),(13,'Baja'),(16,'Crítica'),(14,'Media');
/*!40000 ALTER TABLE `prioridades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` int(11) NOT NULL,
  `titulo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_prioridad` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL,
  `id_solicitante` int(11) NOT NULL,
  `id_responsable` int(11) DEFAULT NULL,
  `fecha_creacion` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `fecha_modificacion` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `id_categoria` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_numero_key` (`numero`),
  KEY `ticket_id_prioridad_fkey` (`id_prioridad`),
  KEY `ticket_id_estado_fkey` (`id_estado`),
  KEY `ticket_id_solicitante_fkey` (`id_solicitante`),
  KEY `ticket_id_responsable_fkey` (`id_responsable`),
  KEY `ticket_id_categoria_fkey` (`id_categoria`),
  CONSTRAINT `ticket_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ticket_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado_ticket` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ticket_id_prioridad_fkey` FOREIGN KEY (`id_prioridad`) REFERENCES `prioridades` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ticket_id_responsable_fkey` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_id_solicitante_fkey` FOREIGN KEY (`id_solicitante`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (22,1001,'Fallo de conexión a la red WiFi en el área de Finanzas','Los usuarios del departamento de finanzas informan intermitencia severa y desconexiones constantes de la red WiFi empresarial \"Corporate-SEC\". Afecta el cierre de mes.',16,14,36,37,'2026-08-11 08:15:00.000','2026-08-12 03:28:39.822',18,1),(23,1002,'Error al exportar reporte mensual de facturación a formato PDF','El sistema contable arroja un error 500 \"Internal Server Error\" al presionar el botón de generación de PDF para períodos superiores a 30 días.',15,14,38,39,'2026-08-10 16:30:00.000','2026-08-12 05:20:13.088',17,1),(24,1003,'Solicitud de monitor secundario de 27 pulgadas para Diseño','Se requiere aprobación de equipamiento para nuevo diseñador UI/UX. Especificaciones requeridas: Pantalla 4K IPS con puerto USB-C / DisplayPort.',14,14,40,39,'2026-08-10 14:10:00.000','2026-08-12 03:43:26.244',16,1),(25,1004,'Restablecimiento de credenciales de acceso VPN Corporativa','El usuario bloqueó la contraseña tras 3 intentos fallidos desde su dispositivo móvil institucional.',13,15,41,37,'2026-08-09 11:20:00.000','2026-08-12 03:28:39.834',19,1),(26,1005,'Licencia caducada de Adobe Creative Cloud para equipo de Marketing','Al iniciar Photoshop o Illustrator, la suite notifica expiración de suscripción corporativa y solicita renovación inmediata.',15,14,42,39,'2026-08-09 09:45:00.000','2026-08-12 03:28:39.837',17,1),(27,1006,'Configuración de impresora multifuncional de la sala de reuniones B','La impresora LaserJet pro no detecta trabajos de impresión enviados por la red de invitados y requiere asignación de IP estática.',14,15,43,44,'2026-08-08 15:00:00.000','2026-08-12 03:28:39.841',16,1),(28,1007,'Actualización de parches de seguridad en servidores de Base de Datos','Mantenimiento programado mensual de parches Linux Debian Kernel para corregir vulnerabilidades CVE.',16,16,44,44,'2026-08-05 07:00:00.000','2026-08-12 03:28:39.845',20,1),(29,1008,'Creación de cuenta de correo e inclusión en listas de distribución para nuevo ingreso','Solicitud de alta de usuario para Fernando Páez en la división de Logística con permisos en ERP.',13,16,45,37,'2026-08-04 10:30:00.000','2026-08-12 03:28:39.848',19,1),(30,1009,'Licencia de Microsoft','Necesito una licencia para poder trabajar en Word',14,17,45,44,'2026-08-12 04:10:25.401','2026-08-12 05:20:55.218',17,0);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_creacion` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (36,'María Rodríguez','maria.rodriguez@empresa.com','Solicitante','2026-08-12 03:28:39.781',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(37,'Carlos Mendoza','carlos.mendoza@soporte.com','Soporte','2026-08-12 03:28:39.790',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(38,'Alejandro Gómez','alejandro.gomez@empresa.com','Solicitante','2026-08-12 03:28:39.794',1,'$2b$10$mzHb.CH97EZTlrQx/c22D.RZgEo2W9XhlzNe2e.uYfbdWtqoA7sDG'),(39,'Sofía Castro','sofia.castro@soporte.com','Soporte','2026-08-12 03:28:39.798',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(40,'Lucía Fernández','lucia.fernandez@empresa.com','Solicitante','2026-08-12 03:28:39.802',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(41,'Jorge Martínez','jorge.martinez@empresa.com','Solicitante','2026-08-12 03:28:39.805',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(42,'Ana Belén Silva','ana.silva@empresa.com','Solicitante','2026-08-12 03:28:39.807',1,'$2b$10$N2QcwVW.efdmAOb.OxIF8eLpEt1bkUnNp87bvkBQXZHKgUo9QLRHW'),(43,'Roberto Herrera','roberto.herrera@empresa.com','Solicitante','2026-08-12 03:28:39.809',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(44,'David Torres','david.torres@soporte.com','Soporte','2026-08-12 03:28:39.813',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(45,'Laura Morales','laura.morales@empresa.com','Solicitante','2026-08-12 03:28:39.815',1,'$2b$10$6BM6P0NBbQLq5d6XbPblGOUkyvHHnQUZ.wbeBu1F4pIBB3vzwi2Fq'),(46,'Admin Soporte','carolina.ruiz@admin.com','Administrador','2026-08-12 03:28:39.817',1,'$2b$10$mIBOuRuO9Ks0sp2eKYTdSO2zroNiK1./dGRiYuWP9TOsfDsmcwk5K');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'helpdesk'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-12  0:49:43
