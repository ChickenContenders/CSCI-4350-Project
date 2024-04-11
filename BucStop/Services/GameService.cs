using System.Collections.Generic;
using System.IO;
using BucStop.Models;
using System.Text.Json;

public class GameService
{
    private string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "games.json");
    
    public List<Game>? GetGames()
    {
        string json = File.ReadAllText(path);
        List<Game>? games = JsonSerializer.Deserialize<List<Game>>(json);
        return games;
    }
    public Game? GetGame(int id)
    {
        string path2 = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "games.json");
        string json = File.ReadAllText(path);
        List<Game>? games = JsonSerializer.Deserialize<List<Game>>(json); //We need to reference the specific json file or gameinfo object belonging to a microservice
        //Or if we could somehow isolate the part of the json file corresponding to the given id for right now.
        return games[id-1];
    }
}