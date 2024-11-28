import Dialog from "../management/components/helpers/Dialog.js";
$(document).ready(function () {
    let i;
    let o;
    let s = 0;
    let r = null;
    const n = 2 * 60 * 60 * 1e3;
    $(document).ready(function () {
        $("#infoBtn").click(function () {
            let e = `
<p>Welcome to the Weather Forecast page. This tool provides a 5-day weather forecast to help you plan and prepare for upcoming weather conditions. Follow these instructions to use the tool effectively:</p>

<ol>
  <li><strong>View the 5-Day Forecast:</strong><br> The forecast displays weather information for the next five days. Each day includes detailed data on the following parameters:
    <ul>
      <li><strong>Temperature:</strong> The expected high and low temperatures for each day.</li>
      <li><strong>Humidity:</strong> The forecasted humidity levels, indicating the amount of moisture in the air.</li>
      <li><strong>Precipitation:</strong> The amount of expected precipitation, including rain, snow, or other forms of moisture.</li>
      <li><strong>Rainfall Probability:</strong> The likelihood of rainfall, expressed as a percentage probability.</li>
    </ul>
  </li>

  <li><strong>Understand Weather Parameters:</strong><br> Each weather parameter provides insights into the expected conditions:
    <ul>
      <li><strong>Temperature:</strong> Helps you prepare for hot or cold weather.</li>
      <li><strong>Humidity:</strong> Useful for understanding comfort levels and potential impacts on health.</li>
      <li><strong>Precipitation:</strong> Indicates potential for rain or snow, helping you plan outdoor activities.</li>
      <li><strong>Rainfall Probability:</strong> Allows you to gauge the chance of rain and plan accordingly.</li>
    </ul>
  </li>
</ol>

<p>This tool provides comprehensive weather forecasting to help you make informed decisions based on expected weather conditions.</p>

  `;
            Dialog.showInfoModal(e);
        });
    });
    async function c() {
        const e = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${o}?apikey=${i}&details=true&metric=true`;
        try {
            const a = await $.getJSON(e);
            await $.ajax({
                url: "api/weatherforecasts",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    weather_data: a,
                    timestamp: new Date().getTime(),
                }),
            });
            r = a;
            s = new Date().getTime();
            l(a);
        } catch (t) {
            console.error("Error fetching or saving forecast data:", t);
        }
    }
    function D(e) {
        const t = new Date();
        const a = t.getHours();
        const i = 6;
        const o = 18;
        let s;
        function r() {
            if (a >= i && a < o) {
                return 'url("../img/weather/day.webp")';
            } else {
                return 'url("../img/weather/night.webp")';
            }
        }
        const n = e ? e.toLowerCase() : "";
        switch (true) {
            case n.includes("sunny"):
                s = 'url("../img/weather/day.webp")';
                break;
            case n.includes("cloudy"):
                s = 'url("../img/weather/cloudy.webp")';
                break;
            case n.includes("rain") ||
                n.includes("drizzle") ||
                n.includes("shower"):
                s = 'url("../img/weather/rain.webp")';
                break;
            case n.includes("storm") || n.includes("thunderstorm"):
                s = 'url("../img/weather/storm.webp")';
                break;
            default:
                s = r();
        }
        $(".bg").css({
            "background-image": s,
            "background-size": "cover",
            "background-position": "center",
        });
    }
    function l(e) {
        const t = new Date();
        const f = t.getHours();
        const a = e.DailyForecasts[0];
        const i = new Date(a.Date);
        const o = `https://developer.accuweather.com/sites/default/files/${(
            "0" + a.Day.Icon
        ).slice(-2)}-s.png`;
        const s = `https://developer.accuweather.com/sites/default/files/${(
            "0" + a.Night.Icon
        ).slice(-2)}-s.png`;
        const r = a.Day.IconPhrase;
        const n = a.Night.IconPhrase;
        const c = a.Temperature.Maximum.Value;
        const l = a.Temperature.Minimum.Value;
        const d = a.Day.RelativeHumidity.Maximum || 0;
        const h = a.Night.RelativeHumidity.Maximum || 0;
        const p = a.Day.PrecipitationIntensity || "None";
        const u = a.Night.PrecipitationIntensity || "None";
        const m = a.Day.PrecipitationProbability || 0;
        const g = a.Night.PrecipitationProbability || 0;
        const w = 6;
        const b = 18;
        let y;
        if (f >= w && f < b) {
            y = r;
            $("#today").html(`
  <h4>${r}</h4>
  <img src="${o}" alt="${r}" class="weather-icon">
  <p>Temperature: ${c}°C</p>
  <p>Humidity: ${d}%</p>
  <p>Precipitation: ${p}</p>
  <p>Rainfall Probability: ${m}%</p>
