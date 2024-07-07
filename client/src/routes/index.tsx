import { useAuth } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    const auth = useAuth();

    useEffect(() => {
        auth.getToken().then(console.log);
        return () => {};
    }, []);

    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
        </div>
    );
}
