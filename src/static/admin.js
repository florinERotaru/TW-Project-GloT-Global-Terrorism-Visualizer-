async function fetchUsers() {
    try {
        console.log("Attempting to fetch users");
        const response = await fetch('/api/admin/users');
        console.log('Got USERS response.');
        // afisare in pagina
    }
    catch (error) {
        console.error(`Fetch users error: ${error.message}`);
    }
}

async function fetchSessions() {
    try {
        const response = await fetch('/api/admin/sessions');
        console.log('Got SESSION response.');
        // afisare in pagina
    }
    catch (error) {
        console.error(`Fetch sessions error: ${error.message}`);
    }
}

async function addUser() {
    try {
        const response = await fetch('/api/admin/users', {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Add user error:", error);
    }
}
