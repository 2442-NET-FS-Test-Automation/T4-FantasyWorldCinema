using System.ComponentModel;

namespace Cinema.Data.Entities;

public enum Status : byte
{
    /* The user initiated the purchase but has not yet completed the payment. */
    [Description("Payment Pending")] Pending = 1,
    /* The payment was processed successfully. The seats are now permanently reserved. */
    [Description("Completed")] Completed = 2,
    /* The process failed (card declined, insufficient funds, network error). The seats are released. */
    [Description("Failed")] Failed = 3,
    /* The transaction expired because the user abandoned the flow or the payment time limit ran out. The seats are released. */
    [Description("Expired")] Expired = 4,
    
    /* The user or the cinema administrator subsequently canceled the purchase. Allows for managing refunds. */
    [Description("Canceled")] Cancelled = 5,
    /* The user has already attended the show and their tickets were scanned at the entrance. Prevents ticket reuse fraud. */
    [Description("Used")] Used = 6
}