using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinema.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeShowtimeDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 7,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 30));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 7,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 28));
        }
    }
}
