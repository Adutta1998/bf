const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
let uid = "";
let bloodBanksArray = [];
auth.onAuthStateChanged(async user => {
    if (user) {
        uid = user.uid;
        console.log(uid);
        await fetchDetails(document.getElementById("city").value, document.getElementById("district").value);
    } else {
        window.location.href = "login.html";
    }
})

async function fetchDetails(c, d) {
    let userData = await db.collection('users').doc(uid).get();
    let data = userData.data();

    console.log(data);
    let city = c.length > 0 ? c : data.city;
    let district = d.length > 0 ? d : data.district;
    let bloodBanks = await db.collection('bloodbanks').where('city', '==', city).where('district', '==', district).onSnapshot(async (snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach(async (change) => {
            if (change.type == "added") {
                let data = change.doc.data();
                bloodBanksArray.push(data);
                console.log(bloodBanksArray);
                drawBloodBanks(bloodBanksArray);
            }
            if (change.type == "modified") {
                let data = change.doc.data();
                let index = bloodBanksArray.findIndex(x => x.id == data.id);
                bloodBanksArray[index] = data;
                console.log(bloodBanksArray);
                drawBloodBanks(bloodBanksArray);

            }
            if (change.type == "removed") {

                let data = change.doc.data();
                let index = bloodBanksArray.findIndex(x => x.id == data.id);
                bloodBanksArray.splice(index, 1);
                console.log(bloodBanksArray);
                drawBloodBanks(bloodBanksArray);

            }
        });
    });
}

document.getElementById("load").addEventListener("click", async () => {
    await fetchDetails(document.getElementById("city").value, document.getElementById("district").value);
})

function drawBloodBanks(bloodbanks) {
    let container = document.querySelector('#bloodBanks');
    bloodbanks.innerHTML = "";
    bloodbanks.forEach(bloodbank => {
        let p = `
        <tr>
                    <td>${bloodbank.name}</td>
                    <td>${bloodbank.city},${bloodbank.district}</td>
                    <td>${bloodbank.phone}</td>
                    <td>${bloodbank.email}</td>
                    <td>${bloodbank.fax}</td>
                    <td>${bloodbank.parent_name}</td>
                    <td>
                        <a class="btn btn-primary" href="/pages/bloodbankStatus.html?id=${bloodbank.id}">View</a>
                    </td>
            </tr>
        `
        container.innerHTML += p;
    })
}