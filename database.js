// import UserModel from "./user_model";

class DataBase{
    signup(user) {
        if (localStorage.getItem('users') === null) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        const users = JSON.parse(localStorage.getItem('users'));

        if (users.some(u => u.email === user.email)) {
            alert("Email already exists");
            return;
        } else if (users.some(u => u.phone === user.phone)) {
            alert("Phone number already exists");
            return;
        }

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert("Sign up successful");
        window.location.href = "login.html";
    }

    login(email, password, pin) {
        if (localStorage.getItem('users') === null) {
            alert("User not found");
            return;
        }
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email);

        if (!user) {
            alert("User not found");
            return;
        }

        if (user.password === password || user.pin === pin) {
            alert("Login successful");
            window.location.href = "signup.html";
        } else {
            alert("Incorrect password or pin");
        }
    }
}

export default DataBase;