`);
        } else {
            y = n;
            $("#today").html(`
  <h4>${n}</h4>
  <img src="${s}" alt="${n}" class="weather-icon">
  <p>Temperature: ${l}°C</p>
  <p>Humidity: ${h}%</p>
  <p>Precipitation: ${u}</p>
  <p>Rainfall Probability: ${g}%</p>
`);
        }
        D(y);
        const v = e.DailyForecasts.slice(1);
        const P = $("#forecast");
        P.empty();
        v.forEach((e) => {
            const t = new Date(e.Date);
            const a = t.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
            });
            const i = t.toLocaleDateString("en-US", { weekday: "long" });
            const o = e.Temperature.Maximum.Value;
            const s = e.Temperature.Minimum.Value;
            const r = e.Day.RelativeHumidity.Maximum || 0;
            const n = e.Night.RelativeHumidity.Maximum || 0;
            const c = e.Day.PrecipitationIntensity || "None";
            const l = e.Night.PrecipitationIntensity || "None";
            const d = e.Day.IconPhrase;
            const h = e.Night.IconPhrase;
            const p = `https://developer.accuweather.com/sites/default/files/${(
                "0" + e.Day.Icon
            ).slice(-2)}-s.png`;
            const u = `https://developer.accuweather.com/sites/default/files/${(
                "0" + e.Night.Icon
            ).slice(-2)}-s.png`;
            const m = e.Day.PrecipitationProbability || 0;
            const g = e.Night.PrecipitationProbability || 0;
            let y;
            if (f >= w && f < b) {
                y = $(`
    <div class="col-md-3 mb-4 forecast-card">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${a} (${i})</h5>
          <h6 class="card-subtitle mb-2 text-white">Day</h6>
          <img src="${p}" alt="${d}" class="weather-icon">
          <p class="card-text">Temperature: ${o}°C</p>
          <p class="card-text">Humidity: ${r}%</p>
          <p class="card-text">Precipitation: ${c}</p>
          <p class="card-text">Rainfall Probability: ${m}%</p>
        </div>
      </div>
    </div>
  `);
            } else {
                y = $(`
    <div class="col-md-3 mb-4 forecast-card">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${a} (${i})</h5>
          <h6 class="card-subtitle mb-2 text-white">Night</h6>
          <img src="${u}" alt="${h}" class="weather-icon">
          <p class="card-text">Temperature: ${s}°C</p>
          <p class="card-text">Humidity: ${n}%</p>
          <p class="card-text">Precipitation: ${l} </p>
          <p class="card-text">Rainfall Probability: ${g}%</p>
        </div>
      </div>
    </div>
  `);
            }
            P.append(y);
        });
    }
    async function e() {
        const e = new Date().getTime();
        try {
            const a = await $.getJSON("api/weatherforecasts");
            const i = a.timestamp;
            const o = a.weather_data;
            if (i && e - i < n) {
                l(o);
            } else {
                await c();
            }
        } catch (t) {
            console.error("Error fetching cached data from the server:", t);
            await c();
        }
    }
    async function t() {
        try {
            const t = await fetch("/api/weather-keys");
            if (!t.ok) {
                throw new Error(`HTTP error! status: ${t.status}`);
            }
            const a = await t.json();
            i = a.weather_api_key;
            o = a.weather_location_key;
        } catch (e) {
            console.error("Error fetching weather keys:", e);
        }
    }
    $(document).ready(async function () {
        await t();
        if (i && o) {
            await e();
        } else {
            console.error("Weather API Key or Location Key is missing.");
        }
    });
});
