$(document).ready(function(){if(!sessionStorage.getItem("isLoggedIn")){window.location.href="/management/login"}else{var e=JSON.parse(sessionStorage.getItem("user"));if(e&&e.role==="admin"){window.location.href="/management/admin"}else if(e&&e.role==="agriculturist"){window.location.href="/management/agriculturist"}}});