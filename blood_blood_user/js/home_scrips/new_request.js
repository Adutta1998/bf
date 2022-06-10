const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};
window.addEventListener('DOMContentLoaded', async function () {
    var elems = document.querySelectorAll('.datepicker');
    let options = {};
    var instances = M.Datepicker.init(elems, options);

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    let uid = "";

    let hospitals = await db.collection('bloodbanks').get();
    let hospital_select = document.getElementById('hospital');
    hospitals = hospitals.docs;
    hospitals.forEach(hospital => {
        let option = document.createElement('option');
        option.value = hospital.id;
        option.innerHTML = hospital.data().parent_name;
        hospital_select.appendChild(option);
    });
    M.FormSelect.init(hospital_select, {});

    let request = document.querySelector('#request');
    request.addEventListener('click', async () => {
        let name = document.querySelector('#name').value;
        let city = document.querySelector('#city').value;
        let district = document.querySelector('#district').value;
        let state = document.querySelector('#state').value;
        let bloodgroup = document.querySelector('#bloodGroup').value;
        let contact = document.querySelector('#phone').value;
        let pins = document.querySelector('#pins').value;
        let date = document.querySelector('#rbdate').value;
        let hospital = document.querySelector('#hospital').value;
        let other_hospital = document.querySelector('#other_hospital').value;
        if (hospital == "other") {
            hospital = other_hospital;
        }
        let bloodRequisition = document.querySelector("#requisition").files[0];
        let docId = uuid.v4();
        uid = firebase.auth().currentUser.uid
        let data = {
            rid: docId,
            bloodGroup: bloodgroup,
            date: new Date().toISOString(),
            city: city,
            district: district,
            state: state,
            name: name,
            hospital: hospital,
            phone: contact,
            pins: pins,
            requestNeedDate: new Date(date).toISOString(),
            uid: uid,
            status: 'new',
        };
        db.collection('requests').doc(docId).set(data).then(async () => {
            await db.collection('users').doc(uid).update({
                requests: firebase.firestore.FieldValue.arrayUnion(docId)
            });
            let storageRef = firebase.storage().ref();
            let uploadTask = storageRef.child(`blood-requisition/${uid}_requisition`).put(bloodRequisition);
            uploadTask.on('state_changed', function (snapshot) {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }, function (error) {
                console.log(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    db.collection('requests').doc(docId).update({
                        requisition: downloadURL
                    });
                });
            });

            new M.Toast({
                html: "Request Successfull",
            });
            document.querySelector('#name').value = "";
            document.querySelector('#city').value = "";
            document.querySelector('#district').value = "";
            document.querySelector('#state').value = "";
            document.querySelector('#bloodGroup').value = "";
            document.querySelector('#phone').value = "";
            document.querySelector('#pins').value = "";
            document.querySelector('#rbdate').value = "";
        })

    });

});