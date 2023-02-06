function returnNumber(str) {
    let id_digit = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= 9) {
            id_digit += str[i];
        }
    }
    return id_digit;
}


class MyPosts extends HTMLElement {
    constructor() {
        super();
        console.log(this);
        this.displayMyPosts();
        this.checkCredentials();
        const postArea = document.querySelector('#post__display');
        postArea.addEventListener('click', this.performAction, false);
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

    displayMyPosts() {
        const postDataArray = JSON.parse(localStorage.getItem('postData')) || [];
        const postDisplay = document.querySelector('#post__display');
        // const myPosts = [];
        if (postDataArray != null) {
            let fragmentPost = document.createDocumentFragment();
            for (let i = 0; i < postDataArray.length; i++) {
                if (sessionStorage.getItem('email') == postDataArray[i]['email']) {
                    // myPosts.push(postDataArray[i]);
                    const addingPost = document.createElement('div');
                    addingPost.setAttribute('class', 'post-template');
                    addingPost.innerHTML = this.getTemplate(postDataArray[i]);
                    fragmentPost.appendChild(addingPost);
                }
            }
            postDisplay.appendChild(fragmentPost);
        }
    }

    getTemplate(postDetails) {
        return `<h2 class="post-heading">${postDetails['heading']}</h2>
                <p class="post-content" id="content${postDetails['id']}">${postDetails['content']}</p>
                <div class="control-buttons">
                    <button class="edit-button" id="edit${postDetails['id']}">Edit</button>
                    <button class="delete-button" id="delete${postDetails['id']}">Delete</button>
                </div>`;
    }

    performAction(e) {
        let id = e.target.id;
        if(id.includes('edit')){
            id = returnNumber(id);
            const editButton = document.querySelector('#edit'+id);
            const content = document.querySelector('#content'+id);
            if (editButton.innerHTML == 'Edit') {
                editButton.innerHTML = 'Done';
                content.style.border = '1px solid black';
                content.style.padding = '10px';
                content.setAttribute('contenteditable', 'true');
            } else {
                editButton.innerHTML = 'Edit';
                content.setAttribute('contenteditable', 'false');
                content.style.border = 'none';
                content.style.padding = '0px';
                let editedPostData = JSON.parse(localStorage.getItem('postData'));
                const updateOne = editedPostData.find( x => x['id'] == id)
                updateOne['content'] = content.innerHTML;
                localStorage.setItem('postData', JSON.stringify(editedPostData));

            }
        }else{
            id = returnNumber(id);
            const postDataArray = JSON.parse(localStorage.getItem('postData'));
            let updatedPostData = [];
            for (let j = 0; j < postDataArray.length; j++) {
                if (postDataArray[j]['id'] != id) {
                    updatedPostData.push(postDataArray[j]);
                }
                else{
                    alert(postDataArray[j]['heading'] + " successfully deleted.");
                    localStorage.removeItem('comment_'+postDataArray[j]['id']);
                }
            }
            localStorage.setItem('postData', JSON.stringify(updatedPostData));
            location.reload();
        }
    }
}

customElements.define('my-posts', MyPosts);