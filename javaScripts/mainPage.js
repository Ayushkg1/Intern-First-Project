class Header extends HTMLElement {
    constructor() {
        super();
        this.checkCredentials();
        const logoutBtn = this.querySelector('#logout');
        logoutBtn.onclick = this.logout;
        const user = this.getUser();
        this.querySelector('#user__image').setAttribute('src', user['img']);
        this.querySelector('#add__post__button').addEventListener('click', function () {
            document.querySelector('.popup').style.display = 'flex';
        });


    }

    checkCredentials() {
        const formDataArray = JSON.parse(localStorage.getItem('formData'));
        let preventToLoad = false;
        if (!formDataArray) location.href = "index.html";
        for (let i = 0; i < formDataArray.length; i++) {
            if (formDataArray[i]['email'] == sessionStorage.getItem('email')) {
                preventToLoad = true;
            }
        }
        if (preventToLoad == false) {
            location.href = "index.html";
        }
    }

    getUser() {
        return JSON.parse(localStorage.getItem('formData')).find(x => x['email'] == sessionStorage.getItem('email'));
    }

    logout() {
        sessionStorage.clear();
        location.href = "index.html";
        e.preventDefault();
    }
}

class ShadowTimer extends HTMLElement {
    constructor() {
        super();
        const shadowTimer = this.attachShadow({ mode:'closed'});
        this.showTime = document.createElement('p');
        this.loginTime = JSON.parse(sessionStorage.getItem('loginTime'));
        setInterval(this.myTimer.bind(this), 1000);
        // setInterval(this.myTimer(), 1000);
        const styling = document.createElement('style');
        styling.textContent = this.getCSS();
        shadowTimer.append(styling);
        shadowTimer.append(this.showTime);
    }

