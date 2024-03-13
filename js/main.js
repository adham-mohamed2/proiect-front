// start add background to header

let header = document.querySelector(".navbar-expand-lg");
let list_header = document.querySelector(".navbar-collapse");

    window.addEventListener("scroll" , ()=>{
        if(window.scrollY > 100){
            header.classList.add("active-background");
        }
        else{
            header.classList.remove("active-background");
            list_header.classList.remove("active-background");
        }
        
    })




// end add background to header4

//https://api.hadith.gading.dev/books/muslim?range=1-150



async function gethadis(){
    try{
        let contant_hadis = document.querySelector(".show-contant");
        let prev = document.querySelector(".prev");
        let next = document.querySelector(".next");
        let number_hadis = document.querySelector(".number-Ahdis");
        let hadisIndex = 0;
        const responce = await fetch("https://api.hadith.gading.dev/books/muslim?range=1-150");
        const data = await responce.json();
        let hadis = data.data.hadiths;
        console.log(hadis)
        change_hadis();
        next.addEventListener("click" , ()=>{
            hadisIndex == 149 ? hadisIndex = 0 : hadisIndex++;
            change_hadis();
        })
        prev.addEventListener("click" , ()=>{
            hadisIndex == 0 ? hadisIndex = 149 : hadisIndex--;
            change_hadis();
        })
        function change_hadis(){
            
            contant_hadis.innerHTML = hadis[hadisIndex].arab;
            number_hadis.innerHTML=`150 - ${hadisIndex + 1}`;
        }
    }catch (error) {
        console.error('Error fetching get_hadis:', error);
        return null;
    }

}
gethadis();

// ************************************************************************ get quran api


async function get_quran(){
    try{
        let contant_surah = document.querySelector(".contant-surah");
        const response = await fetch( "http://api.alquran.cloud/v1/meta");
        const data = await response.json();
        let surah = data.data.surahs.references;
        surah.map((item)=>{
            contant_surah.innerHTML +=`
            <div class="card-item mb-2 d-flex align-items-center justify-content-center">
                <span class="d-block name-surah">${item.name}</span>
                <span class="d-block">${item.englishName}</span>
            </div>
        `
        })
        
        let surahlist = document.querySelectorAll(".card-item");
        let ayat_container  = document.querySelector(".ayat-container");
        let surah_popup = document.querySelector(".surah-popup");
        let close_popup = document.querySelector(".close-popup");

        surahlist.forEach((title , index)=>{
            title.addEventListener("click" , ()=>{
                fetch(`http://api.alquran.cloud/v1/surah/${index + 1}`)
                .then(response=>{
                    return response.json();
                })
                .then(data=>{
                    let ayah = data.data.ayahs;
                    ayat_container.innerHTML = "";
                    ayah.map(text=>{
                        surah_popup.classList.add("active");
                        surah_popup.classList.remove("remove");
                        ayat_container.innerHTML +=`
                            <p> ${text.number} - ${text.text}</p>
                        `
                    })
                })
            })
            close_popup.addEventListener("click", ()=>{
                surah_popup.classList.remove("active");
                surah_popup.classList.add("remove");
            })
        })
    }catch (error) {
        console.error('Error fetching get_quran:', error);
        return null;
    }
    
}

get_quran();

// *********************************************************************** get time of azan

async function preytime(){
    try{
        let time_container = document.querySelector(".time-container");
        const response = await fetch("http://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt Arab Emirates&method=8");
        const data = await response.json();
        let times = data.data.timings;

        for(let time in times){
        time_container.innerHTML +=`
            
            <div class="card d-flex align-items-center justify-content-center position-relative">
                <p class="animation-time"></p>
                <span class="time-card position-absolute ">${times[time]}</span>
                <span class="nam-time d-block">${time}</span>
            </div>
        `
        }
    }catch (error) {
        console.error('Error fetching time_azan:', error);
        return null;
    }
}

preytime()


// ******************************************************* start choose register
async function recitar(){
    try{
        let choose_registar = document.querySelector(".choose-registar");
        const response = await fetch("https://mp3quran.net/api/v3/reciters?language=ar");
        const data = await response.json();
        chosee_kara = data.reciters;
        choose_registar.innerHTML = `<option>اختر قارئ</option>`;
        chosee_kara.map((name)=>{
            choose_registar.innerHTML +=`
            <option value="${name.id}">${name.name}</option>
            `
        })

        choose_registar.addEventListener("change" ,  e => getrewaya(e.target.value))
    }catch (error) {
        console.error('Error fetching recitar:', error);
        return null;
    }

}
recitar();

