const VERSION_QUESTS = {
    "5.0": [
        "Chuyện về giấc mơ trong lửa",
        "Người tìm lại không thể tìm thấy",
        "Giữa lời hứa và lãng quên",
        "Đem màn đêm trả lại cho màn đêm",
        "Cầu nguyện với ngôi sao",
        "Làm quen với rắc rối",
        "Đạp sóng xuyên cầu vồng báu vật và nhà sưu tầm",
        "Chờ hạt giống nảy mầm",
        "Tepelisaur trốn tìm",
        "Quà tặng và quà trả lễ",
        "Ngày thường của người yêu thích Saurian",
        "Đôi cánh nặng nề",
        "Lên phim nào",
        "Hôm nay thích hợp để ăn cá",
        "Lời nói dối và lời hứa",
        "Người bạn đặc biệt",
        "Lời mời gọi của võ thuật thần bí",
        "Ngọc bóng đêm",
        "Bóng hình của dãy núi"
    ],
    "5.2": [
        "Vượt qua bức tường sương mù",
        "Cuộc phiêu lưu ở vương quốc sương mù",
        "Tonatiuh chuyển động",
        "Khó khăn của bác sĩ Saurian",
        "Sự việc luôn đến bất ngờ",
        "Thời hạn hai mươi bốn tiếng",
        "Cuộc thi bay và bằng chứng ngoại phạm",
        "Tạm biệt nhé, chiếc bánh quy Saurus cuối cùng",
        "Dâng trái tim cho ta",
        "Saurian về tổ",
        "Hòn đảo cô độc có tên là Đêm Đen",
        "Đá, dừa và kẻ buôn Saurian",
        "Bí ẩn của vịnh Tecoloapan",
        "Vũ điệu dưới ánh trăng",
        "Cùng tôi bay cao",
        "Đồng hành cạnh bên",
        "Tình bạn giữa nước và lửa",
        "Mùa thay lông",
        "Mọi khía cạnh của chiến binh",
        "Sự méo mó lan rộng",
        "Xông lên, xông lên nào"
    ],
    "5.5": [
        "Con đường lên núi",
        "Đá vụn và chuyện xưa",
        "Con đường hướng về vực lửa",
        "Người ghi chép của tòa thành hoang (8 quest nhỏ siêu dài)",
        "Màn kết của ngược lửa quay về",
        "Nhà điều tra di tích cổ",
        "Lớp mỡ vĩ đại (quest 2 ngày)",
        "Tepetlisaur màu tím tấn công",
        "Nóng bức thực sự có hiệu quả",
        "Bức ảnh từ Fontaine"
    ],
    "5.8": [
        "Cuộc gặp lúc nhàn nhã",
        "Hân hoan sau tìm kiếm",
        "Vết tích dòng chảy màu",
        "Tỏa sáng nào! Cuộc thi thần tượng Pipilpan",
        "Cuộc gặp ở Tete",
        "Paititi trong mơ",
        "Người Tenochtzitoc cuối cùng",
        "5 kỷ niệm thắng cảnh",
        "Cúp anh hùng Ayar",
        "Màu xanh lá cây"
    ]
};

const REGION_QUESTS = {
    natlan: Object.entries(VERSION_QUESTS).flatMap(([version, quests]) =>
        quests.map((name, index) => [`natlan-${version.replace(".", "-")}-${index + 1}`, name])
    ),
    "nod-krai": [
        ["nod-quest-1", "Đặt chân đến Nod Krai"],
        ["nod-quest-2", "Tìm hiểu khu vực mới"],
        ["nod-quest-3", "Giúp đỡ cư dân địa phương"],
        ["nod-quest-4", "Hoàn thành chuỗi nhiệm vụ"]
    ],
    snezhnaya: [
        ["snezhnaya-quest-1", "Khám phá vùng đất băng giá"],
        ["snezhnaya-quest-2", "Tìm hiểu về Fatui"],
        ["snezhnaya-quest-3", "Gặp gỡ các nhân vật quan trọng"],
        ["snezhnaya-quest-4", "Hoàn thành nhiệm vụ chính"]
    ]
};

const STORAGE_USERS = "quest-tracker-users";
const STORAGE_SESSION = "quest-tracker-current-user";
const STORAGE_THEME = "quest-tracker-theme";

const currentUser = () => sessionStorage.getItem(STORAGE_SESSION);

function progressKey(region) {
    return `quest-progress:${currentUser().toLowerCase()}:${region}`;
}

function getProgress(region) {
    try {
        return JSON.parse(localStorage.getItem(progressKey(region)) || "{}");
    } catch {
        return {};
    }
}

function saveProgress(region, progress) {
    localStorage.setItem(progressKey(region), JSON.stringify(progress));
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
    } catch {
        return {};
    }
}

