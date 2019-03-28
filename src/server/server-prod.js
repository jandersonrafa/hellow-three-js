const express = require('express');
const path = require('path');
const app = express(), DIST_DIR = __dirname, HTML_FILE = path.join(DIST_DIR, 'index.html')
const ldap = require('ldapjs');

app.use(express.static(DIST_DIR))

app.get('/', (request, response) => {
    response.sendFile(HTML_FILE)
})

const PORT = process.env.PORT || 8080

const BASE_URL = '/api';

app.get(BASE_URL + '/login', (req, res) => {

    const username = req.query.username
    const password = req.query.password
    const client = ldap.createClient({
        url: 'ldap://10.0.100.20/DC=cwinet,DC=local'
    });

    var opts = {
        filter: '(&(objectclass=user)(samaccountname=' + username + '))',
        scope: 'sub',
        attributes: ['objectGUID', 'sAMAccountName', 'cn', 'thumbnailPhoto', 'mail', 'manager', 'memberOf']
    };

    client.bind('cwinet\\' + username, password, function (err) {
        if (err) {
            res.status("401");
            res.json("Usuário ou senha invalido");
        } else {
            
            client.search('DC=cwinet,DC=local', opts, function (err, search) {
                search.on('searchEntry', function (entry) {
                    var user = entry.object;
                    user.thumbnailPhoto = null
                    res.json(user);
                });
            });
        }
    });

});

app.listen(PORT, () => {
    console.log(`THREE listening on ${PORT}. Press Ctrl+C to quit.`)
})