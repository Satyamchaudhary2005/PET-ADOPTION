const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Store adoption requests in a JSON file
const ADOPTION_REQUESTS_FILE = 'adoption-requests.json';
const CONTACT_MESSAGES_FILE = 'contact-messages.json';

// Initialize the files if they don't exist
if (!fs.existsSync(ADOPTION_REQUESTS_FILE)) {
    fs.writeFileSync(ADOPTION_REQUESTS_FILE, JSON.stringify([]));
    console.log('Created new adoption-requests.json file');
}

if (!fs.existsSync(CONTACT_MESSAGES_FILE)) {
    fs.writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify([]));
    console.log('Created new contact-messages.json file');
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Endpoint to handle adoption requests
app.post('/api/adoption-requests', (req, res) => {
    console.log('Received adoption request:', req.body);
    
    // Validate required fields
    const { name, phone, address, petName } = req.body;
    if (!name || !phone || !address || !petName) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'Name, phone, address, and petName are required'
        });
    }

    try {
        // Read existing requests
        let requests = [];
        if (fs.existsSync(ADOPTION_REQUESTS_FILE)) {
            const fileContent = fs.readFileSync(ADOPTION_REQUESTS_FILE, 'utf8');
            requests = JSON.parse(fileContent);
        }

        // Add new request with ID
        const newRequest = {
            id: generateId(),
            ...req.body,
            timestamp: new Date().toISOString()
        };
        requests.push(newRequest);

        // Save updated requests
        fs.writeFileSync(ADOPTION_REQUESTS_FILE, JSON.stringify(requests, null, 2));
        
        console.log('Successfully saved adoption request');
        res.status(200).json({ 
            message: 'Adoption request received successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error saving adoption request:', error);
        res.status(500).json({ 
            error: 'Failed to save adoption request',
            details: error.message
        });
    }
});

// Endpoint to delete an adoption request
app.delete('/api/adoption-requests/:id', (req, res) => {
    try {
        const requestId = req.params.id;
        
        // Read existing requests
        let requests = [];
        if (fs.existsSync(ADOPTION_REQUESTS_FILE)) {
            const fileContent = fs.readFileSync(ADOPTION_REQUESTS_FILE, 'utf8');
            requests = JSON.parse(fileContent);
        }

        // Find and remove the request
        const initialLength = requests.length;
        requests = requests.filter(request => request.id !== requestId);

        if (requests.length === initialLength) {
            return res.status(404).json({ error: 'Adoption request not found' });
        }

        // Save updated requests
        fs.writeFileSync(ADOPTION_REQUESTS_FILE, JSON.stringify(requests, null, 2));
        
        res.status(200).json({ message: 'Adoption request deleted successfully' });
    } catch (error) {
        console.error('Error deleting adoption request:', error);
        res.status(500).json({ 
            error: 'Failed to delete adoption request',
            details: error.message
        });
    }
});

// Endpoint to get all adoption requests
app.get('/api/adoption-requests', (req, res) => {
    try {
        if (!fs.existsSync(ADOPTION_REQUESTS_FILE)) {
            return res.status(200).json([]);
        }
        
        const fileContent = fs.readFileSync(ADOPTION_REQUESTS_FILE, 'utf8');
        const requests = JSON.parse(fileContent);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error reading adoption requests:', error);
        res.status(500).json({ 
            error: 'Failed to read adoption requests',
            details: error.message
        });
    }
});

// Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
    console.log('Received contact form submission:', req.body);
    
    // Validate required fields
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ 
            error: 'Missing required fields',
            details: 'Name, email, subject, and message are required'
        });
    }

    try {
        // Read existing messages
        let messages = [];
        if (fs.existsSync(CONTACT_MESSAGES_FILE)) {
            const fileContent = fs.readFileSync(CONTACT_MESSAGES_FILE, 'utf8');
            messages = JSON.parse(fileContent);
        }

        // Add new message with ID
        const newMessage = {
            id: generateId(),
            ...req.body,
            timestamp: new Date().toISOString()
        };
        messages.push(newMessage);

        // Save updated messages
        fs.writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2));
        
        console.log('Successfully saved contact message');
        res.status(200).json({ 
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ 
            error: 'Failed to send message',
            details: error.message
        });
    }
});

// Endpoint to delete a contact message
app.delete('/api/contact/:id', (req, res) => {
    try {
        const messageId = req.params.id;
        
        // Read existing messages
        let messages = [];
        if (fs.existsSync(CONTACT_MESSAGES_FILE)) {
            const fileContent = fs.readFileSync(CONTACT_MESSAGES_FILE, 'utf8');
            messages = JSON.parse(fileContent);
        }

        // Find and remove the message
        const initialLength = messages.length;
        messages = messages.filter(message => message.id !== messageId);

        if (messages.length === initialLength) {
            return res.status(404).json({ error: 'Contact message not found' });
        }

        // Save updated messages
        fs.writeFileSync(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2));
        
        res.status(200).json({ message: 'Contact message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ 
            error: 'Failed to delete contact message',
            details: error.message
        });
    }
});

// Endpoint to get all contact messages
app.get('/api/contact', (req, res) => {
    try {
        if (!fs.existsSync(CONTACT_MESSAGES_FILE)) {
            return res.status(200).json([]);
        }
        
        const fileContent = fs.readFileSync(CONTACT_MESSAGES_FILE, 'utf8');
        const messages = JSON.parse(fileContent);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error reading contact messages:', error);
        res.status(500).json({ 
            error: 'Failed to read contact messages',
            details: error.message
        });
    }
});

// Create an admin page to view requests
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin page available at http://localhost:${PORT}/admin`);
    console.log(`Test endpoint available at http://localhost:${PORT}/api/test`);
}); 