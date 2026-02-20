const axios = require('axios');
async function test() {
    try {
        const login = await axios.post('http://localhost:8080/api/v1/users/login', { username: 'vendor', password: 'vendor123' });
        const token = login.data.token;
        const res = await axios.get('http://localhost:8080/api/v1/vendor/reservations', { headers: { Authorization: 'Bearer ' + token } });
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) { console.error(e.response ? e.response.data : e.message); }
}
test();
