<h1 style="font-size: 50px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    Fantasy World Cinema
</h1>
<h3 style="font-size: 15px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    Team 4
    <br>
    <span>Samuel Pérez Alfaro</span> — 
    <span>Jesús Eduardo Quintero Gómez</span> — 
    <span>Francisco Jiménez Vital</span>
    <br><br>
</h3>


<h1 style="font-size: 15px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    <br><br>
    Description
</h1>

## Fantasy World Cinema is a platform for managing and selling tickets for movie screenings. The system's catalog consists of a combination of movie, screening date, theater, and available seats, allowing moviegoers to purchase tickets for a specific screening. In addition, box office staff can manage sales, check seat availability, and manage operational information for each screening.



<h1 style="font-size: 15px; font-weight: bold; color: #0076ff; margin-bottom: 20px; text-align: center;">
    <br><br><br><br><br>
    Configuration Guide | (Below is only a Blueprint)
</h1>

# Solution + the two projects (ControllerAPI host, EF Core class library)
- dotnet new sln -n Cinema
- dotnet new classlib -n Cinema.Data
- dotnet new webapi -o Cinema.ControllerApi --use-controllers
- dotnet new gitignore

    ## Connect projects eachother
    - dotnet sln add Cinema.ControllerApi Cinema.Data
    - dotnet add Cinema.ControllerApi reference Cinema.Data

# Packages for Data Layout (Cinema.Data)
- dotnet add Cinema.Data package Microsoft.EntityFrameworkCore.SqlServer
- dotnet add Cinema.Data package Microsoft.EntityFrameworkCore.Design

# Packages for API host Layout (Cinema.ControllerApi)
- dotnet add Cinema.ControllerApi package Microsoft.EntityFrameworkCore.Design
- dotnet add Cinema.ControllerApi package Serilog.AspNetCore
- dotnet add Cinema.ControllerApi package Swashbuckle.AspNetCore

- - - 
# React project (WebSpa Front-end, JS template)
- npm create vite@latest Cinema.WebSpa -- --template react-ts
    ## To download dependencies 
    - cd Cinema.WebSpa/
    - npm install
    ### To view page running
        npm run dev


- - -
# To create a service in docker Only for new DB services:
* We're not use this command because We reuse the Library server
    - docker run -d --name librarysqlserver -p 1433:1433 \ -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='LibraryPassword1!' \ mcr.microsoft.com/mssql/server:2022-latest

    ## To start Docker - Directly on Docker Desktop
    - docker start librarysqlserver
- - -

# First Migration
- Create & Apply
    ## 1. Crear el diseño de la migración inicial leyendo las entidades
    - dotnet ef migrations add InitialCreate --project Cinema.Data --startup-project Cinema.ControllerApi
    ## 2. Aplicar el diseño y crear físicamente las tablas en SQL Server
    - dotnet ef database update --project Cinema.Data --startup-project Cinema.ControllerApi
