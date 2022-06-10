const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};


window.addEventListener("DOMContentLoaded", async () => {

    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();

    let hospitals = await db.collection('bloodbanks').get();
    let hospital_select = document.getElementById('hospital');
    hospitals = hospitals.docs;
    hospitals.forEach(hospital => {
        let option = document.createElement('option');
        option.value = hospital.data().parent_name;
        option.innerHTML = hospital.data().parent_name;
        hospital_select.appendChild(option);
    });
    M.FormSelect.init(hospital_select, {});

    let name = document.getElementById("name");
    let phone = document.getElementById("phone");
    let bloodGroup = document.getElementById("bloodGroup");
    let hospital = document.getElementById("hospital");
    let other_hospital = document.querySelector('#other_hospital');
    let ticketDate = document.getElementById("ticketDate");
    auth.onAuthStateChanged(async function (user) {
        if (user) {
            updateStatus(user.uid);
            let uid = user.uid;
            let userData = await db.collection('users').doc(uid).get();
            userData = userData.data();
            name.value = userData.name;
            phone.value = userData.phone;
            bloodGroup.value = userData.bloodGroup;
            M.updateTextFields();
            console.log(userData);
            let docId = uuid.v4();
            document.getElementById("raiseTicket").addEventListener("click", async () => {
                let hval = hospital.value == "other" ? other_hospital : hospital.value;
                console.log(hval, other_hospital.value, hospital.value)
                let data = {
                    name: name.value,
                    phone: phone.value,
                    bloodGroup: bloodGroup.value,
                    hospital: hval,
                    uid: uid,
                    ticketDate: new Date(
                        ticketDate.value
                    ).toISOString(),
                    docId: docId,
                }
                await db.collection("tickets").doc(docId).set(data);
                alert("Ticket Raised");
                name.value = "";
                phone.value = "";
                bloodGroup.value = "";
                hospital.value = "";
            });


        } else {
            console.log("not logged in");
        }
    });

    function updateStatus(uid) {
        let rqsts = [];
        let requests = db.collection('tickets')
            .where("uid", '==', uid);
        requests.onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type == 'added') {
                    let request = change.doc.data();
                    rqsts.push(request);
                    console.log(request);
                    drawRequests(rqsts);

                }
                if (change.type == 'removed') {
                    let request = change.doc.data();
                    let index = rqsts.indexOf(request);
                    rqsts.splice(index, 1);
                    drawRequests(rqsts);

                }
                if (change.type == 'modified') {
                    let request = change.doc.data();
                    console.log(request);
                    rqsts.forEach((r, index) => {
                        if (r.docId == request.docId) {
                            rqsts[index] = request;
                        }
                    });
                    drawRequests(rqsts);
                }
            });
        });
    }

    function drawRequests(rqsts) {
        let container = document.querySelector('#status');
        rqsts.forEach(rqst => {
            let card = getCard(rqst.ticketDate, rqst.name, rqst.hospital);
            container.innerHTML += card;
        })
    }
    function getCard(date, name, hospital) {
        let d = new Date(date);
        let dateString = d.getDate().toString().padStart(2, "0") + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d.getFullYear();
        return `
        <div class="card-panel orange white-text">
                            <h4>${dateString}</h4>
                            <div class="title-moderate">
                                <span class="red-text">Name:</span>
                                <span>${name}</span>
                            </div>
                            <div class="title-moderate">
                                <span class="red-text">Hospital:</span>
                                <span>${hospital}</span>
                            </div>
                        </div>
        `;
    }
})