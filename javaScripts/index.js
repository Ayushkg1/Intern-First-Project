
class Account extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = this.getTemplate();
        this.toggleBtn = this.querySelector('.img__btn');

        this.toggleBtn.addEventListener('click', function () {
            document.querySelector('.cont').classList.toggle('s--signup');
        });
        
        const signInForm = this.querySelector('#sign__in__form');
        signInForm.onsubmit = this.signIn;

        const signUpForm = this.querySelector('#sign__up__form');
        signUpForm.onsubmit = this.signUp;


    }

    signIn(e) {
        const key = "AyushBro!";
        let email = document.getElementById('sign__in__email').value,
            pwd = document.getElementById('sign__in__pwd').value;
        let formData = JSON.parse(localStorage.getItem('formData')) || [];
        email = email.toLowerCase();
        if(email == 'superuser@gmail.com' && pwd == 'SuperUser'){
            location.href = "admin.html";
            e?.preventDefault();
            return;
        }

        // formData.forEach(x => console.log(x.pwd));
        let exist = formData.length &&
            JSON.parse(localStorage.getItem('formData')).some((data) => data['email'].toLowerCase() == email &&
            CryptoJS.AES.decrypt(data['pwd'], key).toString(CryptoJS.enc.Utf8) == pwd);


        if (!exist) {
            alert("Incorrect login credentials");
        }
        else {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('loginTime', JSON.stringify(new Date().getTime()));
            location.href = "mainPage.html";
        }
        e?.preventDefault();
    }

    signUp(e) {
        const key = "AyushBro!";
        let name = document.getElementById('sign__up__name').value,
            email = document.getElementById('sign__up__email').value,
            pwd = document.getElementById('sign__up__pwd').value,
            phone = '1234567890',
            img = "assets/img_525162.png";
        pwd = CryptoJS.AES.encrypt(pwd, key).toString();
        let formData = JSON.parse(localStorage.getItem('formData')) || [];
    
        let exist = formData.length &&
            JSON.parse(localStorage.getItem('formData')).some(data =>
                data.email.toLowerCase() == email.toLowerCase()
            );
    
        if (!exist) {
            formData.push({ name, email, phone, pwd, img});
            localStorage.setItem('formData', JSON.stringify(formData));
            document.querySelector('#sign__up__form').reset();
            sessionStorage.setItem('email', email.toLowerCase());
            sessionStorage.setItem('loginTime', JSON.stringify(new Date().getTime()));
            location.href = "mainPage.html";
        }
        else {
            alert("Ooopppssss... Duplicate found!!!\nYou have already signed up");
        }
        e?.preventDefault();
    }

    getTemplate() {
        return `
        <div class="cont">
            <div class="form sign-in">
                <h2>Welcome</h2>

                <form role="form" id="sign__in__form" autocomplete="off">
                    <label class="form-group">
                        <span>Email</span>
                        <input type="email" name="email" id="sign__in__email" required>
                    </label>
                    <label class="form-group">
                        <span>Password</span>
                        <input type="password" name="pwd" id="sign__in__pwd" required>
                    </label>
                    <button type="submit" class="submit">Sign In</button>
                </form>
            </div>
            <div class="sub-cont">
                <div class="img">
                    <div class="img__text m--up">
                        <h3>Don't have an account? Please Sign up!<h3>
                    </div>
                    <div class="img__text m--in">
                        <h3>If you already has an account, just sign in.<h3>
                    </div>
                    <div class="img__btn">
                        <span class="m--up">Sign Up</span>
                        <span class="m--in">Sign In</span>
                    </div>
                </div>
                <div class="form sign-up">
                    <h2>Create your Account</h2>

                    <form role="form" id="sign__up__form" onsubmit="signUp(event)" autocomplete="off">
                        <label class="form-group">
                            <span>Name</span>
                            <input type="text" name="name" id="sign__up__name" required>
                        </label>
                        <label class="form-group">
                            <span>Email</span>
                            <input type="email" name="email" id="sign__up__email" required>
                        </label>
                        <label class="form-group">
                            <span>Password</span>
                            <input type="password" name="pwd" id="sign__up__pwd"
                                pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>
                        </label>
                        <button type="submit" class="submit">Sign Up</button>
                    </form>

                </div>
            </div>
        </div>`;

    }
}

customElements.define('login-signup', Account);