// ****************************************************** start choose rewaya

async function getrewaya(id){
    try{
        let choose_rewaya = document.querySelector(".choose-rewaya");
        const response = await fetch(`https://www.mp3quran.net/api/v3/reciters?language=ar&reciter=${id}`);
        const data = await response.json();
        let chooserewaya = data.reciters[0].moshaf;
        choose_rewaya.innerHTML = `<option>اختر رواية</option>`;
        chooserewaya.map((rewaya)=>{
            choose_rewaya.innerHTML +=`
            <option data-servar="${rewaya.server}" data-surahlist="${rewaya.surah_list}" value="${rewaya.id}">${rewaya.name}</option>
            `
        })
        
        choose_rewaya.addEventListener("change" , e=>{
            const selectedmoshaf = choose_rewaya.options[choose_rewaya.selectedIndex];
            const surahservar = selectedmoshaf.dataset.servar;
            const surahlist = selectedmoshaf.dataset.surahlist;
            getsurah(surahlist , surahservar)
        })
    }catch (error) {
        console.error('Error fetching getrewaya:', error);
        return null;
    }
    
}
getrewaya();

// ******************************************************* start choose surah

async function getsurah(surah , server){
    try{
        let choose_surah = document.querySelector(".choose_surah");
        const response = await fetch("https://mp3quran.net/api/v3/suwar");
        const data = await response.json();

        let Allsurah = data.suwar;
        let surah_list = surah.split(',');
        
        choose_surah.innerHTML = `<option>اختر سوره</option>`;

        surah_list.map((surahitem) =>{
            let padsurah = surahitem.padStart(3,"0"); 
            Allsurah.map((allitem)=>{
                if(allitem.id == surahitem){
                    choose_surah.innerHTML += `
                        <option value="${server}${padsurah}.mp3">${allitem.name}</option>
                    `
                }
            })
        })

        choose_surah.addEventListener("change" , e=>{
            const selectedmoshaf = choose_surah.options[choose_surah.selectedIndex];
            playaudio(selectedmoshaf.value);
        })
    }catch (error) {
        console.error('Error fetching getsurah:', error);
        return null;
    }
}

function playaudio(surahMp3){
    const audioplay = document.querySelector("#audioplayer");
    audioplay.src=surahMp3;
    audioplay.play();
    
}

// ************************************************************************************** start islam live chanal

function playLive(chanal){
    if(Hls.isSupported()){
        let video = document.querySelector("#video");
        var hls = new Hls();
        hls.loadSource(`${chanal}`);
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED,function(){
            video.play();
        })
    }
}

//**********************************************  tafser  */

async function tafser(){
    try{
        let choose_tafsir = document.querySelector(".choose-tafsir"); 
        const response = await fetch("https://www.mp3quran.net/api/v3/tafsir?tafsir=1&language=ar");
        const data = await response.json();
        let tafsir = data.tafasir.soar;
        choose_tafsir.innerHTML = "<option>اختر سوره</option>";
        tafsir.map((tafsir)=>{
            choose_tafsir.innerHTML += `
            <option data-servar="${tafsir.sura_id}"  value="${tafsir.url}">${tafsir.name}</option>
            `
        })

        choose_tafsir.addEventListener("change" , e=>{
            const selectedmoshaf = choose_tafsir.options[choose_tafsir.selectedIndex];
            const surahservar = selectedmoshaf.value;
            playaudio_tafsir(surahservar);
        })
    }catch (error) {
        console.error('Error fetching tafser:', error);
        return null;
    }
}

function playaudio_tafsir(tafsir){
    let audioplay_tafsir = document.querySelector("#audio-tafsir");
    audioplay_tafsir.src = tafsir;
    audioplay_tafsir.play();
}
tafser();



// ************************************************* Azkar 

