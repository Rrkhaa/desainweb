const apiKey = '1bbf392f3d574a7498f23111241510';  // API key yang Anda dapatkan
const city = 'Jakarta';

// URL untuk API WeatherAPI
const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

// Fungsi untuk menampilkan pesan error
function tampilkanError(pesan) {
    document.getElementById('current-weather').innerHTML = `<p>${pesan}</p>`;
    document.getElementById('weather-forecast').innerHTML = '<p>Ramalan cuaca tidak dapat ditampilkan.</p>';
}

// Fetch data dari WeatherAPI
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data || !data.current || !data.forecast) {
            throw new Error('Data cuaca tidak lengkap atau tidak valid');
        }

        console.log(data);

        // Menampilkan cuaca hari ini
        const currentWeatherDiv = document.getElementById('current-weather');
        const currentWeather = data.current;
        currentWeatherDiv.innerHTML = `
            <h2>Cuaca Hari Ini</h2>
            <p>Suhu: ${currentWeather.temp_c}°C</p>
            <p>Deskripsi: ${currentWeather.condition.text}</p>
            <p>Kecepatan Angin: ${currentWeather.wind_kph} km/h</p>
            <p>Kelembapan: ${currentWeather.humidity}%</p>
        `;

        // Menampilkan ramalan cuaca 7 hari ke depan
        const forecastDiv = document.getElementById('weather-forecast');
        let forecastHTML = '';
        if (Array.isArray(data.forecast.forecastday) && data.forecast.forecastday.length > 0) {
            data.forecast.forecastday.forEach((day) => {
                if (day && day.date && day.day) {
                    const date = new Date(day.date);
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('id-ID', options);

                    forecastHTML += `
                        <div class="day">
                            <h4>${formattedDate}</h4>
                            <p>Suhu Siang: ${day.day.maxtemp_c}°C</p>
                            <p>Suhu Malam: ${day.day.mintemp_c}°C</p>
                            <p>Cuaca: ${day.day.condition.text}</p>
                            <button onclick="tampilkanDetail('${day.date}')">Lihat Detail</button>
                        </div>
                    `;
                }
            });
            forecastDiv.innerHTML = forecastHTML;
        } else {
            throw new Error('Data ramalan cuaca tidak tersedia');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        tampilkanError('Terjadi kesalahan saat mengambil data cuaca: ' + error.message);
    });
function tampilkanDetail(tanggal) {
    // Mengambil data cuaca untuk tanggal tertentu
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.forecast || !data.forecast.forecastday || data.forecast.forecastday.length === 0) {
                throw new Error('Data cuaca tidak tersedia untuk tanggal ini');
            }

            const detailCuaca = data.forecast.forecastday[0].day;
            const detailHTML = `
                <h3>Detail Cuaca untuk ${tanggal}</h3>
                <p>Suhu Maksimum: ${detailCuaca.maxtemp_c}°C</p>
                <p>Suhu Minimum: ${detailCuaca.mintemp_c}°C</p>
                <p>Cuaca: ${detailCuaca.condition.text}</p>
                <p>Kemungkinan Hujan: ${detailCuaca.daily_chance_of_rain}%</p>
                <p>Kecepatan Angin Maksimum: ${detailCuaca.maxwind_kph} km/h</p>
                <p>Kelembapan Rata-rata: ${detailCuaca.avghumidity}%</p>
            `;
            const detailContainer = document.createElement('div');
            detailContainer.innerHTML = detailHTML;
            detailContainer.style.backgroundColor = 'rgba(27, 27, 73, 0.9)';
            detailContainer.style.padding = '20px';
            detailContainer.style.borderRadius = '10px';
            detailContainer.style.marginTop = '20px';
            detailContainer.style.color = '#fafafadc';

            const weatherForecast = document.getElementById('weather-forecast');
            weatherForecast.appendChild(detailContainer);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengambil detail cuaca: ' + error.message);
        });
}