function protectPage() {
    if (!currentUser()) {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderVersionQuests() {
    const version = document.body.dataset.version;
    const list = document.querySelector(".quest-list");

    if (!list || !VERSION_QUESTS[version]) return;

    list.innerHTML = VERSION_QUESTS[version].map((name, index) => {
        const id = `natlan-${version.replace(".", "-")}-${index + 1}`;
        return `
            <li class="quest-item">
                <input type="checkbox" id="${id}">
                <label for="${id}">${name}</label>
            </li>
        `;
    }).join("");
}

function updateQuestPage() {
    const region = document.body.dataset.region;
    const progress = getProgress(region);
    const checkboxes = [...document.querySelectorAll(".quest-item input")];
    const keyword = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const filter = document.getElementById("filterSelect")?.value || "all";
    let completed = 0;

    checkboxes.forEach(checkbox => {
        checkbox.checked = progress[checkbox.id] === true;
        const item = checkbox.closest(".quest-item");
        const label = item.querySelector("label");
        const done = checkbox.checked;

        if (done) completed++;

        const matchesText = label.textContent.toLowerCase().includes(keyword);
        const matchesFilter = filter === "all" ||
            (filter === "completed" && done) ||
            (filter === "pending" && !done);

        item.hidden = !(matchesText && matchesFilter);
    });

    const total = checkboxes.length;
    const percent = total ? Math.round(completed / total * 100) : 0;

    document.getElementById("progressText").textContent =
        `${completed}/${total} nhiệm vụ (${percent}%)`;
    document.getElementById("progressBar").value = completed;
    document.getElementById("progressBar").max = total;

    const visible = checkboxes.some(item => !item.closest(".quest-item").hidden);
    document.getElementById("emptyMessage").hidden = visible;
}

function initQuestPage() {
    if (!protectPage()) return;

    renderVersionQuests();

    const region = document.body.dataset.region;
    const progress = getProgress(region);

    document.querySelectorAll(".quest-item input").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            progress[checkbox.id] = checkbox.checked;
            saveProgress(region, progress);
            updateQuestPage();
            showToast(checkbox.checked ? "Đã lưu nhiệm vụ." : "Đã bỏ đánh dấu.");
        });
    });

    document.getElementById("searchInput")?.addEventListener("input", updateQuestPage);
    document.getElementById("filterSelect")?.addEventListener("change", updateQuestPage);

    document.getElementById("resetButton")?.addEventListener("click", () => {
        if (!confirm("Bạn có chắc muốn xóa tiến trình phiên bản này?")) return;

        document.querySelectorAll(".quest-item input").forEach(checkbox => {
            progress[checkbox.id] = false;
        });

        saveProgress(region, progress);
        updateQuestPage();
        showToast("Đã đặt lại tiến trình.");
    });

    updateQuestPage();
}

function initDashboard() {
    if (!protectPage()) return;

    document.getElementById("userDisplayName").textContent = currentUser();

    let total = 0;
    let completed = 0;

    Object.entries(REGION_QUESTS).forEach(([region, quests]) => {
        const progress = getProgress(region);
        const done = quests.filter(([id]) => progress[id] === true).length;

        total += quests.length;
        completed += done;

        document.querySelector(`[data-completed="${region}"]`).textContent =
            `${done}/${quests.length} hoàn thành`;

        const bar = document.querySelector(`[data-progress="${region}"]`);
        bar.value = done;
        bar.max = quests.length;
    });

    document.getElementById("totalProgress").textContent = total;
    document.getElementById("completedProgress").textContent = completed;
    document.getElementById("overallPercent").textContent =
        `${Math.round(completed / total * 100)}%`;
}

function applyTheme() {
    if (localStorage.getItem(STORAGE_THEME) === "dark") {
        document.body.classList.add("dark");
    }
}

function logout() {
    sessionStorage.removeItem(STORAGE_SESSION);
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();

    document.getElementById("loginForm")?.addEventListener("submit", event => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const users = getUsers();
        const message = document.getElementById("formMessage");

        if (!users[username.toLowerCase()]) {
            message.textContent = "Tài khoản chưa tồn tại. Hãy đăng ký trước.";
            return;
        }

        if (users[username.toLowerCase()] !== password) {
            message.textContent = "Mật khẩu không chính xác.";
            return;
        }

        sessionStorage.setItem(STORAGE_SESSION, username);
        window.location.href = "dashboard.html";
    });

    document.getElementById("registerBtn")?.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const users = getUsers();
        const message = document.getElementById("formMessage");

        if (username.length < 3 || password.length < 4) {
            message.textContent = "Tên tài khoản cần ít nhất 3 ký tự và mật khẩu ít nhất 4 ký tự.";
            return;
        }

        if (users[username.toLowerCase()]) {
            message.textContent = "Tài khoản này đã tồn tại.";
            return;
        }

        users[username.toLowerCase()] = password;
        localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
        sessionStorage.setItem(STORAGE_SESSION, username);
        window.location.href = "dashboard.html";
    });

    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("themeBtn")?.addEventListener("click", () => {
        const dark = document.body.classList.toggle("dark");
        localStorage.setItem(STORAGE_THEME, dark ? "dark" : "light");
    });

    if (document.body.dataset.page === "dashboard") initDashboard();
    if (document.body.dataset.page === "quests") initQuestPage();
});