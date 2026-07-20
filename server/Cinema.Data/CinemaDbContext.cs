using Microsoft.EntityFrameworkCore;
using Cinema.Data.Entities;

namespace Cinema.Data;

public class CinemaDbContext : DbContext
{
    // Constructor
    public CinemaDbContext(DbContextOptions<CinemaDbContext> options) : base ( options){ }

    // Setting Entities DbSets
    public DbSet<Cinemas> Cinemas => Set<Cinemas>();
    public DbSet<Movies> Movies => Set<Movies>();
    public DbSet<Roles> Roles => Set<Roles>();
    public DbSet<Rooms> Rooms => Set<Rooms>();
    public DbSet<Seats> Seats => Set<Seats>();
    public DbSet<Showtimes> Showtimes => Set<Showtimes>();
    public DbSet<Transactions> Transactions => Set<Transactions>();
    public DbSet<TransactionSeats> TransactionSeats => Set<TransactionSeats>();
    public DbSet<Users> Users => Set<Users>();


    protected override void OnModelCreating(ModelBuilder b)
    {
        
        // ---------- SETTING TABLE RELATIONSHIPS ------------------
        // Users Relations
        b.Entity<Users>().HasOne(u => u.Role)
            .WithMany(r => r.users)
            .HasForeignKey(u => u.Role_Id);
        
        // Transactions Relations
        b.Entity<Transactions>().HasOne(t => t.User)
            .WithMany(u => u.transactions)
            .HasForeignKey(t => t.User_Id);

        b.Entity<Transactions>().HasOne(t => t.Showtime)
            .WithMany(s => s.transactions)
            .HasForeignKey(t => t.Showtime_Id);

        // Showtimes Relations
        b.Entity<Showtimes>().HasOne(s => s.Movie)
            .WithMany(m => m.showtimes)
            .HasForeignKey(s => s.Movie_Id);

        b.Entity<Showtimes>().HasOne(s => s.Room)
            .WithMany(r => r.showtimes)
            .HasForeignKey(s => s.Room_Id);

        // Rooms Relations
        b.Entity<Rooms>().HasOne(r => r.Cinema)
            .WithMany(c => c.rooms)
            .HasForeignKey(r => r.Cinema_Id);
        
        // Seats Relations
        b.Entity<Seats>().HasOne(s => s.Room)
            .WithMany(r => r.seats)
            .HasForeignKey(s => s.Room_Id);

        // TransactionSeats Relations
        b.Entity<TransactionSeats>().HasOne(ts => ts.Seat)
            .WithMany(s => s.transactionSeats)
            .HasForeignKey(ts => ts.Seat_Id);
        
        b.Entity<TransactionSeats>().HasOne(ts => ts.Transaction)
            .WithMany(t => t.transactionSeats)
            .HasForeignKey(ts => ts.Transaction_Id)
            .OnDelete(DeleteBehavior.NoAction);;

        // Setting Row Version's properties
        b.Entity<Transactions>().Property(i => i.RowVersion).IsRowVersion();
        b.Entity<TransactionSeats>().Property(i => i.RowVersion).IsRowVersion();

        // Setting Unique Values
        b.Entity<Users>().HasIndex(i => i.Username).IsUnique();
        b.Entity<Users>().HasIndex(i => i.Email).IsUnique();
        b.Entity<Cinemas>().HasIndex(i => i.CinemaName).IsUnique();

        // Setting specific data types
        b.Entity<Users>().Property(u => u.PasswordHash).HasColumnType("varchar(256)");
        b.Entity<Cinemas>().Property(c => c.City).HasColumnType("smallint");
        b.Entity<Rooms>().Property(r => r.Capacity).HasColumnType("tinyint");
        b.Entity<Movies>().Property(m => m.Genre).HasColumnType("tinyint");
        b.Entity<Movies>().Property(m => m.DurationMinutes).HasColumnType("smallint");
        b.Entity<Movies>().Property(m => m.Rating).HasColumnType("tinyint");
        b.Entity<Seats>().Property(s => s.Number).HasColumnType("tinyint");
        b.Entity<Seats>().Property(s => s.Row).HasColumnType("char(1)");
        b.Entity<Transactions>().Property(t => t.Status).HasColumnType("tinyint");

        // Data Seeding

        b.Entity<Cinemas>().HasData(
            new Cinemas {Cinema_Id = 1, CinemaName = "FAWO Guadalajara", Address = "Av. Aviación 3800, San Juan de Ocotán, 45019", City = City.Guadalajara},
            new Cinemas {Cinema_Id = 2, CinemaName = "FAWO Tijuana", Address = "133, P.º de los Héroes 9550, Zona Urbana Rio Tijuana, 22320", City = City.Tijuana},
            new Cinemas {Cinema_Id = 3, CinemaName = "FAWO Saltillo", Address = "Perif. Luis Echeverría 1474, Lourdes, 25070", City = City.Saltillo},
            new Cinemas {Cinema_Id = 4, CinemaName = "FAWO Ciudad de México", Address = "Granada, Miguel Hidalgo, 11520", City = City.CiudadDeMexico}
        );

        b.Entity<Movies>().HasData(
            new Movies { Movie_Id = 1, Title = "Harry Potter and the Sorcerer's Stone", Genre = Genre.Fantasy, DurationMinutes = 157, Rating = Rating.PG, 
                Synopsis = "Adaptation of the first of J.K. Rowling's popular children's novels about Harry Potter, a boy who learns on his eleventh birthday" +
                "that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own. He is summoned from his life as an unwanted" +
                "child to become a student at Hogwarts, an English boarding school for wizards. There, he meets several friends who become his closest allies and" +
                "help him discover the truth about his parents' mysterious deaths.", 
                PosterUrl = "https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_FMjpg_UY2902_.jpg"},
            new Movies { Movie_Id = 2, Title = "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", Genre = Genre.Fantasy, DurationMinutes = 150, Rating = Rating.PG,
                Synopsis = "During the World War II bombings of London, four English siblings are sent to a country house where they will be safe. One day Lucy (Georgie Henley)" +
                "finds a wardrobe that transports her to a magical world called Narnia. After coming back, she soon returns to Narnia with her brothers, Peter (William Moseley)" +
                "and Edmund (Skandar Keynes), and her sister, Susan (Anna Popplewell). There they join the magical lion, Aslan (Liam Neeson), in the fight against the evil White Witch, Jadis (Tilda Swinton).",
                PosterUrl = "https://m.media-amazon.com/images/M/MV5BMTc0NTUwMTU5OV5BMl5BanBnXkFtZTcwNjAwNzQzMw@@._V1_QL75_UY562_CR0,0,380,562_.jpg"},
            new Movies { Movie_Id = 3, Title = "The Conjuring 2", Genre = Genre.Horror, DurationMinutes = 134, Rating = Rating.R,
                Synopsis = "In 1977, paranormal investigators Ed (Patrick Wilson) and Lorraine Warren come out of a self-imposed sabbatical to travel to Enfield," +
                "a borough in north London. There, they meet Peggy Hodgson, an overwhelmed single mother of four who tells the couple that something evil is in her home." +
                "Ed and Lorraine believe her story when the youngest daughter starts to show signs of demonic possession. As the Warrens try to help the besieged girl," +
                "they become the next targets of the malicious spirit.",
                PosterUrl = "https://m.media-amazon.com/images/M/MV5BOTRkMDlmZWEtMzQyYy00YzgyLTgwM2QtNzgxYmIwNGVlYmJlXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg"},
            new Movies { Movie_Id = 4, Title = "My Fault", Genre = Genre.Romance, DurationMinutes = 117, Rating = Rating.PG13,
                Synopsis = "Noah has to leave her town, boyfriend and friends behind and move into the mansion of her mother's new rich husband. There she meets Nick," +
                "her new stepbrother. She soon discovers that, behind the image of a model son, Nick is hiding something.",
                PosterUrl = "https://m.media-amazon.com/images/M/MV5BNTI4ZWQ5YjYtMmYwMy00OWFmLWFmNDYtZGNlNWMxNTllZjc4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg"},
            new Movies { Movie_Id = 5, Title = "Ted", Genre = Genre.Comedy, DurationMinutes = 106, Rating = Rating.R,
                Synopsis = "When John Bennett (Mark Wahlberg) was a little boy, he made a wish that Ted (Seth MacFarlane), his beloved teddy bear, would come alive." +
                "Thirty years later, foul-mouthed Ted is still John's constant companion, much to the chagrin of Lori (Mila Kunis), John's girlfriend. Though Lori's" + 
                "displeasure is exacerbated by the pair's constant consumption of beer and weed, she's not the one who's most disappointed with John; it may take" +
                "the intervention of John's boyhood toy to help him grow up at last.",
                PosterUrl = "https://m.media-amazon.com/images/M/MV5BMTQ1OTU0ODcxMV5BMl5BanBnXkFtZTcwOTMxNTUwOA@@._V1_QL75_UX380_CR0,20,380,562_.jpg"}
        );

        b.Entity<Roles>().HasData(
            new Roles { Role_Id = 1, RoleName = "Admin"},
            new Roles { Role_Id = 2, RoleName = "Consumer"}
        );

        b.Entity<Rooms>().HasData(
            new Rooms { Room_Id = 1, Cinema_Id = 4, RoomName = "IMAX Lounge", Capacity = 25},
            new Rooms { Room_Id = 2, Cinema_Id = 1, RoomName = "IMAX Lounge", Capacity = 25},
            new Rooms { Room_Id = 3, Cinema_Id = 1, RoomName = "VIP Lounge", Capacity = 25},
            new Rooms { Room_Id = 4, Cinema_Id = 2, RoomName = "A Lounge", Capacity = 25},
            new Rooms { Room_Id = 5, Cinema_Id = 3, RoomName = "B Lounge", Capacity = 25}
        );

        var seatGenerated = new List<Seats>();

        int seatId = 1;
        for (int room = 1; room <= 5; room++)
        {
            for (int row = 1; row  <= 5; row++)
            {
                char RW = (char)('A' + row - 1);
                for (int num = 1; num <= 5; num++)
                {
                    seatGenerated.Add(new Seats
                    {
                        Seat_Id = seatId,
                        Room_Id = room,
                        Row = RW,
                        Number = num
                    });
                    seatId++;
                }
            }
        }

        b.Entity<Seats>().HasData(seatGenerated);

        b.Entity<Showtimes>().HasData(
            new Showtimes { Showtime_Id = 1, Movie_Id = 1, Room_Id = 5, ShowDate = new DateOnly(2026, 07, 22), StartTime = new TimeOnly(17, 35), EndTime = new TimeOnly(20,12), Price = 4.99m},
            new Showtimes { Showtime_Id = 2, Movie_Id = 3, Room_Id = 4, ShowDate = new DateOnly(2026, 07, 23), StartTime = new TimeOnly(21, 0), EndTime = new TimeOnly(23,14), Price = 3.99m},
            new Showtimes { Showtime_Id = 3, Movie_Id = 2, Room_Id = 3, ShowDate = new DateOnly(2026, 07, 25), StartTime = new TimeOnly(19, 55), EndTime = new TimeOnly(22,25), Price = 4.99m},
            new Showtimes { Showtime_Id = 4, Movie_Id = 4, Room_Id = 2, ShowDate = new DateOnly(2026, 07, 24), StartTime = new TimeOnly(15, 5), EndTime = new TimeOnly(17,3), Price = 6.29m},
            new Showtimes { Showtime_Id = 5, Movie_Id = 5, Room_Id = 5, ShowDate = new DateOnly(2026, 07, 22), StartTime = new TimeOnly(20, 25), EndTime = new TimeOnly(22,11), Price = 7.59m}
        );

        b.Entity<Users>().HasData(
            new Users { User_Id = 1, Username = "Fran34J", Email = "Fran@mail.com", PasswordHash = "$argon2id$v=19$m=65536,t=4,p=8$aFQxVzBGWEQwVnprM2lHbw$crbzfKlT7lflD3QFxH0LSUGapiuoY3Nu2an3OvFvXbQ", FullName = "Francesco Totti", Role_Id = 2, CreatedAt = new DateTime(2026, 07, 20)},
            new Users { User_Id = 2, Username = "Rob94", Email = "Rob@mail.com", PasswordHash = "$argon2id$v=19$m=65536,t=4,p=8$dHlRS1M2Qng2eVl6a016eg$OoY2yrwFm6MC0wGW5cOWzmFloe9i9/cKb+wUeTl1Mik", FullName = "Roberto Baggio", Role_Id = 1, CreatedAt = new DateTime(2026, 07, 20)}
        );
    }
}