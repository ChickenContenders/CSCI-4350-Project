using BucStop.Models;

namespace BucStop.Services
{
    public interface IGameRepository
    {
        ICollection<Game> ReadAll();
        Game? Read(int id);
    }
}
