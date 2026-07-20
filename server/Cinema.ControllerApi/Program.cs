using Cinema.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var conn_string = builder.Configuration.GetConnectionString("Cinema") ?? 
    "Server=localhost,1433;Database=FaWoCinemaDb;User Id=sa;Password=LibraryPass1!;TrustServerCertificate=true";
builder.Services.AddDbContextFactory<CinemaDbContext>(o => o.UseSqlServer(conn_string));
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
