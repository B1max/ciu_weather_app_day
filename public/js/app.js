// const fetch = require('node-fetch');
let lista_tiempos =[];

class tiempo {
    // static hoy;
    static estado ;
    static icono_estado;
    static temp ;
    static temp_min ;
    static temp_max ;
    static humidity ;
    static pressure ;
    static wind_speed ;
    static sunrise ;
    static sunset ;
    static dt;
}

function fecha(){
    let date = new Date();
    let fechaResultado = "";
    const strs_Dias = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const strs_Meses = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    fechaResultado += strs_Dias[date.getDay()-1] + ", ";
    fechaResultado += date.getDate() + " ";
    fechaResultado += strs_Meses[date.getMonth()] + " ";
    fechaResultado += date.getFullYear()+"\n";
    fechaResultado += formatoHorario(date);
    return fechaResultado;
}

async function resApi () { 
    await fetch("http://api.openweathermap.org/data/2.5/forecast?q=villa tesei,ar&cnt=4&appid=6ca77046e221612d6bc9fe0049aea0d3&units=metric")
    .then(res => {
        let resultado = res.json();
        return resultado;
    })
    .then(async (datas) => {
        console.log("dias traidos "+datas.list.length);
        
        for(let i = 0; i<datas.list.length;i++){
            let miTiempo = new tiempo();
            let data = datas.list[i];
            let estado = data.weather[0].main;
            let icono_estado = "url(http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png)"
            let temp = data.main.temp;
            let temp_min = data.main.temp_min;
            let temp_max = data.main.temp_max;
            let humidity = data.main.humidity ;
            let pressure = data.main.pressure ;
            let wind_speed = String(data.wind.speed ) + " km/h";
            let sunrise = new Date(datas.city.sunrise *1000);
            let sunset = new Date(datas.city.sunset * 1000);
            let day_time = new Date(data.dt * 1000);
            miTiempo.estado = estado;
            miTiempo.icono_estado = icono_estado;
            miTiempo.temp = temp;
            miTiempo.temp_min = temp_min;
            miTiempo.temp_max = temp_max;
            miTiempo.humidity = humidity + "%";
            miTiempo.pressure = pressure + "mBar";
            miTiempo.wind_speed = wind_speed;
            miTiempo.sunrise = formatoHorario(sunrise);
            miTiempo.sunset = formatoHorario(sunset);
            miTiempo.dt = String(day_time.getHours()) + "h " + String(day_time.getMinutes()) + "m";
            lista_tiempos.push(miTiempo);
        }
    })
    .catch(error=>{
        if(error!=null){
            console.log("ocurrio un error - > "+ error);
        }
    })
}


function formatoHorario(hora){
    let resultado = "";
    let _hora = hora.getHours();
    let _minuto = hora.getMinutes();
    resultado = (_hora > 12 ? _hora-12 : _hora)+":" ;
    resultado += _minuto < 10 ? "0" + _minuto: _minuto;
    resultado += _hora > 12 ? "PM" : "AM";
    return resultado;
}



function mostrar(tmp){
    console.log(
        "Estado actual : " +tmp.estado+
        "\nIcono estado : "+ tmp.icono_estado +
        "\nTemp : " + tmp.temp +
        "\nTemp min : " + tmp.temp_min +
        "\nTemp max : " + tmp.temp_max +
        "\nHumedad : " + tmp.humidity +
        "\nPresion : " + tmp.pressure +
        "\nVelocidad del viento : " + tmp.wind_speed+
        "\nAmanecer  " + tmp.sunrise +
        "\nPuesta del sol " + tmp.sunset +
        "\nDay time  " + tmp.dt
        );
}


async function teeest (){
    await resApi();
    for(let i = 0; i<lista_tiempos.length;i++){
        console.log("<----------------------dia n° "+i);
        mostrar(lista_tiempos[i]);
    }
}
teeest();
window.addEventListener('load', async function(){
    await resApi();
    await cargar_datos();
})

function cargar_datos(){
//falta cargar la ciudad y la fecha actual
    //dia
    document.getElementById("date").textContent = fecha();
    //icono estado
    document.getElementById("icono_estado").style.backgroundImage = lista_tiempos[0].icono_estado;
    //texto estado
    document.getElementById("estado").textContent = lista_tiempos[0].estado
    //temperatura
    document.getElementById("temperature").textContent = String(Math.round(lista_tiempos[0].temp));
    //temp max
    document.getElementById("main_temp_max").textContent = String(Math.round(lista_tiempos[0].temp_max)) + "°C";
    //temp min
    document.getElementById("main_temp_min").textContent = String(Math.round(lista_tiempos[0].temp_min)) + "°C";
    //humidity
    document.getElementById("humidity_data").textContent = lista_tiempos[0].humidity;
    //pressure
    document.getElementById("pressure_data").textContent = lista_tiempos[0].pressure;

}
/*
{
    "cod": "200",
    "message": 0,
    "cnt": 4,
    "list": [
        {
            "dt": 1595602800,
            "main": {
                "temp": 7.67,
                "feels_like": 2.58,
                "temp_min": 7.67,
                "temp_max": 8.73,
                "pressure": 1016,
                "sea_level": 1017,
                "grnd_level": 1015,
                "humidity": 75,
                "temp_kf": -1.06
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "clouds": {
                "all": 92
            },
            "wind": {
                "speed": 5.26,
                "deg": 265
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "d"
            },
            "dt_txt": "2020-07-24 15:00:00"
        },
        {
            "dt": 1595613600,
            "main": {
                "temp": 9.28,
                "feels_like": 3.87,
                "temp_min": 9.28,
                "temp_max": 10.01,
                "pressure": 1016,
                "sea_level": 1016,
                "grnd_level": 1014,
                "humidity": 60,
                "temp_kf": -0.73
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04d"
                }
            ],
            "clouds": {
                "all": 88
            },
            "wind": {
                "speed": 5.32,
                "deg": 271
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "d"
            },
            "dt_txt": "2020-07-24 18:00:00"
        },
        {
            "dt": 1595624400,
            "main": {
                "temp": 9.53,
                "feels_like": 4.44,
                "temp_min": 9.53,
                "temp_max": 9.73,
                "pressure": 1016,
                "sea_level": 1016,
                "grnd_level": 1014,
                "humidity": 52,
                "temp_kf": -0.2
            },
            "weather": [
                {
                    "id": 801,
                    "main": "Clouds",
                    "description": "few clouds",
                    "icon": "02d"
                }
            ],
            "clouds": {
                "all": 23
            },
            "wind": {
                "speed": 4.47,
                "deg": 273
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "d"
            },
            "dt_txt": "2020-07-24 21:00:00"
        },
        {
            "dt": 1595635200,
            "main": {
                "temp": 8.84,
                "feels_like": 4.79,
                "temp_min": 8.84,
                "temp_max": 8.86,
                "pressure": 1018,
                "sea_level": 1018,
                "grnd_level": 1016,
                "humidity": 52,
                "temp_kf": -0.02
            },
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01n"
                }
            ],
            "clouds": {
                "all": 10
            },
            "wind": {
                "speed": 2.85,
                "deg": 302
            },
            "visibility": 10000,
            "pop": 0,
            "sys": {
                "pod": "n"
            },
            "dt_txt": "2020-07-25 00:00:00"
        }
    ],
    "city": {
        "id": 3433522,
        "name": "Hurlingham",
        "coord": {
            "lat": -34.5883,
            "lon": -58.6391
        },
        "country": "AR",
        "population": 1000,
        "timezone": -10800,
        "sunrise": 1595588027,
        "sunset": 1595624882
    }
}
*/