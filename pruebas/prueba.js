const fetch = require('node-fetch');
let lista_tiempos =[];
let hoy = new Date().getDate();

class tiempo {
    static hoy;
    static estado ;
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


async function resApi () { 
    await fetch("http://api.openweathermap.org/data/2.5/forecast?q=hurlingham,ar&cnt=4&appid=6ca77046e221612d6bc9fe0049aea0d3&units=metric")
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

/*
{
    "coord":{"lon":-58.64,"lat":-34.59},
    "weather":[{
        "id":300,
        "main":"Drizzle",
        "description":"light intensity drizzle",
        "icon":"09d"
    }],
    "base":"stations",
    "main":{
        "temp":284.72,
        "feels_like":281.68,
        "temp_min":284.26,
        "temp_max":285.37,
        "pressure":1011,
        "humidity":93
    },
    "visibility":9000,
    "wind":{
        "speed":4.6,
        "deg":270
    },
    "clouds":{
        "all":90
    },
    "dt":1595533186,
    "sys":{
        "type":1,
        "id":8232,
        "country":"AR",
        "sunrise":1595501666,
        "sunset":1595538441
    },
    "timezone":-10800,
    "id":3433522,
    "name":"Hurlingham",
    "cod":200
}
*/