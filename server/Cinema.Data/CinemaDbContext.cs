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
            .HasForeignKey(ts => ts.Transaction_Id);
    }
}