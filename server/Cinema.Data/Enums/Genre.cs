using System.ComponentModel;

namespace Cinema.Data.Entities;

public enum Genre : byte
{
    [Description("Action")] Action = 1,
    [Description("Comedy")] Comedy = 2,
    [Description("Drama")] Drama = 3,
    [Description("Horror")] Horror = 4,
    [Description("Science Fiction")] SciFi = 5,
    [Description("Romance")] Romance = 6,
    [Description("Animation")] Animation = 7,
    [Description("Fantasy")] Fantasy = 8
}