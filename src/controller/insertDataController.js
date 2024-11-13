const connection = require('../utils/connection');

// Validation function
const validateTask = (title, description) => {
    if (typeof title !== 'string' || typeof description !== 'string') {
        return 'Title and description must be strings';
    }
    if (!title || !description) {
        return 'Title and description are mandatory';
    }
    if (title.length > 10) {
        return 'Title must be no longer than 10 characters';
    }
    if (description.length < 10 || description.length > 500) {
        return 'Description must be between 10 and 500 characters';
    }
    return null;
};

// Helper function to handle JSON responses
const sendJsonResponse = (response, statusCode, message) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message }));
};

// Create a new task
const createTask = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const { title, description, status = 'Pending' } = JSON.parse(body);
        const validationError = validateTask(title, description);
        if (validationError) {
            return sendJsonResponse(res, 400, validationError);
        }

        connection.query(
            'INSERT INTO statustable (title, descriptions, status) VALUES (?, ?, ?)',
            [title, description, status],
            (error, results) => {
                if (error) {
                    return sendJsonResponse(res, 500, `Error inserting data: ${error}`);
                }
                sendJsonResponse(res, 201, 'Task created successfully');
            }
        );
    });
};

// Retrieve all tasks
const getAllTasks = (req, res) => {
    connection.query('SELECT * FROM statustable', (error, results) => {
        if (error) {
            return sendJsonResponse(res, 500, `Error retrieving tasks: ${error}`);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    });
};

// Retrieve a specific task by ID
const getTaskById = (req, res, id) => {
    connection.query('SELECT * FROM statustable WHERE id = ?', [id], (error, results) => {
        if (error) {
            return sendJsonResponse(res, 500, `Error retrieving task: ${error}`);
        }
        if (results.length === 0) {
            return sendJsonResponse(res, 404, 'Task not found');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results[0]));
    });
};

// Update a specific task by ID
const updateTaskById = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const { title, description, status } = JSON.parse(body);

        connection.query(
            'UPDATE statustable SET title = ?, descriptions = ?, status = ? WHERE id = ?',
            [title, description, status, id],
            (error, results) => {
                if (error) {
                    return sendJsonResponse(res, 500, `Error updating task: ${error}`);
                }
                if (results.affectedRows === 0) {
                    return sendJsonResponse(res, 404, 'Task not found');
                }
                sendJsonResponse(res, 200, 'Task updated successfully');
            }
        );
    });
};

// Update task status only
const updateTaskStatus = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const { status } = JSON.parse(body);

        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return sendJsonResponse(res, 400, 'Invalid status');
        }

        connection.query(
            'UPDATE statustable SET status = ? WHERE id = ?',
            [status, id],
            (error, results) => {
                if (error) {
                    return sendJsonResponse(res, 500, `Error updating task status: ${error}`);
                }
                if (results.affectedRows === 0) {
                    return sendJsonResponse(res, 404, 'Task not found');
                }
                sendJsonResponse(res, 200, 'Task status updated successfully');
            }
        );
    });
};

// Delete a task by ID
const deleteTaskById = (req, res, id) => {
    connection.query('DELETE FROM statustable WHERE id = ?', [id], (error, results) => {
        if (error) {
            return sendJsonResponse(res, 500, `Error deleting task: ${error}`);
        }
        if (results.affectedRows === 0) {
            return sendJsonResponse(res, 404, 'Task not found');
        }
        sendJsonResponse(res, 200, 'Task deleted successfully');
    });
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    updateTaskStatus,
    deleteTaskById
};
