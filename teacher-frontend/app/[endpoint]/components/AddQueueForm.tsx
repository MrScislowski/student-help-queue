import React, { useState } from 'react';
import { createQueue } from '../requests';

interface AddQueueFormProps {
    classId: string;
}

const AddQueueForm = ({classId}: {classId: string}) => {
    const [queueName, setQueueName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createQueue(classId, queueName);
        setQueueName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={queueName}
                onChange={(e) => setQueueName(e.target.value)}
                placeholder="Enter queue name"
            />
            <button type="submit">Add Queue</button>
        </form>
    );
};

export default AddQueueForm;