using Cinema.ControllerApi.Services;
using Cinema.ControllerApi.Mapping;
using Cinema.Data.Entities;
using Cinema.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Serilog;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var conn_string = builder.Configuration.GetConnectionString("Cinema") ?? 
    "Server=localhost,1433;Database=FaWoCinemaDb;User Id=sa;Password=LibraryPass1!;TrustServerCertificate=true";
builder.Services.AddDbContextFactory<CinemaDbContext>(o => o.UseSqlServer(conn_string));
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IShowtimeRepository, ShowtimeRepository>();
builder.Services.AddScoped<IShowtimeService, ShowtimeService>();

// Adding out mapping profile for AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.AddMaps(typeof(MappingProfile).Assembly));


builder.Host.UseSerilog(); // Telling the builder to use Serilog

// Adding CORS
const string SpaCorsPolicy = "spa"; // string name for our policy

// Configuring our CORS policy
builder.Services.AddCors( o=> o.AddPolicy(SpaCorsPolicy, p =>
    p.WithOrigins("http://127.0.0.1:5500")
    .AllowAnyHeader()
    .AllowAnyMethod()
));

builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Swagger stuff added to app
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
