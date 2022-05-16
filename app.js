let employeeList = [];
const container = document.querySelector('.container');
const search = document.getElementById('search');
//get data from server
const fetchEmployee = fetch('https://randomuser.me/api/?results=12')
.then((response) => {
    return response.json();
})
.then((data) => {
    generateEmployeeHtml(data.results);
});

//Print DIV element for each Employee
function generateEmployeeHtml(arr){
    let htmlForContainer = '';
    arr.forEach( a => {
        const picture = a.picture.large;
        const name = `${a.name.first} ${a.name.last}`;
        const username = a.login.username;
        const email = a.email;
        const city = a.location.city
        const phone = a.phone;
        const adress = `${a.location.street.name} ${a.location.street.number}, ${a.location.state} ${a.location.postcode}`;
        employeeList.push({picture, name, username, email, city, phone, adress});
        htmlForContainer += `<div class="employee">
            <img src='${picture}' alt='Picture of ${name}'>
            <div>
                <p>${name}</p>
                <span>${email}</span>
                <span>${city}</span>
            </div>
        </div>`;
    });
    container.innerHTML = htmlForContainer;
}

container.addEventListener('click', (e) => {
    const employee = document.querySelectorAll('.employee');
    employee.forEach( (em, i) => {
        if(em.contains(e.target)){
            generateLightBox(i, employee.length-1);
        }
    });
});

//eventlistener for input(search) field
search.addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    const employee = document.querySelectorAll('.employee');
    if(text === ''){
        employee.forEach( em => {
            em.style.display = 'grid';
        });
    } else {
        for(let i=0; i<employee.length; i++){
            if(employeeList[i].name.toLowerCase().includes(text) || employeeList[i].username.toLowerCase().includes(text)){
                employee[i].style.display = 'grid'; 
            }else{
                employee[i].style.display = 'none'; 
            }
        }

    }
});

//generate lightbox for each div-employee
function generateLightBox(i, lengthEmployee){
    const div = document.createElement('div');
    div.className = 'lightbox';
    //create html code for lightBox
    let htmlForLightBox = `
        <div class='lightbox-inside'>
            <img src='${employeeList[i].picture}' alt='${employeeList[i].name} profile picture'>
            <div>
                <img src='svg/x-mark.svg' alt='x-mark' class="xMark">
                <img src='svg/next.svg' alt='next' class="nextArrow">
                <img src='svg/back.svg' alt='back' class="backArrow">
                <p><strong>${employeeList[i].name}</strong></p>
                <p>${employeeList[i].username}</p>
                <p>${employeeList[i].email}</p>
                <p>${employeeList[i].city}</p>
                <hr>
                <p>${employeeList[i].phone}</p>
                <p>${employeeList[i].adress}</p>
            </div>
        </div>
    `;
    document.body.appendChild(div);
    const lightbox = document.querySelector('.lightbox');
    //append html code in lightbox div
    lightbox.innerHTML = htmlForLightBox;
    
    //remove eventlistener and remove lightbox container
    function clear(){
        document.removeEventListener('keyup', eventListener, false);
        lightbox.remove();
    }

    //show previous or next lightbox
    function changeLightBox(e, arr, typeCheck){
        console.log(e.target);
        let check;
        typeCheck === 'className' ? check = e.target.className : check = e.key;

        if(check === arr[0] || e.target.className === 'lightbox'){
           clear();
        } 
        if(check === arr[1] && lengthEmployee>i){
            clear();
            generateLightBox(i+1, lengthEmployee);
        } else if(check === arr[2] && i>0){
            clear();
            generateLightBox(i-1, lengthEmployee);
        }
    }

    //event listener function which pass arguments on changelightbox function
    function eventListener(){
        //keys and classes for eventlistener
        const clickClass = ['xMark','nextArrow','backArrow'];
        const checkKeys = ['Escape', 'ArrowRight', 'ArrowLeft'];

        //if click or keyup event
        if(event.type === 'click'){
        changeLightBox(event, clickClass, 'className');
        } else if(event.type === 'keyup'){
        changeLightBox(event, checkKeys, 'key');   
        }
    }



    //event listener for click event
    lightbox.addEventListener('click', eventListener);

    //event listener for keypup event
    document.addEventListener('keyup', eventListener);
}


