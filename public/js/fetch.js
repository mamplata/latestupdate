async function getDataEntriesCount() {
    try {
        const r = await $.ajax({
            url: "api/data-entries/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error(
            "An error occurred while fetching data entries count:",
            e
        );
        throw e;
    }
}

async function getFarmerCount() {
    try {
        const r = await $.ajax({
            url: "api/farmer/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching farmer count:", e);
        throw e;
    }
}

async function getRecordCount() {
    try {
        const r = await $.ajax({
            url: "api/record/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching record count:", e);
        throw e;
    }
}

async function getBarangayCount() {
    try {
        const r = await $.ajax({
            url: "api/barangay/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching barangay count:", e);
        throw e;
    }
}

async function getUserCount() {
    try {
        const r = await $.ajax({
            url: "api/user/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching user count:", e);
        throw e;
    }
}

async function getDownloadCount() {
    try {
        const r = await $.ajax({
            url: "api/download/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching download count:", e);
        throw e;
    }
}

async function getConcernCount() {
    try {
        const r = await $.ajax({
            url: "api/concern/count",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching concern count:", e);
        throw e;
    }
}

async function getCrop(r = "") {
    try {
        const t = await $.ajax({
            url: "api/crops",
            type: "GET",
            dataType: "json",
        });
        return t.filter(
            (e) => !r || e.croptype.toLowerCase() === r.toLowerCase()
        );
    } catch (e) {
        console.error("An error occurred while fetching the crop data:", e);
        throw e;
    }
}
async function getCropName(e) {
    try {
        const t = await $.ajax({
            url: `api/crops/${e}`,
            type: "GET",
            dataType: "json",
        });
        return t.cropName;
    } catch (r) {
        console.error("An error occurred while fetching the crop data:", r);
        throw r;
    }
}
async function getCropVarieties(e = "") {
    try {
        const t = await $.ajax({
            url: "api/crop-varieties",
            type: "GET",
            dataType: "json",
        });
        return t;
    } catch (r) {
        console.error("An error occurred while fetching the crop data:", r);
        throw r;
    }
}
async function getYearRange(model = null) {
    try {
        let url = "/api/data-year";
        if (model) {
            url += `?model=${model}`; // Append model if specified
        }

        let response = await fetch(url);
        let yearRange = await response.json();

        return yearRange;
    } catch (error) {
        console.error("Error fetching year range:", error);
        return "N/A";
    }
}

function getProductions() {
    return new Promise((r, o) => {
        $.ajax({
            url: "api/productions",
            method: "GET",
            dataType: "json",
            success: function (e) {
                r(e);
            },
            error: function (e, r, t) {
                console.error("Failed to fetch production data:", r, t);
                o([]);
            },
        });
    });
}

async function getBarangay() {
    try {
        const r = await $.ajax({
            url: "api/barangays",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching barangay data:", e);
        throw e;
    }
}
async function getFarmer() {
    try {
        const r = await $.ajax({
            url: "api/farmers",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching farmer data:", e);
        throw e;
    }
}
async function getRecord() {
    try {
        const r = await $.ajax({
            url: "api/records",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching record data:", e);
        throw e;
    }
}
async function getSoilHealth() {
    try {
        const r = await $.ajax({
            url: "api/soilhealths",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching soil health data:", e);
        throw e;
    }
}
async function getUsers() {
    try {
        const r = await $.ajax({
            url: "api/users",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching user data:", e);
        throw e;
    }
}
async function getConcerns() {
    try {
        const r = await $.ajax({
            url: "api/concerns",
            type: "GET",
            dataType: "json",
        });
        return r;
    } catch (e) {
        console.error("An error occurred while fetching barangay data:", e);
        throw e;
    }
}

async function getRiceProduction(e = "", r = "") {
    try {
        const o = await $.ajax({
            url: "api/riceProductions",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        const c = o
            .filter(
                (e) =>
                    (a === "" || e.cropName.toLowerCase() === a) &&
                    (n === "" || e.season.toLowerCase() === n)
            )
            .map((e) => {
                const r =
                    e.barangay.charAt(0).toUpperCase() +
                    e.barangay.slice(1).toLowerCase();
                return { ...e, barangay: r };
            });
        return c;
    } catch (t) {
        console.error(
            "An error occurred while fetching the rice production data:",
            t
        );
        throw t;
    }
}
async function getProduction(e = "", r = "") {
    try {
        const o = await $.ajax({
            url: "api/productions",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        return o.filter(
            (e) =>
                (a === "" || e.cropName.toLowerCase() === a) &&
                (n === "" || e.season.toLowerCase() === n)
        );
    } catch (t) {
        console.error(
            "An error occurred while fetching the production data:",
            t
        );
        throw t;
    }
}
async function getDamages(e = "", r = "") {
    try {
        const o = await $.ajax({
            url: "api/damages",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        return o.filter(
            (e) =>
                (a === "" || e.cropName.toLowerCase() === a) &&
                (n === "" || e.season.toLowerCase() === n)
        );
    } catch (t) {
        console.error("An error occurred while fetching the damages data:", t);
        throw t;
    }
}
async function getPrice(e = "", r = "") {
    try {
        const o = await $.ajax({
            url: "api/prices",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        return o.filter(
            (e) =>
                (a === "" || e.cropName.toLowerCase() === a) &&
                (n === "" || e.season.toLowerCase() === n)
        );
    } catch (t) {
        console.error("An error occurred while fetching the price data:", t);
        throw t;
    }
}
async function getPest(e = "", r = "") {
    try {
        const o = await $.ajax({
            url: "api/pests",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        return o.filter(
            (e) =>
                (a === "" || e.cropName.toLowerCase() === a) &&
                (n === "" || e.season.toLowerCase() === n)
        );
    } catch (t) {
        console.error("An error occurred while fetching the pest data:", t);
        throw t;
    }
}
async function getDisease(e = "", r) {
    try {
        const o = await $.ajax({
            url: "api/diseases",
            type: "GET",
            dataType: "json",
        });
        const a = e ? e.toLowerCase() : "";
        const n = r ? r.toLowerCase() : "";
        return o.filter(
            (e) =>
                (a === "" || e.cropName.toLowerCase() === a) &&
                (n === "" || e.season.toLowerCase() === n)
        );
    } catch (t) {
        console.error("An error occurred while fetching the disease data:", t);
        throw t;
    }
}
function addDownload(e, t) {
    return new Promise((r, o) => {
        $.ajax({
            url: "api/downloads/add",
            method: "POST",
            dataType: "json",
            data: { name: e, type: t },
            success: function (e) {
                r(e);
            },
            error: function (e, r, t) {
                console.error("Failed to add download:", r, t);
                o(e.responseJSON || "An error occurred");
            },
        });
    });
}
async function getUniqueCropNames(e = null, r = null) {
    try {
        const o = new URLSearchParams();
        if (e) {
            o.append("season", e);
        }
        if (r) {
            o.append("cropType", r);
        }
        const a = await fetch(`/api/unique-crop-names?${o.toString()}`);
        if (!a.ok) {
            throw new Error("Network response was not ok");
        }
        const n = await a.json();
        return n.map((e) => e.toLowerCase());
    } catch (t) {
        console.error("Failed to fetch unique crop names:", t);
        return [];
    }
}
function getTotalAreaPlanted(e, r) {
    return new Promise((t, o) => {
        $.ajax({
            url: `/api/production/total-area-planted/${e}/${r}`,
            type: "GET",
            dataType: "json",
            success: function (e) {
                let r = e.totalAreaPlanted;
                t(r);
            },
            error: function (e, r, t) {
                console.error("Error fetching data:", e);
                o(t);
            },
        });
    });
}
export {
    getCrop,
    getBarangay,
    getProduction,
    getRiceProduction,
    getProductions,
    getPrice,
    getPest,
    getDisease,
    getFarmer,
    getRecord,
    getUsers,
    getConcerns,
    getYearRange,
    getUniqueCropNames,
    addDownload,
    getCropVarieties,
    getCropName,
    getTotalAreaPlanted,
    getDamages,
    getBarangayCount,
    getConcernCount,
    getDataEntriesCount,
    getRecordCount,
    getSoilHealth,
    getUserCount,
    getDownloadCount,
    getFarmerCount,
};
