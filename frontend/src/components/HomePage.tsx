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

    return (
        <div>
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
    )
}

export default HomePage
