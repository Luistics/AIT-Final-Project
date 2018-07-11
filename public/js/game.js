//usernames and userIDs share the same indices.

let userIDs;
let usernames;
let currentEntry;
let profiles;

const startURL = 'http://linserv2.cims.nyu.edu:14396/play/start';
const gameURL = 'http://linserv2.cims.nyu.edu:14396/play/swipe';
const matchedURL = 'http://linserv2.cims.nyu.edu:14396/play/swipe/matched';

function main(){
    
    console.log("script loaded");

    startButton(startURL);
    handleTapRight();
    handleTapLeft();
}

function startButton(url){

    const startButton = document.getElementById("startBtn");
    startButton.addEventListener('click', function clicked(evt){

        evt.preventDefault();
        const req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onload = function(){

            if(req.status >= 200 && req.status < 400){

                let users = JSON.parse(req.responseText);

                userIDs = users.map(function(user){
                    return user._id;
                });

                usernames = users.map(function(user){
                    return user.local.username;
                });

                profiles = users.map(function(user){
                    return user.local.profile;
                });

                const splash = document.getElementById("splashDiv");
                splashDiv.classList.toggle("hidden");

                const game = document.getElementById("gameDiv");
                gameDiv.classList.toggle("hidden");

                query();
            }
        };

        req.send();
    });

}

function query(){

    let query = [];

    if(userIDs.length === 0){
        handleError(gameURL);
    }
    else{
        currentEntry = userIDs.pop();
        query.push('user_id=' + encodeURIComponent(currentEntry));
        let newURL = gameURL + "?" + query;
        handleProfile(newURL);
    }


}

function handleError(url){

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {

        if (req.status >= 200 && req.status < 400) {

            const splash = document.getElementById("splashDiv");
            splashDiv.classList.toggle("hidden");

            const game = document.getElementById("gameDiv");
            gameDiv.classList.toggle("hidden");

            const gameDone = document.getElementById("gameDone");
            gameDone.classList.remove("hidden");
        }
    };

    req.send();
}

function handleProfile(url){

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {

        if(req.status >= 200 && req.status < 400){

            let profile = JSON.parse(req.responseText);
            console.log(profile);


            const title = document.getElementById("usernameH1");
            title.textContent = profile.username;

            const games = document.getElementById("gameSpan");
            const likes = document.getElementById("likeSpan");

            likes.textContent = "";
            games.textContent = "";


            if(profile.likes.length === 0){
                likes.textContent += " No liked users yet...";
            }
            else{
                for(let i = 0; i < profile.likes.length; i++){
                    likes.textContent += profile.likes[i] + "\r\n";
                }
            }


            for(let i = 0; i < profile.games.length; i++){
                games.textContent += profile.games[i] + "\r\n";
            }

            const psn = document.getElementById("psnID");
            psn.textContent = " " + profile.psnID;


            const epic = document.getElementById("epicID");
            const xbox = document.getElementById("xboxID");
            const location  = document.getElementById("locationID");
            const age = document.getElementById("ageID");
            const gender = document.getElementById("genderID");
            const aboutHeader = document.getElementById("aboutHeader");
            const desc = document.getElementById("descriptionP");



            if(!profile.epicID){
                epic.textContent = " Not set."
            }
            else{
                epic.textContent = " " + profile.epicID;
            }

            if(!profile.xboxLiveID){
                xbox.textContent = " Not set."
            }
            else{
                xbox.textContent = " " + profile.xboxLiveID;
            }

            if(!profile.age){
                age.textContent = " Not set."
            }
            else{
                age.textContent = " " + profile.age;
            }

            if(!profile.gender){
                gender.textContent = " Not set."
            }
            else{
                gender.textContent = " " + profile.gender;
            }

            if(!profile.description){
                desc.textContent = " Not set."
            }
            else{
                desc.textContent = profile.description;
            }

            location.textContent = " " + profile.location;
            aboutHeader.textContent = "About " + profile.username + ":";
        }

    };

    req.send();

}


function handleTapLeft(){

    const leftBtn = document.getElementById('swipeLeft');
    leftBtn.addEventListener('click', function(evt){

        evt.preventDefault();
        query();
    });

}

function handleTapRight(){

    const rightBtn = document.getElementById('swipeRight');
    rightBtn.addEventListener('click', function (evt) {

        evt.preventDefault();
        const matched = currentEntry;

        const req = new XMLHttpRequest();
        req.open('POST', matchedURL, true);
        //look into this
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        req.onload = function () {
            query();
        };

        req.send('matched=' + matched);

    });

}

function elementWithContent(tagType, text){

    let tag = document.createElement(tagType);
    tag.appendChild(document.createTextNode(text));
    return tag;
}


document.addEventListener("DOMContentLoaded", main);