async function azckar_Almasaa() {
    try {
        
        let contant_azcar = document.querySelector(".contant_azcar");
        let index_Azcar = 1;
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json'); // Path to your JSON file
        const data = await response.json();

        
        let azckar = data['أذكار المساء'];

        let next_azcar_two = document.querySelector(".next-azckar");
        let prev_azcar_two = document.querySelector(".prev-azckar");

            next_azcar_two.addEventListener("click" , ()=>{
                if(index_Azcar == 20){
                    index_Azcar = 1
                }
                else{
                    index_Azcar++;
                }
                hello();
            })
            prev_azcar_two.addEventListener("click" , ()=>{
                if(index_Azcar == 1){
                    index_Azcar = 20
                }
                else{
                    index_Azcar--;
                }
                hello();
            })
            function hello(){
                contant_azcar.innerHTML = `
                
                <p>${azckar[index_Azcar].content}</P>
                `
            }

            hello();

    } catch (error) {
        console.error('Error fetching Azkar:', error);
        return null;
    }
}


async function azckar_Alsapah() {
    try {
        
        let contant_azcar = document.querySelector(".contant_azcar");
        let index_Azcar = 1;
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json'); // Path to your JSON file
        const data = await response.json();
        
        
            let azckar = data['أذكار الصباح'];

            let next_azcar_one = document.querySelector(".next-azckar");
            let prev_azcar_one = document.querySelector(".prev-azckar");

            next_azcar_one.addEventListener("click" , ()=>{
                if(index_Azcar == 20){
                    index_Azcar = 1
                }
                else{
                    index_Azcar++;
                }
                azcar();
            })

            prev_azcar_one.addEventListener("click" , ()=>{
                if(index_Azcar == 1){
                    index_Azcar = 20
                }
                else{
                    index_Azcar--;
                }
                azcar();
            })

            function azcar(){
                contant_azcar.innerHTML = `
                    <p>${azckar[index_Azcar].content}</P>
                `
            }

            azcar();
            

    } catch (error) {
        console.error('Error fetching Azkar:', error);
        return null;
    }
}
azckar_Alsapah();



async function fetch_Adaya() {
    try {
        let contant_azcar = document.querySelector(".contant_azcar");
        let index_Azcar = 0;
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json'); // Path to your JSON file
        const data = await response.json();
        

            let next = document.querySelector(".next-azckar");
            let prev = document.querySelector(".prev-azckar");
            let azckar = data['أدعية قرآنية'];

            next.addEventListener("click" , ()=>{
                index_Azcar == 25 ? index_Azcar = 0 : index_Azcar++;
                Adaya();
            })

            prev.addEventListener("click" , ()=>{
                index_Azcar == 0 ? index_Azcar = 25 : index_Azcar--;
                Adaya();
            })

            function Adaya(){
                console.log(index_Azcar)
                contant_azcar.innerHTML = `
                <p>${azckar[index_Azcar].content}</P>
                `
            }
        

            Adaya();

    } catch (error) {
        console.error('Error fetching Azkar:', error);
        return null;
    }
}



async function fetch_taspeh() {
    try {
        let contant_azcar = document.querySelector(".contant_azcar");
        let index_Azcar = 0;
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json'); // Path to your JSON file
        const data = await response.json();
        

            let next = document.querySelector(".next-azckar");
            let prev = document.querySelector(".prev-azckar");
            let azckar = data['تسابيح'];

            next.addEventListener("click" , ()=>{
                index_Azcar == 16 ? index_Azcar = 0 : index_Azcar++;
                taspeh();
            })

            prev.addEventListener("click" , ()=>{
                index_Azcar == 0 ? index_Azcar = 16 : index_Azcar--;
                taspeh();
            })

            function taspeh(){
                console.log(index_Azcar)
                contant_azcar.innerHTML = `
                <p>${azckar[index_Azcar].content}</P>
                `
            }
        

        taspeh();

    } catch (error) {
        console.error('Error fetching Azkar:', error);
        return null;
    }
}


// **************************************************** transation between leacure


function left(){
    var left = document.querySelector(".contant-leacure")
    left.scrollBy(660, 0);
}
function right(){
    var right = document.querySelector(".contant-leacure")
    right.scrollBy(-660, 0);
}


// ********************************************************* show leacure

let cart_leacure = document.querySelectorAll(".cart-leacure");


cart_leacure.forEach((item)=>{
    item.addEventListener("click" , e=>{
        const surahservar = item.dataset.servar;
        getsrc_leacure(surahservar)
    });
})

function getsrc_leacure(src){
    let frame_leacure = document.querySelector(".fram-leacure");
    frame_leacure.src=src;
}

// *****************************************************************
