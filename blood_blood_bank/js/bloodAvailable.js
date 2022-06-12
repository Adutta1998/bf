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
let bloodBank = null;
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll('.datepicker');
    bloodBank = JSON.parse(localStorage.getItem("bloodbank"));
    var instances = M.Datepicker.init(elems, {});
    M.AutoInit();

    let collection = db.collection("available")
    collection.onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
            let data = change.doc.data();
            if (change.type == 'added') {
                if (change.doc.id == bloodBank.id) {
                    for (let key in data) {
                        document.getElementById(key).value = data[key]
                    }
                }
            }
            if (change.type == 'modified') {
                if (change.doc.id == bloodBank.id) {
                    for (let key in data) {
                        document.getElementById(key).value = data[key]
                    }
                }
            }
            if (change.type == 'removed') {
                if (change.doc.id == bloodBank.id) {
                    for (let key in data) {
                        document.getElementById(key).value = data[key]
                    }
                }
            }
        })
    })
});
async function bloodAvailable(id, qty) {
    let p = document.getElementById(id).value
    p = parseInt(p) + parseInt(qty)
    document.getElementById(id).value = p
    let hid = bloodBank.id
    let obj = {};
    obj[id] = p;

    let doc = db.collection("available").doc(hid)
    let s = await doc.get();
    if (s.exists) {
        await doc.update(obj)
    }
    else {
        await doc.set(obj)
    }
}

async function saveBlood() {
    let obj = {};
    let groups = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"]
    for (group of groups) {
        obj[group] = document.getElementById(group).value
    }
    let doc = db.collection("available").doc(bloodBank.id)
    await doc.set(obj)
    M.toast({ html: 'Saved', classes: "rounded" },)
}
