const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {});
    M.AutoInit();

    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();
    let storageRef = firebase.storage().ref();





    let submit = document.getElementById("submit");
    let name = document.getElementById("name");
    let parent_name = document.getElementById("parent_name");
    let city = document.getElementById("city");
    let district = document.getElementById("district");
    let state = document.getElementById("state");
    let pincode = document.getElementById("pincode");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let fax = document.getElementById("fax");
    let licence = document.getElementById("licence");
    let valid_from = document.getElementById("valid_from");
    let valid_till = document.getElementById("valid_till");
    let file = document.getElementById("file");
    let password = document.getElementById("password");

    submit.addEventListener("click", async function () {
        let error = "";
        if (name.value == "") {
            error += "Name is required<br>";
        }
        if (parent_name.value == "") {
            error += "Parent Name is required<br>";
        }
        if (city.value == "") {
            error += "Address is required<br>";
        }
        if (state.value == "") {
            error += "State is required<br>";
        }
        if (pincode.value == "") {
            error += "Pincode is required<br>";
        }
        if (email.value == "") {
            error += "Email is required<br>";
        }
        if (phone.value == "") {
            error += "Phone is required<br>";
        }
        if (licence.value == "") {
            error += "Licence is required<br>";
        }
        if (valid_from.value == "") {
            error += "Valid From is required<br>";
        }
        if (valid_till.value == "") {
            error += "Valid Till is required<br>";
        }
        if (file.value == "") {
            error += "File is required<br>";
        }
        if (password.value == "") {
            error += "Password is required<br>";
        }
        if (error != "") {
            M.toast({ html: error, classes: 'red' });
            return;
        }

        let bloodBank = {
            name: name.value,
            parent_name: parent_name.value,
            city: city.value,
            district: district.value,
            state: state.value,
            pincode: pincode.value,
            email: email.value,
            phone: phone.value,
            fax: fax.value,
            licence: licence.value,
            valid_from: new Date(valid_from.value).toISOString(),
            valid_till: new Date(valid_till.value).toISOString(),
            password: password.value,
            registered_on: new Date().toISOString()
        }
        M.toast({ html: `Loading.. please wait`, classes: 'blue' });
        db.collection("bloodbanks").add(bloodBank).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            let actualFile = file.files[0];
            let storageRef = firebase.storage().ref(`bloodbanks/${docRef.id}`);
            let task = storageRef.put(actualFile);
            task.on("state_changed",
                function progress(snapshot) {
                    let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(percentage);
                    M.toast({ html: `Uploading ${percentage.toFixed(2)}%`, classes: 'blue' });
                }
                , function error(err) {
                    console.log(err);
                    M.toast({ html: `Error ${err}`, classes: 'red' });
                }
                , async function complete() {
                    console.log("Completed");
                    M.toast({ html: `Uploaded`, classes: 'green' });
                    let url = await task.snapshot.ref.getDownloadURL();
                    await db.collection("bloodbanks").doc(docRef.id).set({
                        licence: url
                    }, {
                        merge: true
                    });
                    M.toast({ html: `Redirecting....`, classes: 'green' });
                    localStorage.setItem("bloodbank", JSON.stringify(bloodBank));
                    setTimeout(function () {
                        window.location.href = "/dashboard.html";
                    }, 1000);

                }
            );
        }
        ).catch(function (error) {
            console.log("Error adding document: ", error);
            M.toast({ html: `Error ${error}`, classes: 'red' });
        }
        );
    })


});