<h1 style="font-size: 50px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    Configuration Guide: GymBooking
</h1>
<h3 style="font-size: 15px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    Team 4
    <br>
    <span>Samuel Pérez Alfaro</span> — 
    <span>Jesús Eduardo Quintero Gómez</span> — 
    <span>Francisco Jiménez Vital</span>
    <br><br>
</h3>

# Solution + the two projects (ControllerAPI host, EF Core class library)
- dotnet new sln -n GymBooking
- dotnet new classlib -n GymBooking.Data
- dotnet new webapi -o GymBooking.ControllerApi --use-controllers
- dotnet new gitignore

    ## Connect projects eachother
    - dotnet sln add GymBooking.ControllerApi GymBooking.Data
    - dotnet add GymBooking.ControllerApi reference GymBooking.Data

# Packages for Data Layout (GymBooking.Data)
- dotnet add GymBooking.Data package Microsoft.EntityFrameworkCore.SqlServer
- dotnet add GymBooking.Data package Microsoft.EntityFrameworkCore.Design

# Packages for API host Layout (GymBooking.ControllerApi)
- dotnet add GymBooking.ControllerApi package Microsoft.EntityFrameworkCore.Design
- dotnet add GymBooking.ControllerApi package Serilog.AspNetCore
- dotnet add GymBooking.ControllerApi package Swashbuckle.AspNetCore

- - - 
# React project (WebSpa Front-end, JS template)
- npm create vite@latest GymBooking.WebSpa -- --template react
    ## To download dependencies 
    - cd GymBooking.WebSpa/
    - npm install
    ### To view page running
        npm run dev


- - -
# To create a service in docker Only for new DB services:
* We're not use this command because We reuse the Library server
    - docker run -d --name librarysqlserver -p 1433:1433 \ -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='adminPass1!' \ mcr.microsoft.com/mssql/server:2022-latest

    ## To start Docker - Directly on Docker Desktop
    - docker start librarysqlserver
- - -

# First Migration
- Create & Apply
    ## 1. Crear el diseño de la migración inicial leyendo las entidades
    - dotnet ef migrations add InitialCreate --project GymBooking.Data --startup-project GymBooking.ControllerApi
    ## 2. Aplicar el diseño y crear físicamente las tablas en SQL Server
    - dotnet ef database update --project GymBooking.Data --startup-project GymBooking.ControllerApi
