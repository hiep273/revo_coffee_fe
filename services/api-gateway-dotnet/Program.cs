using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseCors();

var routes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    ["/api/auth"] = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL") ?? "http://identity-service:80",
    ["/api/products"] = Environment.GetEnvironmentVariable("PRODUCT_SERVICE_URL") ?? "http://product-service:80",
    ["/api/categories"] = Environment.GetEnvironmentVariable("PRODUCT_SERVICE_URL") ?? "http://product-service:80",
    ["/api/inventory"] = Environment.GetEnvironmentVariable("INVENTORY_SERVICE_URL") ?? "http://inventory-service:80",
    ["/api/stockmovements"] = Environment.GetEnvironmentVariable("INVENTORY_SERVICE_URL") ?? "http://inventory-service:80",
    ["/api/orders"] = Environment.GetEnvironmentVariable("ORDER_SERVICE_URL") ?? "http://order-service:8080",
    ["/api/subscriptions"] = Environment.GetEnvironmentVariable("ORDER_SERVICE_URL") ?? "http://order-service:8080",
    ["/api/batches"] = Environment.GetEnvironmentVariable("BATCH_SERVICE_URL") ?? "http://batch-service:8080"
};

app.MapGet("/health", () => Results.Ok(new { status = "up", service = "api-gateway-dotnet" }));

app.Map("/{**path}", async (HttpContext context, IHttpClientFactory clientFactory) =>
{
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        return Results.NoContent();
    }

    var requestPath = context.Request.Path.Value ?? "/";
    var route = routes
        .OrderByDescending(r => r.Key.Length)
        .FirstOrDefault(r => requestPath.StartsWith(r.Key, StringComparison.OrdinalIgnoreCase));

    if (route.Key is null)
    {
        return Results.NotFound(new { error = "Not Found", message = "Invalid API endpoint" });
    }

    var targetUri = new UriBuilder(route.Value)
    {
        Path = requestPath,
        Query = context.Request.QueryString.HasValue
            ? context.Request.QueryString.Value![1..]
            : string.Empty
    }.Uri;

    using var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), targetUri);

    foreach (var header in context.Request.Headers)
    {
        if (header.Key.Equals("Host", StringComparison.OrdinalIgnoreCase))
        {
            continue;
        }

        if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
        {
            requestMessage.Content ??= new StreamContent(context.Request.Body);
            requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
        }
    }

    if (context.Request.ContentLength > 0 && requestMessage.Content is null)
    {
        requestMessage.Content = new StreamContent(context.Request.Body);
        if (!string.IsNullOrWhiteSpace(context.Request.ContentType))
        {
            requestMessage.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(context.Request.ContentType);
        }
    }

    var client = clientFactory.CreateClient();
    using var response = await client.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted);

    context.Response.StatusCode = (int)response.StatusCode;
    foreach (var header in response.Headers)
    {
        context.Response.Headers[header.Key] = header.Value.ToArray();
    }
    foreach (var header in response.Content.Headers)
    {
        context.Response.Headers[header.Key] = header.Value.ToArray();
    }

    context.Response.Headers.Remove("transfer-encoding");
    await response.Content.CopyToAsync(context.Response.Body, context.RequestAborted);
    return Results.Empty;
});

app.Run();