    myTimer() {
        let now = new Date().getTime();
        let span = now - this.loginTime;
        let days = Math.floor(span / (1000 * 60 * 60 * 24));
        let hours = Math.floor((span % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((span % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((span % (1000 * 60)) / 1000);
        this.showTime.innerHTML = `Loggedin since :<br> ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    getCSS() {
        return `
        p{  
            margin-left: 18px;
            position: absolute;
            color:indianred;
            font-size:16px;
            font-weight: 600;
            line-height: 24px;
            background-color: rgb(237, 237, 237);
            padding: 10px;
            border-radius: 7px;
        }
        @media (max-width:1240px) {
            p{
                position: relative;
                width: 60%;
            }
        }
        `;
    }
}



function returnNumber(str) {
    let id_digit = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= 9) {
            id_digit += str[i];
        }
    }
    return id_digit;
}

function commentDisplayer(id) {
    id = returnNumber(id);
    // console.log(id);
    const commentData = JSON.parse(localStorage.getItem('comment_' + id)) || [];
    const commentTemplate = document.querySelector('#comment__display' + id);
    commentTemplate.innerHTML = "";
    let fragmentComment = document.createDocumentFragment('div');
    // console.log(commentData);
    if (commentData != null) {
        for (let i = 0; i < commentData.length; i++) {
            const addingComment = document.createElement('div');
            addingComment.innerHTML = `<h4 class="user-name">${commentData[i]['username']}</h4>\
                                        <p class="user-comment-content">${commentData[i]['content']}</p>\
                                        <hr class="line-break"/>`;
            fragmentComment.appendChild(addingComment);
        }
        // console.log(commentTemplate);
        // console.log(fragmentComment);
        commentTemplate.appendChild(fragmentComment);
    }
}

class PostHandler extends HTMLElement {
    constructor() {
        super();
        this.postDisplayer();

        this.querySelector('#close__popup').addEventListener('click', function () {
            document.querySelector('.popup').style.display = 'none';
        });

        this.querySelector('#form__add__post').onsubmit = this.addPost;

        const postArea = document.querySelector('#post__display');
        postArea.addEventListener('click', this.performAction, true);

        const addCommentBtn = document.querySelector('#post__display');
        addCommentBtn?.addEventListener('submit', this.addComment, false);
    }

    addPost() {
        let dt = new Date;
        let id = dt.getTime(),
            heading = document.getElementById('post__heading').value,
            content = document.getElementById('post__content').value,
            email = sessionStorage.getItem('email'),
            likerIds = [],
            date = dt.toLocaleDateString();

        let postData = JSON.parse(localStorage.getItem('postData')) || [];

        let exist = postData.length &&
            JSON.parse(localStorage.getItem('postData')).some(data =>
                data.heading.toLowerCase() == heading.toLowerCase()
            );

        if (!exist) {

            postData.push({ id, email, heading, content, likerIds, date });
            localStorage.setItem('postData', JSON.stringify(postData));
            document.querySelector('#form__add__post').reset();
            alert("Congratulations! Post added successfully.");
            location.reload();

        }
        else {
            alert("Ooopppssss... Duplicate topic found!!!\nPlease change the topic");
        }
        e.preventDefault();
    }

    postDisplayer() {
        const postDisplay = document.querySelector('#post__display');
        const postDataArray = JSON.parse(localStorage.getItem('postData'));
        let fragmentPost = document.createDocumentFragment();
        if (postDataArray != null) {
            for (let i = 0; i < postDataArray.length; i++) {
                const addingPost = document.createElement('div');
                addingPost.setAttribute('class', 'post-template');

                addingPost.innerHTML = this.postTemplate(postDataArray[i]);
                fragmentPost.appendChild(addingPost);
            }
            postDisplay.appendChild(fragmentPost);
        }
    }

    postTemplate(postDetails) {
        const currentLikeCount = postDetails['likerIds'] == undefined ? 0 : postDetails['likerIds'].length;
        const whether = postDetails['likerIds'].includes(sessionStorage.getItem('email')) ? 'liked' : 'unliked';
        return `<h2 class="post-heading"> ${postDetails['heading']} </h2>
                <p class="post-content"> ${postDetails['content']} </p>\
                <p class="posted-date">Posted Date : ${postDetails['date']}</p>
                <div class="controller">\
                    <h3 class="like-area"><span class="like-button ${whether}" id="like${postDetails['id']}">&#x2764;</span> <span class="like-counter" id=n${postDetails['id']}>${currentLikeCount}</span></h3>\
                    <button class="comment-button" id="comment${postDetails['id']}">Comment</button>\
                </div><br><br>\
                <div class="comment-section" id="comment__section${postDetails['id']}">\
                    <hr class="line-break">\
                    <button id="close${postDetails['id']}" class="comment-closer">&#10060;</button>\
                    <h3 class="comment-heading">Welcome to Comment Section</h3>\
                    <div class="user-comments" id="comment__display${postDetails['id']}">\
                        <p></p>
                    </div>\
                    <form role="form" class="comment-form" id="submit${postDetails['id']}" autocomplete="off">\
                        <input type="text" name="comment" class="write-comment" id="write__comment${postDetails['id']}" placeholder="Write your comment..."\
                                maxlength="50" required>\
                        <button type="submit" class="submit-comment">Done</button>\
                    </form>\
                </div>`;
    }

    performAction(e) {
        let id = e.target.id;
        // console.log(id);
        if (id.includes('like')) {
            id = returnNumber(id);
            const likeCounter = document.querySelector('#n' + id);
            const currentUserEmail = sessionStorage.getItem('email');
            const postDataArray = JSON.parse(localStorage.getItem('postData'));
            for (let i = 0; i < postDataArray.length; i++) {
                if (postDataArray[i]['id'] == id) {
                    if (postDataArray[i]['likerIds'] && postDataArray[i]['likerIds'].includes(currentUserEmail)) {
                        const indexOfEmail = postDataArray[i]['likerIds'].indexOf(currentUserEmail);
                        postDataArray[i]['likerIds'].splice(indexOfEmail, 1);
                        document.querySelector('#like' + id).classList.remove("liked");
                        document.querySelector('#like' + id).classList.add("unliked");

                    } else {
                        postDataArray[i]['likerIds'].push(currentUserEmail);
                        document.querySelector('#like' + id).classList.add("liked");
                        document.querySelector('#like' + id).classList.remove("unliked");

                    }
                    likeCounter.innerHTML = postDataArray[i]['likerIds'] == undefined ? 0 : postDataArray[i]['likerIds'].length;
                }
            }
            localStorage.setItem('postData', JSON.stringify(postDataArray));
        }

        else if (id.includes('comment')) {
            id = returnNumber(id);
            commentDisplayer(id);
            document.querySelector('#comment__section' + id) ? document.querySelector('#comment__section' + id).classList.add("show-comment-section") : null;
            document.querySelector('#comment' + id).style.display = 'none';
        }
        else if (id.includes('close')) {
            id = returnNumber(id);
            document.querySelector('#comment' + id).style.display = 'block';
            document.querySelector('#comment__section' + id).classList.remove("show-comment-section");
        }
        else{
            console.log(e);
        }
    }

    addComment(e) {
        // alert("hi bro");
        e.preventDefault();

        console.log(e.target.id);
        const id = returnNumber(e.target.id);
        let email = sessionStorage.getItem('email');
        let content = document.querySelector('#write__comment' + id).value;
        const user = JSON.parse(localStorage.getItem('formData')).find(element => element['email'] == email);
        let username = user['name'];
        let currentCommentData = JSON.parse(localStorage.getItem("comment_" + id)) || [];
        currentCommentData.push({ username, content });
        console.log(currentCommentData);
        localStorage.setItem("comment_" + id, JSON.stringify(currentCommentData));
        document.querySelector('#submit' + id).reset();
        commentDisplayer(id);

    }
}

customElements.define('head-er', Header);
customElements.define('shadow-timer', ShadowTimer);
customElements.define('post-display', PostHandler);
