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
    let pHos = bloodbank.parent_name;
    let tickets = [];

    // select all hocuments where hospital = pHos
    db.collection("tickets").where("hospital", "==", pHos).onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
            if (change.type == 'added') {
                let ticket = change.doc.data();
                console.log("Added", ticket);
                tickets.push(ticket);
                drawTickets(tickets);
            }
            if (change.type == 'modified') {
                let data = change.doc.data();

                let index = tickets.findIndex((ticket) => ticket.id == data.id);
                console.log("modified", data);

                tickets[index] = data;
                drawTickets(tickets);
            }
            if (change.type == 'removed') {
                let data = change.doc.data();
                let index = tickets.findIndex((ticket) => ticket.id == data.id);
                tickets.splice(index, 1);
                drawTickets(tickets);
            }
        });
    })
    console.log(tickets);
    function drawTickets(tickets) {
        document.getElementById("tickets").innerHTML = "";
        tickets.forEach(ticket => {
            let t = `<tr>
            <th>${ticket.name}</th>
            <th>${ticket.phone}</th>
            <th>${ticket.bloodGroup}</th>
            <th>${ticket.status ?? "No-Status"}</th>
            <th>
                <button class="btn-floating btn-small waves-effect waves-light red" onclick="deleteTicket('${ticket.docId}')"><i class="material-icons">delete</i></button>
                <button class="btn-floating btn-small waves-effect waves-light green" onclick="confirmTicket('${ticket.docId}')"><i class="material-icons">check</i></button>
            </th>
        </tr>`
            document.getElementById("tickets").innerHTML += t;
        })
    }
});
function confirmTicket(ticketId) {
    db.collection("tickets").doc(ticketId).update({
        status: "confirmed"
    })
}

function deleteTicket(ticketId) {
    db.collection("tickets").doc(ticketId).delete();
}