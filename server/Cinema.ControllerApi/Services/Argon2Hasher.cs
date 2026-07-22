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

            string saltBase64 = Convert.ToBase64String(argon2.Salt).TrimEnd('=');
            string hashBase64 = Convert.ToBase64String(hash).TrimEnd('=');

            /* Join Salt & Hash splited by a $ to save it as a string into DB (PHC standard) */
            return $"$argon2id$v=19$m={argon2.MemorySize},t={argon2.Iterations},p={argon2.DegreeOfParallelism}${saltBase64}${hashBase64}";
        }
    }

    /* Compare passwords UserInput vs DB_SavedPassword */
    public bool VerifyPassword(string password, string hashedPassword)
    {   
        /* 1- Prepare password taken Spliting by '$' character (PHC contains 5 parts) */
        string[] parts = hashedPassword.Split('$');
        /* Format expected ("", "argon2id", "v=19", "m=65536,t=4,p=8", "salt", "hash") { 1 empty + 5 PHC parts} */
        if (parts.Length != 6) return false;


        int memorySize = 65536;
        int iterations = 4;
        int degreeOfParallelism = 8;

        /* 2- Validate argon variant & parsing configuration parameters (m, t, p) */
        if (parts[1] != "argon2id") return false;

        string[] configParams = parts[3].Split(',');
        foreach (var param in configParams)
        {
            string[] kv = param.Split('=');
            if (kv.Length != 2) return false;

            if      (kv[0] == "m") memorySize = int.Parse(kv[1]);
            else if (kv[0] == "t") iterations = int.Parse(kv[1]);
            else if (kv[0] == "p") degreeOfParallelism = int.Parse(kv[1]);
        }

        /* 3- Decodify salt & hash */
        byte[] salt = ConvertFromBase64Minified(parts[4]);
        byte[] storedHash = ConvertFromBase64Minified(parts[5]);

        /* Configurations to convert hash */
        using (Argon2id argon2 = new Argon2id(Encoding.UTF8.GetBytes(password)))
        {
            argon2.Salt = salt;
            argon2.MemorySize = memorySize;
            argon2.Iterations = iterations;
            argon2.DegreeOfParallelism = degreeOfParallelism;

            byte[] computedHash = argon2.GetBytes(storedHash.Length);

            /* Secure comparation to avoid temporization atacks */
            return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
        }
    }


    /* Helper to recover padding '=' from Base64 omited during PHC standard */
    private byte[] ConvertFromBase64Minified(string base64Minified)
    {
        /* Recovering correct characters - Argon2 could be use Base64URL: it changes ('/' => '_') & ('-' => '+') */
        string incoming = base64Minified.Replace('_', '/').Replace('-', '+');

        /* recovering padded '=' splited previously */
        switch (incoming.Length % 4)
        {
            case 2: incoming += "=="; break;
            case 3: incoming += "="; break;
        }
        return Convert.FromBase64String(incoming);
    }
}
