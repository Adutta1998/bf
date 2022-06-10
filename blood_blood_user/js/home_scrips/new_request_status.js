window.addEventListener('DOMContentLoaded', async function () {
    const db = firebase.firestore();
    let rqsts = [];
    drawRequests(rqsts);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let uid = user.uid;
            let requests = db.collection('requests')
                .where('status', 'in', ['new', 'accepted'])
                .where('uid', '==', uid);

            requests.onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    if (change.type == 'added') {
                        let request = change.doc.data();
                        rqsts.push(request);
                        //console.log(request);
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
                        //console.log(request);
                        rqsts.forEach((r, index) => {
                            if (r.rid == request.rid) {
                                rqsts[index] = request;
                            }
                        });
                        drawRequests(rqsts);
                    }
                });
            });
        } else {
            console.log("not logged in");
        }
    });

    function drawRequests(rqsts) {
        // console.log(rqsts);
        let container = document.querySelector('#oldrstatus');
        container.innerHTML = "";
        if (rqsts.length <= 0) {
            container.innerText += "No Requests";
        }
        rqsts.forEach(rqst => {
            let card = "";
            if (rqst.status == 'new') {
                card = `<div class="card-panel red darken-3 white-text">
                <span class="heading">Required ${rqst.pins} pin ${rqst.bloodGroup} blood on ${rqst.requestNeedDate} at ${rqst.location}</span>
                <br>
                <hr>
                <span class="status">
                    Status: <b>Not Reviewed till now.</b>
                </span>
                
            </div>`;
            }
            if (rqst.status == 'accepted') {
                card = `<div class="card-panel green white-text">
                <h5>Required ${rqst.pins} pin ${rqst.bloodGroup} blood on ${rqst.requestNeedDate} at ${rqst.location}</h5>
                <br>
                <hr>
                <h6>
                    Status: <b>Accepted</b>
                </h6>
                <div>
                    <button class="btn green darken-3 white-text">
                        Contact Donor
                    </button>
                </div>
            </div>`;
            }
            container.innerHTML += card;
        })
    }
});

