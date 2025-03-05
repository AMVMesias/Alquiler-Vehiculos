# CarExpress
# Alquiler de Vehículos

## Descripción del Proyecto

Este proyecto consiste en un sistema de gestión para una empresa de alquiler de vehículos. La aplicación está desarrollada en ASP.NET Core 8.0, siguiendo una arquitectura de capas que permite una clara separación de responsabilidades y facilita el mantenimiento y escalabilidad del código.

## Estructura del Proyecto

La solución está organizada siguiendo un patrón de arquitectura en capas:

### Capas de la Aplicación

- **Capa de Presentación (Alquiler de Vehículos)**
  - Interfaz de usuario implementada con ASP.NET Core MVC.
  - Contiene controladores, vistas y modelos de presentación.
  - Gestiona la interacción con los usuarios finales.

- **Capa de Negocio (CapaNegocio)**
  - Implementa las reglas de negocio y la lógica de la aplicación.
  - Coordina el flujo de datos entre la capa de presentación y la capa de datos.
  - Proporciona servicios para todas las operaciones comerciales.

- **Capa de Datos (CapaDatos)**
  - Gestiona la persistencia y recuperación de datos.
  - Contiene clases DAL (Data Access Layer) para cada entidad.
  - Implementa la comunicación con la base de datos SQL Server.

- **Capa de Entidades (CapaEntidad)**
  - Define las clases de entidad que representan los objetos de negocio.
  - Implementa modelos de datos utilizados en toda la aplicación.

## Controladores Principales

El sistema cuenta con varios controladores para gestionar diferentes aspectos del negocio:

- `HomeController`: Gestiona la navegación principal y páginas básicas.
- `ClienteController`: Administración de clientes.
- `EmpleadoController`: Gestión del personal de la empresa.
- `VehiculoController`: Control del inventario de vehículos.
- `ReservaController`: Manejo de reservas y alquileres.
- `SeguroController`: Gestión de pólizas de seguros.

## Tecnologías Utilizadas

- **Framework**: ASP.NET Core 8.0
- **Lenguaje de Programación**: C#
- **Base de Datos**: SQL Server
- **Patrón Arquitectónico**: MVC (Model-View-Controller)
- **Gestión de Dependencias**: Microsoft.Extensions.Configuration
- **Acceso a Datos**: System.Data.SqlClient

## Requisitos del Sistema

- .NET 8.0 SDK o superior.
- SQL Server.
- Visual Studio 2022 o superior (recomendado para desarrollo).

## Configuración y Despliegue

La aplicación está configurada para ejecutarse en:

- **HTTP**: `http://localhost:5215`
- **HTTPS**: `https://localhost:7105`

El entorno de desarrollo utiliza IIS Express con la configuración definida en el archivo de propiedades de lanzamiento.
