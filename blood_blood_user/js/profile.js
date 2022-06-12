const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};

window.addEventListener('DOMContentLoaded', function () {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const auth = firebase.auth();



    auth.onAuthStateChanged(async user => {
        if (user) {
            let uid = user.uid;
            let userData = await db.collection('users').doc(uid).get();
            let data = userData.data();
            console.log(data);
            changeProfileDetails(data);
            await myRequests(data.requests, db);
        } else {
            window.location.href = "login.html";
        }
    })
})

function changeProfileDetails(data) {
    document.querySelector('#name').innerText = data.name;
    document.querySelector('#email').innerText = data.email;
    document.querySelector('#phone').innerText = data.phone;
    document.querySelector('#address').innerText = `${data.address}, ${data.state}`;
    document.querySelector('#bloodGroup').innerText = data.bloodGroup;
    document.querySelector("#profileImage").src = data.profileImage;
    document.querySelector('#dob').innerText = data.dateOfBirth;
    document.querySelector('#lbdDate').innerText = data.lbddate;
}

async function myRequests(myRequestIds, db) {
    let container = document.querySelector('#myRequestsProfilePage');
    myRequestIds.forEach(async (id) => {
        let requestData = await db.collection('requests').doc(id).get();
        let data = requestData.data();
        console.log(data);
        if (data) {
            let date = new Date(data.requestNeedDate);
            card = `<li class="collection-item avatar">
            <i class="material-icons circle white  red-text">water_drop</i>
            <span class="title">Date: <b>${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}</b></span>
            <br/>
            <p>
            Summary:
            <span class="title-mini">Required ${data.pins} pin ${data.bloodGroup} blood on ${data.requestNeedDate} at ${data.location}</span>
            </p>
            <p>
                Status: <span class="title-mini ">${(data.status == "new") ? "Pending" : (data.status == "accepted") ? "Accepted" : "Rejected"
                }</span>
            </p>
        </li>`;
            container.innerHTML += card;
        }
    })
}