const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    updateTaskStatus,
    deleteTaskById
} = require('../controller/insertDataController');

const routingMangement = (request, response) => {
    console.log(`Incoming request: ${request.method} ${request.url}`);

    if (request.method === 'POST' && request.url === '/api/insertData') {
        console.log('Handling insert data');
        createTask(request, response);
        return;
    }

    if (request.method === 'GET' && request.url === '/api/tasks') {
        console.log('Retrieving all tasks');
        getAllTasks(request, response);
        return;
    }

    if (request.method === 'GET' && request.url.startsWith('/api/tasks/')) {
        const id = request.url.split('/').pop();
        console.log(`Retrieving task with ID: ${id}`);
        getTaskById({ ...request, params: { id } }, response);
        return;
    }

    if (request.method === 'PUT' && request.url.startsWith('/api/tasks/')) {
        const id = request.url.split('/').pop();
        console.log(`Updating task with ID: ${id}`);
        updateTaskById({ ...request, params: { id } }, response);
        return;
    }

    if (request.method === 'PATCH' && request.url.startsWith('/api/tasks/')) {
        const id = request.url.split('/').pop();
        console.log(`Updating task status with ID: ${id}`);
        updateTaskStatus({ ...request, params: { id } }, response);
        return;
    }

    if (request.method === 'DELETE' && request.url.startsWith('/api/tasks/')) {
        const id = request.url.split('/').pop();
        console.log(`Deleting task with ID: ${id}`);
        deleteTaskById({ ...request, params: { id } }, response);
        return;
    }

    // Handle unknown routes
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Route not found' }));
};

module.exports = routingMangement;
