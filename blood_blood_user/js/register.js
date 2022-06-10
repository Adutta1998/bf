// DomCOntentLoaded
const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};


window.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    var elems = document.querySelectorAll('.datepicker');
    let options = {
        yearRange: [new Date().getFullYear() - 18 - 60, new Date().getFullYear()],
        // defaultDate: new Date(`Jan 01,${new Date().getFullYear() - 18 - 60}`),
    };
    var instances = M.Datepicker.init(elems[0], options);
    console.log(instances);


    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();


    let name = document.querySelector("#name");
    let city = document.querySelector("#city");
    let district = document.querySelector("#district");
    let state = document.querySelector("#state");
    let phone = document.querySelector("#phone");
    let dateOfBirth = document.querySelector("#dateOfBirth");
    let bloodGroup = document.querySelector("#bloodGroup");
    let weight = document.querySelector("#weight");
    let lbddate = document.querySelector("#lbddate");
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");

    let registerBtn = document.querySelector("#loginSubmit");

    registerBtn.addEventListener("click", async function (e) {
        let errorMessage = "";
        if (name.value == "") {
            errorMessage += "Name is required <br>";
        } else if (city.value == "") {
            errorMessage += "Address is required <br>";
        } else if (district.value == "") {
            errorMessage += "District is required <br>";
        } else if (state.value == "") {
            errorMessage += "State is required <br>";
        } else if (phone.value == "") {
            errorMessage += "Phone is required <br>";
        } else if (dateOfBirth.value == "") {
            errorMessage += "Date of Birth is required <br>";
        }
        else if (getAge(dateOfBirth.value) < 18 || getAge(dateOfBirth.value) > 60) {
            errorMessage += "Age should be between 18 to 60, Otherwise you are not eligible to donate blood <br>";
        }
        else if (bloodGroup.value == "") {
            errorMessage += "Blood Group is required <br>";
        } else if (weight.value == "") {
            errorMessage += "Weight is required <br>";
        } else if (weight.value < "50") {
            errorMessage += "Weight should be greater than 50kg <br>";
        }
        else if (lbddate.value == "") {
            errorMessage += "LBD Date is required <br>";
        } else if (getMonths(lbddate.value) < 6) {
            errorMessage += "Last Blood Donation Date should be greater than 6 months <br>";
        } else if (email.value == "") {
            errorMessage += "Email is required <br>";
        } else if (password.value == "" || password.value.length < 6) {
            errorMessage += "Password is required and length must be greater than 6 <br>";
        }
        if (errorMessage != "") {
            e.preventDefault();
            new M.Toast({
                html: errorMessage,
            });
        } else {
            try {
                let creds = await auth.createUserWithEmailAndPassword(email.value, password.value);
                if (creds.user.uid) {
                    let user = await db.collection("users").doc(creds.user.uid).set({
                        name: name.value,
                        city: city.value,
                        district: district.value,
                        state: state.value,
                        phone: phone.value,
                        dateOfBirth: dateOfBirth.value,
                        bloodGroup: bloodGroup.value,
                        weight: weight.value,
                        lbddate: lbddate.value,
                        email: email.value,
                        password: password.value,
                        isDonor: false,
                        id: creds.user.uid,
                    });
                    if (user) {
                        new M.Toast({
                            html: "Registered Successfully",
                        });
                        window.location.href = "complete-profile.html";
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    });


    function getAge(dob) {
        let d = Date.now();
        let md = new Date(dob);
        let age = Math.floor((d - md) / (365.25 * 24 * 60 * 60 * 1000));
        return age;
    }

    function getMonths(dob) {
        let d = Date.now();
        let md = new Date(dob);
        let months = Math.floor((d - md) / (30 * 24 * 60 * 60 * 1000));
        return months;
    }
});