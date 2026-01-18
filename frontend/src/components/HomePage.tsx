import { useContext, useEffect } from 'react'
import { PortContext } from "../contexts/PortContextType.tsx"

function HomePage() {
    const [backendPort] = useContext(PortContext);
    useEffect(() => {
        const fetchTasks = async () => {
            await fetch("http://localhost:" + backendPort + "/tasks");
        };
        fetchTasks();
    }, []);

    return (
        <></>
    )
}

export default HomePage
