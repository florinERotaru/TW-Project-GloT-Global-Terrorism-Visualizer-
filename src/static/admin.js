function openAdminTab() {
    Swal.fire({
        html: `<div class="horizontal-container-admin">
            <button class="get-users" onclick="fetchUsers()">Get users</button>
            <button class="get-sessions" onclick="fetchSessions()">Get sessions</button>
            <button class="add-user" onclick="addUser()">Add user</button>
        </div>`,
        confirmButtonText: 'Close',
        confirmButtonColor: '#3085d6'
    })
}


async function fetchUsers() {
    try {
        console.log("Attempting to fetch users");
        const response = await fetch('/api/admin/users');
        const users = await response.json();

        let popupContent = '';
        users.forEach((element) => {
            popupContent += `<p style="width:100%; justify-content: center;">Id = ${element.id}, username = ${element.username}, email = ${element.email}, pswd = ${element.password},role = ${element.role}</p>`
        })
        // afisare in pagina sub forma unui pop-up
        Swal.fire({
            html: popupContent,
            grow: 'row'
        })
    }
    catch (error) {
        console.error(`Fetch users error: ${error.message}`);
    }
}

async function fetchSessions() {
    try {
        console.log("Attempting to fetch sessions");
        const response = await fetch('/api/admin/sessions');
        const users = await response.json();

        let popupContent = '';
        users.forEach((element) => {
            popupContent += `<p style="width:100%; justify-content: center;">cookieId = ${element.cookieid}, email = ${element.email}</p>`
        })
        // afisare in pagina sub forma unui pop-up
        Swal.fire({
            html: popupContent,
        })
    }
    catch (error) {
        console.error(`Fetch sessions error: ${error.message}`);
    }
}

async function addUser() {
    await Swal.fire({
        title: 'Add an user:',
        html:
        `<form action="/login" method="post">
            <input type="hidden" id="type" name="formType" value="signup">
            <input type="text" id="username" name="txt" placeholder="User name" required="true">
            <input type="email" id="eml" name="email" placeholder="Email" required="true">
            <input type="password" id="paswd" name="pswd" placeholder="Password" required="true">
        </form>`,
        showCancelButton: true,
        confirmButtonText: 'Add user',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const formType = document.getElementById('type').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('eml').value;
            const password = document.getElementById('paswd').value;
            
            const body = `formType=${formType}&txt=${username}&email=${email}&pswd=${password}`;
            
            return await fetch('/login', {
                method: "POST",
                body: body,
            })
            .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText)
                }
                Swal.fire('User added!', '', 'success');
              })
              .catch(error => {
                Swal.showValidationMessage(
                  `Request failed: ${error}`
                )
              })
            
        }
    })
}
