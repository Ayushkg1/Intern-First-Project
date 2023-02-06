
function showProfiles() {
    const formData = JSON.parse(localStorage.getItem('formData')) || [];
    const userProfiles = document.querySelector('#all__user__profiles');
    userProfiles.innerHTML = "";
    for (let i = 0; i < formData.length; i++) {
        userProfiles.innerHTML += `
                <div class="user-template">
                    <div class="user-image"><img src="${formData[i]['img']}" alt="Image view"></div>
                    <div class="user-details">
                        <div class="user-name">${formData[i]['name']}</div>
                        <div class="user-email">${formData[i]['email']}</div>
                        <div class="phone">${formData[i]['phone']}</div>
                    <div class="pwd">Ayush123</div>
                </div>
                <button class="delete-user" id="delete_${formData[i]['email']}">Delete User</button>
            </div>`;
    }
}

function showPosts() {
    console.log("hdiasf");
    const postData = JSON.parse(localStorage.getItem('postData')) || [];
    const userPosts = document.querySelector('#all__user__posts');
    userPosts.innerHTML = "";
    for (let i = 0; i < postData.length; i++) {
        userPosts.innerHTML += `
                            <div class="post-template">
                                <div class="post-data">
                                    <h2 class="post-heading">${postData[i]['heading']}</h2>
                                    <p class="post-content" id="content${postData[i]['id']}">${postData[i]['content']}</p>
                                </div>
                                <div class="control-buttons">
                                    <button class="delete-button" id="delete${postData[i]['id']}">Delete</button>
                                </div>
                            </div>`;
    }
}

class Navbar extends HTMLElement {
    constructor() {
        super();
        showProfiles();
        // this.checkCredentials();
        this.querySelector('.navbar').addEventListener('click', this.showItems);
    }
    showItems(e) {
        const id = e.target.id;
        if (id.includes('posts')) {
            this.querySelector('#' + id).classList.add('selected');
            this.querySelector('#' + id.substr(0, 6) + 'profiles').classList.remove('selected');
            showPosts();
            document.querySelector('#all__user__profiles').innerHTML = "";
        }
        if (id.includes('profiles')) {
            this.querySelector('#' + id).classList.add('selected');
            this.querySelector('#' + id.substr(0, 6) + 'posts').classList.remove('selected');
            showProfiles();
            document.querySelector('#all__user__posts') = "";
        }
    }

    // checkCredentials() {
    //     if(sessionStorage.getItem('email') != "superuser@gmail.com" || sessionStorage.getItem('pwd') != "SuperUser"){
    //         location.href = "index.html";
    //     }
    // }
}


class ProfileManager extends HTMLElement {
    constructor() {
        super();
        document.querySelector('#all__user__profiles').addEventListener('click', this.deleteProfile);
    }

    deleteProfile(e) {
        let id = e.target.id;
        console.log(id);
        if (id.includes("delete")) {
            id = id.substr(7);
            const formDataArray = JSON.parse(localStorage.getItem('formData'));
            let updatedFormData = [];
            for (let j = 0; j < formDataArray.length; j++) {
                if (formDataArray[j]['email'] != id) {
                    updatedFormData.push(formDataArray[j]);
                }
                else {
                    alert(formDataArray[j]['name'] + " successfully deleted.");
                }
            }
            localStorage.setItem('formData', JSON.stringify(updatedFormData));
            showProfiles();
        }
    }
}

class PostManager extends HTMLElement {
    constructor() {
        super();
        document.querySelector('#all__user__posts').addEventListener('click', this.deletePosts);
    }

    deletePosts(e) {
        let id = e.target.id;
        console.log(id);
        if (id.includes("delete")) {
            id = id.substr(6);
            const postDataArray = JSON.parse(localStorage.getItem('postData'));
            let updatedPostData = [];
            for (let j = 0; j < postDataArray.length; j++) {
                if (postDataArray[j]['id'] != id) {
                    updatedPostData.push(postDataArray[j]);
                }
                else {
                    alert(postDataArray[j]['heading'] + " successfully deleted.");
                }
            }
            localStorage.setItem('postData', JSON.stringify(updatedPostData));
            showPosts();
        }
    }
}

customElements.define('nav-bar', Navbar);
customElements.define('all-users', ProfileManager);
customElements.define('all-posts', PostManager);
