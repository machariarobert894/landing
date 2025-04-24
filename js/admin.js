document.addEventListener('DOMContentLoaded', async () => {
    const userTableBody = document.querySelector('#userTable tbody');
    const addUserForm = document.getElementById('addUserForm');
    const newUsernameInput = document.getElementById('newUsername');
    const newPasswordInput = document.getElementById('newPassword');
    const adminError = document.getElementById('adminError');
    const addUserError = document.getElementById('addUserError');

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const ADMIN_USERNAME = 'mikemuchiri1943@karatina';

    // --- Security Check (Client-Side Only - Basic UI lock) ---
    if (loggedInUser !== ADMIN_USERNAME) {
        document.body.innerHTML = `
            <div class="container" style="text-align: center; padding-top: 50px;">
                <h1 style="color: var(--danger-color);">Access Denied</h1>
                <p style="color: var(--muted-text);">You do not have permission to view this page.</p>
                <a href="../tools/index.html" class="btn primary" style="margin-top: 20px;">Back to Tool</a>
            </div>`;
        const style = document.createElement('style');
        style.textContent = `
            body { background: var(--primary-bg); font-family: 'Source Code Pro', monospace; }
            :root { --primary-bg: #0c0d10; --secondary-bg: #151820; --panel-bg: #1a1d25; --text-color: #a5f5d7; --muted-text: #7aa689; --accent-color: #00ff9d; --highlight-color: #00c4ff; --border-color: #2a3040; --danger-color: #ff5252; --warning-color: #ffbc2c; --success-color: #34d399; }
            .container { max-width: 600px; margin: auto; }
            .btn { background: var(--secondary-bg); color: var(--text-color); border: 1px solid var(--border-color); font-family: 'Share Tech Mono', monospace; padding: 8px 15px; cursor: pointer; font-size: 14px; transition: all 0.2s; border-radius: 3px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
            .btn.primary { background: rgba(0, 255, 157, 0.2); border-color: var(--accent-color); color: var(--accent-color); }
            .btn.primary:hover { background: rgba(0, 255, 157, 0.3); box-shadow: 0 0 10px rgba(0, 255, 157, 0.5); }
        `;
        document.head.appendChild(style);
        return;
    }
    // --- End Security Check ---

    // --- API Helper ---
    async function apiRequest(url, options = {}) {
        // Add the API base URL to ensure we're connecting to our Express server
        const baseUrl = 'http://localhost:3000'; // Explicitly use our Express server's port
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
        
        console.log(`Making API request to: ${fullUrl}`);
        
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'X-Request-User': loggedInUser
        };

        let response;
        try {
            response = await fetch(fullUrl, options);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
                }
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            if (response.status === 204) {
                return null;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                console.warn(`Received non-JSON response for ${fullUrl} with status ${response.status}`);
                return null;
            }

        } catch (error) {
            console.error(`API Request Error for ${options.method || 'GET'} ${fullUrl}:`, error);
            if (adminError) {
                adminError.textContent = `API Error: ${error.message}`;
                adminError.style.color = 'var(--danger-color)';
            }
            throw error;
        }
    }

    // Fetch users from the server API
    async function loadUsersFromServer() {
        adminError.textContent = '';
        try {
            const users = await apiRequest('/api/users');
            renderUsers(users || []);  // Ensure users is at least an empty array
        } catch (error) {
            adminError.textContent = `Failed to load users: ${error.message}`;
            renderUsers([]);
        }
    }

    // Render user table
    function renderUsers(users) {
        userTableBody.innerHTML = '';

        if (!users || users.length === 0) {
            adminError.textContent = "No users found or failed to load users.";
            return;
        }

        users.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell(0).textContent = user.username;

            const actionCell = row.insertCell(1);
            if (user.username !== ADMIN_USERNAME) {
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
                deleteButton.classList.add('btn', 'danger', 'btn-delete');
                deleteButton.onclick = () => deleteUserFromServer(user.username);
                actionCell.appendChild(deleteButton);
            } else {
                actionCell.textContent = '(Protected)';
            }
        });
    }

    // Add a new user via the server API
    async function addUserToServer(username, password) {
        addUserError.textContent = '';
        adminError.textContent = '';

        if (!username || !password) {
             addUserError.textContent = 'Username and password cannot be empty.';
             return;
        }

        try {
            const newUser = await apiRequest('/api/users', {
                method: 'POST',
                body: JSON.stringify({ username, password, requestUser: loggedInUser })
            });

            adminError.textContent = `User "${newUser.username}" added successfully.`;
            adminError.style.color = 'var(--success-color)';
            addUserForm.reset();
            await loadUsersFromServer();

        } catch (error) {
            addUserError.textContent = error.message;
        }
    }

    // Delete a user via the server API
    async function deleteUserFromServer(username) {
        adminError.textContent = '';

        if (username === ADMIN_USERNAME) {
            adminError.textContent = "Cannot delete the main admin user.";
            adminError.style.color = 'var(--danger-color)';
            return;
        }

        if (confirm(`Are you sure you want to permanently delete user "${username}"?`)) {
            try {
                const result = await apiRequest(`/api/users/${username}`, {
                    method: 'DELETE',
                    body: JSON.stringify({ requestUser: loggedInUser })
                });

                adminError.textContent = result?.message || `User "${username}" deleted successfully.`;
                adminError.style.color = 'var(--success-color)';
                await loadUsersFromServer();

            } catch (error) {
                // Error is handled and displayed by apiRequest helper
            }
        }
    }

    // Event listener for the add user form
    addUserForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUsername = newUsernameInput.value.trim();
        const newPassword = newPasswordInput.value;
        await addUserToServer(newUsername, newPassword);
    });

    // Initial load from server
    await loadUsersFromServer();
});
