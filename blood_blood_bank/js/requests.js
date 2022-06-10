const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};
let app = firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
let db = firebase.firestore();
let storageRef = firebase.storage().ref();
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {});
    M.AutoInit();


    let bloodbank = JSON.parse(localStorage.getItem("bloodbank"));
    let ct = bloodbank.city;
    let requests = [];

    // select all hocuments where hospital = pHos
    db.collection("requests")
        .where("city", "==", ct)
        .where('status', "==", "new")
        .onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            changes.forEach((change) => {
                if (change.type == 'added') {
                    let request = change.doc.data();
                    console.log("Added", request);
                    requests.push(request);
                    drawTickets(requests);
                }
                if (change.type == 'modified') {
                    let data = change.doc.data();

                    let index = requests.findIndex((request) => request.id == data.id);
                    console.log("modified", data);

                    requests[index] = data;
                    drawTickets(requests);
                }
                if (change.type == 'removed') {
                    let data = change.doc.data();
                    let index = requests.findIndex((request) => request.id == data.id);
                    requests.splice(index, 1);
                    drawTickets(requests);
                }
            });
        })
    console.log(requests);
    function drawTickets(requests) {
        document.getElementById("requests").innerHTML = "";
        requests.forEach(request => {
            let t = `<tr>
            <th>${request.name}</th>
            <th>${request.phone}</th>
            <th>${request.bloodGroup}</th>
            <th>${request.pins}</th>
            <th>${request.managed ?? 0}</th>
            <th>${request.responses ?? "None"}</th>
            <th>
                <a href="/request.html?rid=${request.rid}">Verify Details</a>
            </th>
        </tr>`
            document.getElementById("requests").innerHTML += t;
        })
    }
});
function confirmTicket(ticketId) {
    db.collection("requests").doc(ticketId).update({
        status: "confirmed"
    })
}

function deleteTicket(ticketId) {
    db.collection("requests").doc(ticketId).delete();
}