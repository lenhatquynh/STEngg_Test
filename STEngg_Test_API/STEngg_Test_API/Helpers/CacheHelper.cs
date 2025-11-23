using System.Text.Json;
using StackExchange.Redis;

namespace STEngg_Test_API.Helpers;

public interface ICacheHelper
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class;
    Task RemoveAsync(string key);
    Task RemoveByPatternAsync(string pattern);
}

public class CacheHelper : ICacheHelper
{
    private readonly IDatabase _database;
    private readonly IConnectionMultiplexer _redis;

    public CacheHelper(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _database = redis.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        var value = await _database.StringGetAsync(key);
        if (!value.HasValue)
            return null;

        return JsonSerializer.Deserialize<T>(value!);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
    {
        var serialized = JsonSerializer.Serialize(value);
        if (expiry.HasValue)
        {
            await _database.StringSetAsync(key, serialized, expiry.Value);
        }
        else
        {
            await _database.StringSetAsync(key, serialized);
        }
    }

    public async Task RemoveAsync(string key)
    {
        await _database.KeyDeleteAsync(key);
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        var server = _redis.GetServer(_redis.GetEndPoints().First());
        var keys = server.Keys(pattern: pattern);

        foreach (var key in keys)
        {
            await _database.KeyDeleteAsync(key);
        }
    }
}