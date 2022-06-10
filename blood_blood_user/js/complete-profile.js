// DomCOntentLoaded
const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};


window.addEventListener('DOMContentLoaded', async function () {
    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();
    let storage = firebase.storage();
    M.AutoInit();
    let status = [false, false];

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.uid == null) {
        window.location.href = "index.html";
    }
    let user = await db.collection("users").doc(params.uid).get();
    let userData = user.data();

    //===================================

    let pImage = document.getElementById("profile-image");
    let bReport = document.getElementById("blood-report");

    pImage.onchange = async function (e) {
        let file = e.target.files[0];
        // console.dir(pImage);
        var output = document.getElementById('output');
        // output.src = URL.createObjectURL(file);
        // output.style.opacity = 1;
        // output.onload = function () {
        //     URL.revokeObjectURL(output.src) // free memory
        // }
        let storageRef = storage.ref('profile-images/' + params.uid + "_profile");
        let uploadeTask = storageRef.put(file);
        uploadeTask.on('state_changed', (snapshot) => {
            document.querySelector(".progress").style.opacity = 1;
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.querySelector(".determinate").style.width = progress + "%";
        }, (error) => {
            console.log(error);
        }, () => {
            uploadeTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                document.querySelector(".progress").style.opacity = 0;
                output.src = downloadURL;
                output.style.opacity = 1;
                output.onload = function () {
                    URL.revokeObjectURL(output.src) // free memory
                }
                status[0] = true;
                db.collection("users").doc(params.uid).update({
                    profileImage: downloadURL
                });
            });
        });
    };


    bReport.onchange = async function (e) {
        let file = e.target.files[0];
        // console.dir(pImage);
        var output = document.getElementById('output-report');
        // output.src = URL.createObjectURL(file);
        // output.style.opacity = 1;
        // output.onload = function () {
        //     URL.revokeObjectURL(output.src) // free memory
        // }
        let storageRef = storage.ref('blood-reports/' + params.uid + "_report");
        let uploadeTask = storageRef.put(file);
        uploadeTask.on('state_changed', (snapshot) => {
            document.querySelector(".report").style.opacity = 1;
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.querySelector(".determinate").style.width = progress + "%";
        }, (error) => {
            console.log(error);
        }, () => {
            uploadeTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                document.querySelector(".report").style.opacity = 0;
                output.src = downloadURL;
                output.style.opacity = 1;
                output.onload = function () {
                    URL.revokeObjectURL(output.src) // free memory
                }
                status[1] = true;
                document.getElementById("continue").style.display = "block";
                db.collection("users").doc(params.uid).update({
                    bloodReport: downloadURL
                });
            });
        });
    };
    document.getElementById("continue").onclick = function () {
        window.location.href = "home.html?uid=" + params.uid;
    }

});