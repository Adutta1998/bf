window.addEventListener("DOMContentLoaded", () => {
    let auth = firebase.auth();
    let logout = document.getElementById("logout");
    document.getElementById("logout").addEventListener("click", (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            window.location.href = "/index.html";
        }).catch(err => {
            console.log(err);
        })
    })

})


