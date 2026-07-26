using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinema.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShowtimesDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 1,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 29));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 2,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 29));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 3,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 30));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 4,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 30));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 5,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 28));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 1,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 22));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 2,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 23));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 3,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 25));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 4,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 24));

            migrationBuilder.UpdateData(
                table: "Showtimes",
                keyColumn: "Showtime_Id",
                keyValue: 5,
                column: "ShowDate",
                value: new DateOnly(2026, 7, 22));
        }
    }
}
