class SinhVien {
   constructor(fullName, studentId) {
        this.fullName = fullName;
        this.studentId = studentId;
        this.course = this.detectCourse();
        this.faculty = this.detectFaculty();
        this.email = this.taoEmail();
    }
    detectCourse() {
        let k = this.studentId.substring(0, 2); 
        return "K" + k;
    }

    detectFaculty() {
        if (this.studentId.includes("404")) {
            return "CNTT & KTS";
        }
        return "Khoa khác"; 
    }

    taoEmail() {
        let parts = this.fullName.trim().split(" ");
        let lastName = parts[parts.length - 1];
        let initials = "";
        for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i][0]) initials += parts[i][0];
        }
        return (lastName + initials).toLowerCase() + "." + this.studentId.toLowerCase() + "@hvnh.edu.vn";
    }
}

window.onload = function () {
    fetch("Danh sach sinh vien.xlsx")
        .then(res => res.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            xuLySinhVien(jsonData);
        })
        .catch(err => console.error("Lỗi đọc file:", err));
};

function xuLySinhVien(data) {
    let danhSach = [];

    data.forEach(item => {
        let sv = new SinhVien(
            item["Họ tên"], 
            item["Mã SV"], 
            item["Khoa"] || "N/A" 
        );

        danhSach.push(sv);
    });
    hienThi(danhSach);
}

function hienThi(ds) {
    let html = "";

    ds.forEach(sv => {
        html += `
            <tr>
                <td>${sv.fullName}</td>
                <td>${sv.studentId}</td>
                <td>${sv.course}</td>
                <td>${sv.faculty}</td>
                <td>${sv.email}</td>
            </tr>
        `;
    });

    document.getElementById("tableBody").innerHTML = html;
}