function init() {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '237557512790-62lrrg2avvko7jlb8kl2e7ce5clfqh7v.apps.googleusercontent.com'

        });
    });
}
function signOut(){
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(()=> {
        window.location.replace('/logout');
    });
}