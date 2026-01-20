using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});
builder.Services.AddSqlite<AppDbContext>("Data Source=tasks.db");

var app = builder.Build();
app.UseCors();

app.MapGet("/tasks", async (AppDbContext db) =>
{
    return await db.Tasks.ToListAsync();
});

app.MapPost("/tasks", async (AppDbContext db, TaskItem task) =>
{
    if (task.Hours <= 0 || string.IsNullOrWhiteSpace(task.Title))
    {
        return Results.BadRequest("無効なタスクデータです。タイトルは空でなく、時間は正の数である必要があります。");
    }
    try {
        TaskItem newTask = new()
        {
            Id = Guid.NewGuid(),
            Title = task.Title,
            Hours = task.Hours,
            IsCompleted = task.IsCompleted
        };

        db.Tasks.Add(newTask);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "タスクは正常に追加されました", createdTask = newTask });
    } catch (Exception ex)
    {
        return Results.Problem("タスクの追加に失敗しました: " + ex.Message);
    }
});

app.MapPatch("/tasks/{id}", async (AppDbContext db, Guid id) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task == null)
    {
        return Results.NotFound("指定されたIDのタスクはありません。");
    }

    task.IsCompleted = !task.IsCompleted;
    await db.SaveChangesAsync();

    return Results.Ok("タスクの状態が変更されました。");
});

app.MapDelete("/tasks/{id}", async (AppDbContext db, Guid id) =>
{
    try {
        var task = await db.Tasks.FindAsync(id);
        if (task is null) return Results.NotFound();
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return Results.NoContent();
    } catch (Exception ex)
    {
        return Results.InternalServerError("タスクの削除に失敗しました: " + ex.Message);
    }
});

app.Run();


public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Title { get; set; }
    public double Hours { get; set; }
    public bool IsCompleted { get; set; }

    public void ToggleStatus()
    {
        IsCompleted = !IsCompleted;
        return;
    }
};

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {  }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}
