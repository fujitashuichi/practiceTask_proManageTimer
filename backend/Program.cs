var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/tasks", () =>
{
    return TaskStore.Tasks;
});

app.MapPost("/tasks", (TaskItem task) =>
{
    if (task.Hours <= 0 || string.IsNullOrWhiteSpace(task.Title))
    {
        return new string("無効なタスクデータです。タイトルは空でなく、時間は正の数である必要があります。");
    }
    try {
        TaskItem newTask = new()
        {
            Id = Guid.NewGuid(),
            Title = task.Title,
            Hours = task.Hours,
            IsCompleted = task.IsCompleted
        };
        TaskStore.Tasks.Add(newTask);
        return new string("タスクは正常に追加されました");
    } catch (Exception ex)
    {
        return new string("タスクの追加に失敗しました: " + ex.Message);
    }
});

app.Run();


public class TaskItem
{
    public Guid Id = Guid.NewGuid();
    public required string Title { get; set; }
    public double Hours { get; set; }
    public bool IsCompleted { get; set; }
};

public class TaskStore
{
    public static List<TaskItem> Tasks = new([
        new TaskItem { Title = "Dummy_1", Hours = 1.5, IsCompleted = false },
        new TaskItem { Title = "Dummy_2", Hours = 2.0, IsCompleted = true }
    ]);
};
