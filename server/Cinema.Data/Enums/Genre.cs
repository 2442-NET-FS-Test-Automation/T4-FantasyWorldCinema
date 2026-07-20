using System.ComponentModel;

namespace Cinema.Data.Entities;

public enum Genre
{
    [Description("Acción")] Action = 1,
    [Description("Comedia")] Comedy = 2,
    [Description("Drama")] Drama = 3,
    [Description("Terror")] Horror = 4,
    [Description("Ciencia Ficción")] SciFi = 5,
    [Description("Romance")] Romance = 6,
    [Description("Animación")] Animation = 7
}