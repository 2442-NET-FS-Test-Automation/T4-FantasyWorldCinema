using System.ComponentModel;

namespace Cinema.Data.Entities;

public enum Rating
{    
    [Description("G - General Audiences")] G = 1,    
    [Description("PG - Parental Guidance Suggested")] PG = 2,
    [Description("PG-13 - Parents Strongly Cautioned")] PG13 = 3,
    [Description("R - Restricted")] R = 4,
    [Description("NC-17 - Adults Only")] NC17 = 5
}