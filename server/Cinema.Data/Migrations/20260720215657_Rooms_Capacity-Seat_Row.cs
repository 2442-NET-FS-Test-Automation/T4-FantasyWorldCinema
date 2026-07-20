using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cinema.Data.Migrations
{
    /// <inheritdoc />
    public partial class Rooms_CapacitySeat_Row : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Row",
                table: "Seats",
                type: "char(1)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1)");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 1,
                column: "Capacity",
                value: (byte)25);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 2,
                column: "Capacity",
                value: (byte)25);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 3,
                column: "Capacity",
                value: (byte)25);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 4,
                column: "Capacity",
                value: (byte)25);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 5,
                column: "Capacity",
                value: (byte)25);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Row",
                table: "Seats",
                type: "nvarchar(1)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "char(1)");

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 1,
                column: "Capacity",
                value: (byte)150);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 2,
                column: "Capacity",
                value: (byte)165);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 3,
                column: "Capacity",
                value: (byte)64);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 4,
                column: "Capacity",
                value: (byte)120);

            migrationBuilder.UpdateData(
                table: "Rooms",
                keyColumn: "Room_Id",
                keyValue: 5,
                column: "Capacity",
                value: (byte)120);
        }
    }
}
