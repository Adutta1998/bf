const firebaseConfig = {
    apiKey: "AIzaSyCZCS43__9UjvbloZMRktdT4sAkoORVLBU",
    authDomain: "blooddonorkgec.firebaseapp.com",
    projectId: "blooddonorkgec",
    storageBucket: "blooddonorkgec.appspot.com",
    messagingSenderId: "710040344206",
    appId: "1:710040344206:web:9f369d218c1fd6b5199bdf"
};


// domcontentloaded
window.addEventListener("DOMContentLoaded", async () => {
    let app = firebase.initializeApp(firebaseConfig);
    let auth = firebase.auth();
    let db = firebase.firestore();

    auth.onAuthStateChanged(async user => {
        if (user) {
            let uid = user.uid;
            let userData = await db.collection("users").doc(uid).get();
            let data = userData.data();
            console.log(data);
            let requestsIds = data.requests
            for (let i = 0; i < requestsIds.length; i++) {
                let requestId = requestsIds[i];
                let requestData = await db.collection("requests").doc(requestId).get();
                let request = requestData.data();
                console.log(request);
                let q = ``;
                request.by.forEach(b => {
                    q += `<li>${b}</li>`
                })
                let p = `
                <div class='card-panel'>
                    <h5>Request Date: ${request.date.substr(0, 10)}</h5>
                    <h5>Need Date: ${request.requestNeedDate.substr(0, 10)}</h5>
                    <h5>Blood Group: ${request.bloodGroup}</h5>
                    <h5>Required: ${request.pins}</h5>
                    <h5>Managed: ${request.managed}</h5>
                    <h5>Status: ${request.status}</h5>
                    <ul class="collapsible">
                        <li>
                            <div class="collapsible-header">Managed By</div>
                            <div class="collapsible-body">
                               <ul>
                                  ${q}  
                               </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                `

                document.getElementById('container').innerHTML += p;
                var elems = document.querySelectorAll('.collapsible');
                var instances = M.Collapsible.init(elems, {});
            }
        } else {
            window.location.href = "login.html";
        }
    })
});
