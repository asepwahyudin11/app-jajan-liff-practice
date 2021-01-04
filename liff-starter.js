window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655541988-GDEXlpLW";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("pageForm").classList.add('hide');
                document.getElementById("pageLogin").classList.add('hide');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hide');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("pageForm").classList.add('hide');
        document.getElementById("pageLogin").classList.add('hide');
        document.getElementById("liffIdErrorMessage").classList.remove('hide');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("pageForm").classList.add('hide');
            document.getElementById("pageLogin").classList.add('hide');
            document.getElementById("liffInitErrorMessage").classList.remove('hide');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    if (liff.isInClient()) {
        document.getElementById("pageLogin").classList.add('hide');
        document.getElementById("pageForm").classList.remove('hide');
        document.getElementById("linkLogout").classList.add('hide');
        document.getElementById("linkExternal").classList.remove('hide');
    } else {
        document.getElementById("pageLogin").classList.remove('hide');
        document.getElementById("pageForm").classList.add('hide');
        document.getElementById("linkLogout").classList.remove('hide');
        document.getElementById("linkExternal").classList.add('hide');
    }
    
    registerButtonHandlers();
}

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://appjajan.herokuapp.com/', // Isi dengan Endpoint URL aplikasi web Anda
            external: true
        });
    });

    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            if(liff.login()){
                document.getElementById("pageForm").classList.remove('hide');
                document.getElementById("pageLogin").classList.add('hide');
            }
        }
    });
 
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        data = JSON.parse(localStorage.getItem('items'));
        let food = 0;
        let drink = 0;
        let price = 0;
        for (i in data) {
            if(data[i].type == "Makanan") { food += data[i].qty; }
            else { drink += data[i].qty; }
            price += (data[i].qty * data[i].price);
        }

        let name = getName();
        let message = `Hai ${name},\n\nTerima kasih telah memesan makanan, berikut adalah review pesanannya:\n\n* ${food} Makanan\n* ${drink} Minuman\ndengan total pembayaran Rp.${price},-\n\nPesanan kakak akan segera diproses dan akan diberitahu jika sudah bisa diambil.\n\nMohon ditunggu ya!`;

        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': message
            }]).then(function() {
                window.alert('Pesan konfirmasi pesanan telah berhasil terkirim!');
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });
}

function getName() {
    liff.getProfile()
    .then(profile => {
        return profile.displayName;
    })
    .catch((err) => {
        return "Customer";
    });
}