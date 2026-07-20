using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Cinema.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cinemas",
                columns: table => new
                {
                    Cinema_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CinemaName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    City = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cinemas", x => x.Cinema_Id);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Movie_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Genre = table.Column<byte>(type: "tinyint", nullable: false),
                    DurationMinutes = table.Column<short>(type: "smallint", nullable: false),
                    Rating = table.Column<byte>(type: "tinyint", nullable: false),
                    Synopsis = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    PosterUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Movie_Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Role_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Role_Id);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Room_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cinema_Id = table.Column<int>(type: "int", nullable: false),
                    RoomName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Capacity = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Room_Id);
                    table.ForeignKey(
                        name: "FK_Rooms_Cinemas_Cinema_Id",
                        column: x => x.Cinema_Id,
                        principalTable: "Cinemas",
                        principalColumn: "Cinema_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(256)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role_Id = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.User_Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_Role_Id",
                        column: x => x.Role_Id,
                        principalTable: "Roles",
                        principalColumn: "Role_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seats",
                columns: table => new
                {
                    Seat_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    Row = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    Number = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seats", x => x.Seat_Id);
                    table.ForeignKey(
                        name: "FK_Seats_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Showtimes",
                columns: table => new
                {
                    Showtime_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Movie_Id = table.Column<int>(type: "int", nullable: false),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    ShowDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Showtimes", x => x.Showtime_Id);
                    table.ForeignKey(
                        name: "FK_Showtimes_Movies_Movie_Id",
                        column: x => x.Movie_Id,
                        principalTable: "Movies",
                        principalColumn: "Movie_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Showtimes_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Transaction_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Showtime_Id = table.Column<int>(type: "int", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Transaction_Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Showtimes_Showtime_Id",
                        column: x => x.Showtime_Id,
                        principalTable: "Showtimes",
                        principalColumn: "Showtime_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransactionSeats",
                columns: table => new
                {
                    TransactionSeat_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Transaction_Id = table.Column<int>(type: "int", nullable: false),
                    Seat_Id = table.Column<int>(type: "int", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionSeats", x => x.TransactionSeat_Id);
                    table.ForeignKey(
                        name: "FK_TransactionSeats_Seats_Seat_Id",
                        column: x => x.Seat_Id,
                        principalTable: "Seats",
                        principalColumn: "Seat_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionSeats_Transactions_Transaction_Id",
                        column: x => x.Transaction_Id,
                        principalTable: "Transactions",
                        principalColumn: "Transaction_Id");
                });

            migrationBuilder.InsertData(
                table: "Cinemas",
                columns: new[] { "Cinema_Id", "Address", "CinemaName", "City" },
                values: new object[,]
                {
                    { 1, "Av. Aviación 3800, San Juan de Ocotán, 45019", "FAWO Guadalajara", (short)35 },
                    { 2, "133, P.º de los Héroes 9550, Zona Urbana Rio Tijuana, 22320", "FAWO Tijuana", (short)3 },
                    { 3, "Perif. Luis Echeverría 1474, Lourdes, 25070", "FAWO Saltillo", (short)15 },
                    { 4, "Granada, Miguel Hidalgo, 11520", "FAWO Ciudad de México", (short)14 }
                });

            migrationBuilder.InsertData(
                table: "Movies",
                columns: new[] { "Movie_Id", "DurationMinutes", "Genre", "PosterUrl", "Rating", "Synopsis", "Title" },
                values: new object[,]
                {
                    { 1, (short)157, (byte)8, "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_FMjpg_UY2902_.jpg", (byte)2, "Adaptation of the first of J.K. Rowling's popular children's novels about Harry Potter, a boy who learns on his eleventh birthdaythat he is the orphaned son of two powerful wizards and possesses unique magical powers of his own. He is summoned from his life as an unwantedchild to become a student at Hogwarts, an English boarding school for wizards. There, he meets several friends who become his closest allies andhelp him discover the truth about his parents' mysterious deaths.", "Harry Potter and the Sorcerer's Stone" },
                    { 2, (short)150, (byte)8, "https://m.media-amazon.com/images/M/MV5BMTc0NTUwMTU5OV5BMl5BanBnXkFtZTcwNjAwNzQzMw@@._V1_QL75_UY562_CR0,0,380,562_.jpg", (byte)2, "During the World War II bombings of London, four English siblings are sent to a country house where they will be safe. One day Lucy (Georgie Henley)finds a wardrobe that transports her to a magical world called Narnia. After coming back, she soon returns to Narnia with her brothers, Peter (William Moseley)and Edmund (Skandar Keynes), and her sister, Susan (Anna Popplewell). There they join the magical lion, Aslan (Liam Neeson), in the fight against the evil White Witch, Jadis (Tilda Swinton).", "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe" },
                    { 3, (short)134, (byte)4, "https://m.media-amazon.com/images/M/MV5BOTRkMDlmZWEtMzQyYy00YzgyLTgwM2QtNzgxYmIwNGVlYmJlXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg", (byte)4, "In 1977, paranormal investigators Ed (Patrick Wilson) and Lorraine Warren come out of a self-imposed sabbatical to travel to Enfield,a borough in north London. There, they meet Peggy Hodgson, an overwhelmed single mother of four who tells the couple that something evil is in her home.Ed and Lorraine believe her story when the youngest daughter starts to show signs of demonic possession. As the Warrens try to help the besieged girl,they become the next targets of the malicious spirit.", "The Conjuring 2" },
                    { 4, (short)117, (byte)6, "https://m.media-amazon.com/images/M/MV5BNTI4ZWQ5YjYtMmYwMy00OWFmLWFmNDYtZGNlNWMxNTllZjc4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg", (byte)3, "Noah has to leave her town, boyfriend and friends behind and move into the mansion of her mother's new rich husband. There she meets Nick,her new stepbrother. She soon discovers that, behind the image of a model son, Nick is hiding something.", "My Fault" },
                    { 5, (short)106, (byte)2, "https://m.media-amazon.com/images/M/MV5BMTQ1OTU0ODcxMV5BMl5BanBnXkFtZTcwOTMxNTUwOA@@._V1_QL75_UX380_CR0,20,380,562_.jpg", (byte)4, "When John Bennett (Mark Wahlberg) was a little boy, he made a wish that Ted (Seth MacFarlane), his beloved teddy bear, would come alive.Thirty years later, foul-mouthed Ted is still John's constant companion, much to the chagrin of Lori (Mila Kunis), John's girlfriend. Though Lori'sdispleasure is exacerbated by the pair's constant consumption of beer and weed, she's not the one who's most disappointed with John; it may takethe intervention of John's boyhood toy to help him grow up at last.", "Ted" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Role_Id", "RoleName" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Consumer" }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Room_Id", "Capacity", "Cinema_Id", "RoomName" },
                values: new object[,]
                {
                    { 1, (byte)150, 4, "IMAX Lounge" },
                    { 2, (byte)165, 1, "IMAX Lounge" },
                    { 3, (byte)64, 1, "VIP Lounge" },
                    { 4, (byte)120, 2, "A Lounge" },
                    { 5, (byte)120, 3, "B Lounge" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "User_Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role_Id", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Fran@mail.com", "Francesco Totti", "$argon2id$v=19$m=65536,t=4,p=8$aFQxVzBGWEQwVnprM2lHbw$crbzfKlT7lflD3QFxH0LSUGapiuoY3Nu2an3OvFvXbQ", 2, "Fran34J" },
                    { 2, new DateTime(2026, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rob@mail.com", "Roberto Baggio", "$argon2id$v=19$m=65536,t=4,p=8$dHlRS1M2Qng2eVl6a016eg$OoY2yrwFm6MC0wGW5cOWzmFloe9i9/cKb+wUeTl1Mik", 1, "Rob94" }
                });

            migrationBuilder.InsertData(
                table: "Seats",
                columns: new[] { "Seat_Id", "Number", "Room_Id", "Row" },
                values: new object[,]
                {
                    { 1, (byte)1, 1, "A" },
                    { 2, (byte)2, 1, "A" },
                    { 3, (byte)3, 1, "A" },
                    { 4, (byte)4, 1, "A" },
                    { 5, (byte)5, 1, "A" },
                    { 6, (byte)1, 1, "B" },
                    { 7, (byte)2, 1, "B" },
                    { 8, (byte)3, 1, "B" },
                    { 9, (byte)4, 1, "B" },
                    { 10, (byte)5, 1, "B" },
                    { 11, (byte)1, 1, "C" },
                    { 12, (byte)2, 1, "C" },
                    { 13, (byte)3, 1, "C" },
                    { 14, (byte)4, 1, "C" },
                    { 15, (byte)5, 1, "C" },
                    { 16, (byte)1, 1, "D" },
                    { 17, (byte)2, 1, "D" },
                    { 18, (byte)3, 1, "D" },
                    { 19, (byte)4, 1, "D" },
                    { 20, (byte)5, 1, "D" },
                    { 21, (byte)1, 1, "E" },
                    { 22, (byte)2, 1, "E" },
                    { 23, (byte)3, 1, "E" },
                    { 24, (byte)4, 1, "E" },
                    { 25, (byte)5, 1, "E" },
                    { 26, (byte)1, 2, "A" },
                    { 27, (byte)2, 2, "A" },
                    { 28, (byte)3, 2, "A" },
                    { 29, (byte)4, 2, "A" },
                    { 30, (byte)5, 2, "A" },
                    { 31, (byte)1, 2, "B" },
                    { 32, (byte)2, 2, "B" },
                    { 33, (byte)3, 2, "B" },
                    { 34, (byte)4, 2, "B" },
                    { 35, (byte)5, 2, "B" },
                    { 36, (byte)1, 2, "C" },
                    { 37, (byte)2, 2, "C" },
                    { 38, (byte)3, 2, "C" },
                    { 39, (byte)4, 2, "C" },
                    { 40, (byte)5, 2, "C" },
                    { 41, (byte)1, 2, "D" },
                    { 42, (byte)2, 2, "D" },
                    { 43, (byte)3, 2, "D" },
                    { 44, (byte)4, 2, "D" },
                    { 45, (byte)5, 2, "D" },
                    { 46, (byte)1, 2, "E" },
                    { 47, (byte)2, 2, "E" },
                    { 48, (byte)3, 2, "E" },
                    { 49, (byte)4, 2, "E" },
                    { 50, (byte)5, 2, "E" },
                    { 51, (byte)1, 3, "A" },
                    { 52, (byte)2, 3, "A" },
                    { 53, (byte)3, 3, "A" },
                    { 54, (byte)4, 3, "A" },
                    { 55, (byte)5, 3, "A" },
                    { 56, (byte)1, 3, "B" },
                    { 57, (byte)2, 3, "B" },
                    { 58, (byte)3, 3, "B" },
                    { 59, (byte)4, 3, "B" },
                    { 60, (byte)5, 3, "B" },
                    { 61, (byte)1, 3, "C" },
                    { 62, (byte)2, 3, "C" },
                    { 63, (byte)3, 3, "C" },
                    { 64, (byte)4, 3, "C" },
                    { 65, (byte)5, 3, "C" },
                    { 66, (byte)1, 3, "D" },
                    { 67, (byte)2, 3, "D" },
                    { 68, (byte)3, 3, "D" },
                    { 69, (byte)4, 3, "D" },
                    { 70, (byte)5, 3, "D" },
                    { 71, (byte)1, 3, "E" },
                    { 72, (byte)2, 3, "E" },
                    { 73, (byte)3, 3, "E" },
                    { 74, (byte)4, 3, "E" },
                    { 75, (byte)5, 3, "E" },
                    { 76, (byte)1, 4, "A" },
                    { 77, (byte)2, 4, "A" },
                    { 78, (byte)3, 4, "A" },
                    { 79, (byte)4, 4, "A" },
                    { 80, (byte)5, 4, "A" },
                    { 81, (byte)1, 4, "B" },
                    { 82, (byte)2, 4, "B" },
                    { 83, (byte)3, 4, "B" },
                    { 84, (byte)4, 4, "B" },
                    { 85, (byte)5, 4, "B" },
                    { 86, (byte)1, 4, "C" },
                    { 87, (byte)2, 4, "C" },
                    { 88, (byte)3, 4, "C" },
                    { 89, (byte)4, 4, "C" },
                    { 90, (byte)5, 4, "C" },
                    { 91, (byte)1, 4, "D" },
                    { 92, (byte)2, 4, "D" },
                    { 93, (byte)3, 4, "D" },
                    { 94, (byte)4, 4, "D" },
                    { 95, (byte)5, 4, "D" },
                    { 96, (byte)1, 4, "E" },
                    { 97, (byte)2, 4, "E" },
                    { 98, (byte)3, 4, "E" },
                    { 99, (byte)4, 4, "E" },
                    { 100, (byte)5, 4, "E" },
                    { 101, (byte)1, 5, "A" },
                    { 102, (byte)2, 5, "A" },
                    { 103, (byte)3, 5, "A" },
                    { 104, (byte)4, 5, "A" },
                    { 105, (byte)5, 5, "A" },
                    { 106, (byte)1, 5, "B" },
                    { 107, (byte)2, 5, "B" },
                    { 108, (byte)3, 5, "B" },
                    { 109, (byte)4, 5, "B" },
                    { 110, (byte)5, 5, "B" },
                    { 111, (byte)1, 5, "C" },
                    { 112, (byte)2, 5, "C" },
                    { 113, (byte)3, 5, "C" },
                    { 114, (byte)4, 5, "C" },
                    { 115, (byte)5, 5, "C" },
                    { 116, (byte)1, 5, "D" },
                    { 117, (byte)2, 5, "D" },
                    { 118, (byte)3, 5, "D" },
                    { 119, (byte)4, 5, "D" },
                    { 120, (byte)5, 5, "D" },
                    { 121, (byte)1, 5, "E" },
                    { 122, (byte)2, 5, "E" },
                    { 123, (byte)3, 5, "E" },
                    { 124, (byte)4, 5, "E" },
                    { 125, (byte)5, 5, "E" }
                });

            migrationBuilder.InsertData(
                table: "Showtimes",
                columns: new[] { "Showtime_Id", "EndTime", "Movie_Id", "Price", "Room_Id", "ShowDate", "StartTime" },
                values: new object[,]
                {
                    { 1, new TimeOnly(20, 12, 0), 1, 4.99m, 5, new DateOnly(2026, 7, 22), new TimeOnly(17, 35, 0) },
                    { 2, new TimeOnly(23, 14, 0), 3, 3.99m, 4, new DateOnly(2026, 7, 23), new TimeOnly(21, 0, 0) },
                    { 3, new TimeOnly(22, 25, 0), 2, 4.99m, 3, new DateOnly(2026, 7, 25), new TimeOnly(19, 55, 0) },
                    { 4, new TimeOnly(17, 3, 0), 4, 6.29m, 2, new DateOnly(2026, 7, 24), new TimeOnly(15, 5, 0) },
                    { 5, new TimeOnly(22, 11, 0), 5, 7.59m, 5, new DateOnly(2026, 7, 22), new TimeOnly(20, 25, 0) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cinemas_CinemaName",
                table: "Cinemas",
                column: "CinemaName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Cinema_Id",
                table: "Rooms",
                column: "Cinema_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_Room_Id",
                table: "Seats",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Showtimes_Movie_Id",
                table: "Showtimes",
                column: "Movie_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Showtimes_Room_Id",
                table: "Showtimes",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_Showtime_Id",
                table: "Transactions",
                column: "Showtime_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_User_Id",
                table: "Transactions",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionSeats_Seat_Id",
                table: "TransactionSeats",
                column: "Seat_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionSeats_Transaction_Id",
                table: "TransactionSeats",
                column: "Transaction_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role_Id",
                table: "Users",
                column: "Role_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TransactionSeats");

            migrationBuilder.DropTable(
                name: "Seats");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Showtimes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Cinemas");
        }
    }
}
