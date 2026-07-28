using Cinema.Data.Entities;

namespace Cinema.ControllerApi.DTOs;

public record SeatsDTO(int Seat_Id, string Row, string Number, int IsFree);