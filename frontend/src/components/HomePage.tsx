import { useContext, useState, useEffect } from 'react'
import { PortContext } from "../contexts/PortContextType.ts"
import type { taskItem } from '../types.ts';


function HomePage() {
    const [backendPort] = useContext(PortContext);
    const [tasks, setTasks] = useState<taskItem[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("http://localhost:" + backendPort + "/tasks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data);
                };
            } catch (error) {
                console.error("通信エラー: ", error);
            };
        };
        fetchTasks();
    }, []);

    // 時間単位選択ボタン
    const [active, setActive] = useState<"h" | "m">("h");

    const buttonStyle = (isSelected: boolean) => ({
        padding: '10px 20px',
        backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
        color: isSelected ? 'white' : 'black',
        border: '1px solid #ccc',
        cursor: 'pointer',
    });

    const [newTitle, setNewTitle] = useState<string>("");
    const [inputTime, setInputTime] = useState<string>("");

    const parsedTime = parseFloat(inputTime) || 0;
    const newHours: number = active === "h" ? parsedTime : parsedTime / 60;

    const sendTaskItem = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (tasks.some(taskItem => taskItem.title === newTitle)) {
            alert("その名前のタスクは既に登録されています")
        }

        const newTask = {
            Title: newTitle,
            Hours: newHours,
            IsCompleted: false
        };

        try {
            const response = await fetch("http://localhost:" + backendPort + "/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result.message, result.createdTask);
                setTasks([...tasks, result.createdTask]);
                alert("タスクを追加しました");
            }
        } catch (error) {
            console.log("通信エラー: ", error);
            alert("タスクの追加に失敗しました");
        }
    }

    return (
        <div>
            <form action="">
                <div>
                    <label htmlFor="title">タスク名</label>
                    <input id="title" type="text" minLength={1} maxLength={20} placeholder="タスク名（20字以内）" onChange={(e) => setNewTitle(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="time">時間</label>
                    <input id="time" type="number" min={1} onChange={(e) => setInputTime(e.target.value)} />
                    <div style={{ display: "flex" }}>
                        <button style={buttonStyle(active === "h")} onClick={(e) => {e.preventDefault(); setActive("h")}}>時</button>
                        <button style={buttonStyle(active === "m")} onClick={(e) => {e.preventDefault(); setActive("m")}}>分</button>
                    </div>
                </div>
                <button type="submit" onClick={(e) => sendTaskItem(e)}>タスクを追加</button>
            </form>
            <div style={{ backgroundColor: "aliceblue", padding: "20px" }}>
            {
                tasks.map((task, id) => (
                    <div key={id}>
                        <h2>{task.title}</h2>
                        <p>id: {task.id}</p>
                        <p>hours: {task.hours}</p>
                        <p>isCompleted: {task.isCompleted ? "true" : "false"}</p>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default HomePage
