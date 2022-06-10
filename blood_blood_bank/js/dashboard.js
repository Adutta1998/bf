const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};
document.addEventListener('DOMContentLoaded', function () {
    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();
    let storageRef = firebase.storage().ref();
    let bloodBank = JSON.parse(localStorage.getItem('bloodbank'));
    {

        let bloodBankName = document.getElementById('bloodBankName');
        let bloodBankAddress = document.getElementById('bloodBankAddress');
        let bloodBankState = document.getElementById('bloodBankState');
        let bloodBankPincode = document.getElementById('bloodBankPincode');
        let bloodBankPhone = document.getElementById('bloodBankPhone');
        let bloodBankEmail = document.getElementById('bloodBankEmail');
        let bloodBankFax = document.getElementById('bloodBankFax');
        let bloodBankLicence = document.getElementById('bloodBankLicence');
        let bloodBankLicenceFrom = document.getElementById('bloodBankLicenceFrom');
        let bloodBankLicenceTo = document.getElementById('bloodBankLicenceTo');
    }
    if (bloodBank) {
        bloodBankName.innerText = bloodBank.name;
        bloodBankAddress.innerText = bloodBank.city + ", " + bloodBank.district + ", " + bloodBank.state + ", " + bloodBank.pincode;
        bloodBankPhone.innerText = bloodBank.phone;
        bloodBankEmail.innerText = bloodBank.email;
        bloodBankFax.innerText = bloodBank.fax;
        bloodBankLicence.innerText = bloodBank.licence;
        bloodBankLicenceFrom.innerText = bloodBank.valid_from.toString().substring(0, 10);
        bloodBankLicenceTo.innerText = bloodBank.valid_till.toString().substring(0, 10);
    }

    let district = bloodBank.district;
    // get realtime users snapshots
    let users = [];
    db.collection('users').where('isDonor', '==', false).onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
            if (change.type == 'added') {
                let user = change.doc.data();
                if (user.district == district) {
                    users.push(user);
                    console.log(user);
                }
                drawUsersList(users);
            }
            if (change.type == 'modified') {
                let data = change.doc.data();
                let index = users.findIndex((user) => user.id == data.id);
                users[index] = data;
                drawUsersList(users);
            }
            if (change.type == 'removed') {
                let data = change.doc.data();
                let index = users.findIndex((user) => user.id == data.id);
                users.splice(index, 1);
                drawUsersList(users);
            }
        });
    })

})

function drawUsersList(users) {

    let userList = document.getElementById('users');
    userList.innerHTML = "";
    users.forEach((user) => {
        let p = `<div class="green lighten-4" style="padding: 16px;">
    <div class="row">
        <div class="col s10">
            <h4 style="margin:0;">${user.name}</h4>
            <h6 style="margin:0; margin-top: 8px;">Blood Group: <b><span>${user.bloodGroup}</span></b>
            </h6>
        </div>
        <div class="col s2">
            <a class="btn blue" href="/verifyUser.html?id=${user.id}">Verify</a>
        </div>
    </div>
</div>`;
        userList.innerHTML += p;
    })
}
