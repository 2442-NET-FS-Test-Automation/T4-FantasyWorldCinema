using System.Text;
using System.Security.Cryptography;
using Konscious.Security.Cryptography;

namespace Cinema.ControllerApi.Services;

public class Argon2Hasher : IArgon2Hasher
{
    /* Generate final hash of 256 bits (32 bytes) */
    public string HashPassword(string password)
    {
        byte[] salt = new byte[32]; /* Salt of 256 bits (32 bytes) */
        using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        using (Argon2id argon2 = new Argon2id(Encoding.UTF8.GetBytes(password)))
        {
            argon2.Salt = salt;
            argon2.DegreeOfParallelism = 8;
            argon2.MemorySize = 65536;
            argon2.Iterations = 4;

            byte[] hash = argon2.GetBytes(32); /* Hash of 256 bits (32 bytes) */

            /* Join Salt & Hash splited by a dot to save it as a string into DB */
            return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }
    }

    /* Compare passwords UserInput vs DB_SavedPassword */
    public bool VerifyPassword(string password, string hashedPassword)
    {
        string[] parts = hashedPassword.Split('.');
        if (parts.Length != 2) return false;

        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] storedHash = Convert.FromBase64String(parts[1]);

        using (Argon2id argon2 = new Argon2id(Encoding.UTF8.GetBytes(password)))
        {
            argon2.Salt = salt;
            argon2.DegreeOfParallelism = 8;
            argon2.MemorySize = 65536;
            argon2.Iterations = 4;

            byte[] computedHash = argon2.GetBytes(32);

            /* Secure comparation to avoid temporization atacks */
            return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
        }
    }
}
