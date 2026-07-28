using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cinema.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedingMoreShowtimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Showtimes",
                columns: new[] { "Showtime_Id", "EndTime", "Movie_Id", "Price", "Room_Id", "ShowDate", "StartTime" },
                values: new object[,]
                {
                    { 6, new TimeOnly(22, 11, 0), 1, 7.59m, 2, new DateOnly(2026, 7, 28), new TimeOnly(20, 25, 0) },
                    { 7, new TimeOnly(0, 56, 0), 2, 4.99m, 3, new DateOnly(2026, 7, 28), new TimeOnly(22, 45, 0) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 7);
        }
    }
}
