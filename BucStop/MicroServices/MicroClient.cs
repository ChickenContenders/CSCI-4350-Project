using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace BucStop
{
    public class MicroClient
    {
        private readonly JsonSerializerOptions options = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        private readonly HttpClient client;
        private readonly ILogger<MicroClient> _logger;

        public MicroClient(HttpClient client, ILogger<MicroClient> logger)
        {
            this.client = client;
            this._logger = logger;
        }

        public async Task<GameInfo[]> GetGamesAsync()
        {
            try
            {
                // The /Micro here is the route that is set up by the microservice
                var responseMessage = await this.client.GetAsync("/Micro");

                if (responseMessage != null)
                {
                    var stream = await responseMessage.Content.ReadAsStreamAsync();
                    return await JsonSerializer.DeserializeAsync<GameInfo[]>(stream, options);
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex.Message);
            }
            return new GameInfo[] { };

        }

        /// <summary>
        /// Consumes the individual microservice based off of a given id.  Set up by Chris and Noah.  Not tested yet.
        /// </summary>
        /// <param name="id">Id of the game you would like.</param>
        /// <returns>The single game and all its data.</returns>
        public async Task<GameInfo> GetGameByIdAsync(int id)
        {
            try
            {
                var responseMessage = await client.GetAsync($"/Micro/Games/Play/{id}"); // Adjust the endpoint URL to include the ID

                if (responseMessage != null)
                {
                    var stream = await responseMessage.Content.ReadAsStreamAsync();
                    return await JsonSerializer.DeserializeAsync<GameInfo>(stream, options);
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex.Message);
            }
            return null; // Return null if game with specified ID is not found
        }
    }
}