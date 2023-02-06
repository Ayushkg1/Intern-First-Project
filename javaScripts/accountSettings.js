let url = "";
class UpdateDetails extends HTMLElement {
    constructor() {
        super();
        // console.log(this);
        this.checkCredentials();
        const user = this.getUser();
        // console.log(user);
        this.querySelector('#user__email').value = user['email'];
        this.querySelector('#user__name').value = user['name'];
        this.querySelector('#user__phone').value = user['phone'];
        this.querySelector('#user-image').setAttribute('src', user['img']);
        console.log(user['img']);
        this.querySelector('#update__form').addEventListener('submit', this.updateDetails);
        this.querySelector('#edit__button').onclick = this.updatePicture;
    }

    getUser() {
        return JSON.parse(localStorage.getItem('formData')).find(x => x['email'] == sessionStorage.getItem('email'));
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
        else {
            // postDisplayer();
        }
    }

    updateDetails(e) {
        e.preventDefault();
        const updatedEmail = this.querySelector('#user__email').value;
        const updatedName = this.querySelector('#user__name').value;
        const updatedPhone = this.querySelector('#user__phone').value;
        console.log(updatedEmail, updatedName, updatedPhone);
        const formData = JSON.parse(localStorage.getItem('formData'));
        let updatedFormData = [], indexOfOldData = -1;
        for (let i = 0; i < formData.length; i++) {
            if (formData[i]['email'] != sessionStorage.getItem('email')) {
                updatedFormData.push(formData[i]);
            }
            else {
                indexOfOldData = i;
            }
        }
        updatedFormData.push({ 
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone,
            pwd: formData[indexOfOldData]['pwd'],
            img: url=="" ? formData[indexOfOldData]['img'] : url
         });
        console.log(url);
        localStorage.setItem('formData', JSON.stringify(updatedFormData));
        console.log(updatedFormData);
        sessionStorage.clear();
        location.href = 'index.html';
    }

    updatePicture(e) {
        // console.log(e);
        document.querySelector('.picture-section').innerHTML += `<input type="file" id="file-img"></input>`;
        document.querySelector('#edit__button').style.display = 'none';
        const profileImage = document.getElementById('file-img');
        let imgViewer = document.querySelector('.my-profile-image');
        // imgViewer.setAttribute('src', image);
        profileImage.addEventListener('change', () => {
            const fr = new FileReader();
            fr.readAsDataURL(profileImage.files[0]);
            fr.addEventListener('load', () => {
                url = fr.result;
                imgViewer.setAttribute('src', url);
            });
        });

    }
}

customElements.define('update-details', UpdateDetails);