var arrUser = [];

// -------- Hàm lấy danh sách sinh viên ----------
function getDataUser() {
  var promise = axios({
    method: 'GET',
    url: 'https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien',
  });
  promise
    .then(function (result) {
      console.log(result.data);
      // result.data là mảng chứa các sinh viên lấy được từ server
      arrUser = result.data;
      renderDataUser(result.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// chạy khi trang load lên để lấy dữ liệu
getDataUser();

function renderDataUser(arr) {
  var content = '';

  for (var i = 0; i < arr.length; i++) {
    var sinhVien = arr[i];
    var diemTrungBinh =
      (sinhVien.diemToan +
        sinhVien.diemLy +
        sinhVien.diemHoa +
        sinhVien.diemRenLuyen) /
      4;
    content += ` <tr class="table-dark">
    <td scope="row">${sinhVien.maSinhVien}</td>
    <td>${sinhVien.tenSinhVien}</td>
    <td>${sinhVien.loaiSinhVien}</td>
    <td>${diemTrungBinh}</td>
    <td>${sinhVien.email}</td>
    <td>${sinhVien.soDienThoai}</td>
    <td>
      <button onclick="deleteDataUser('${sinhVien.maSinhVien}')" class="btn btn-danger">Xoá</button>
      <button class="btn btn-warning" onclick="getInfoUser('${sinhVien.maSinhVien}')">Sửa</button>
    </td>
  </tr>`;
  }

  document.querySelector('.table-group-divider').innerHTML = content;
}

// -------- Hàm thêm sinh viên ---------
function addDataUser() {
  // chặn reload trang
  event.preventDefault();
  // lấy dữ liệu sinh viên
  var sinhVien = {};
  // input,textarea
  // {
  //   background-color : red
  // }
  // input {
  //   background-color : red
  // }
  // text - area {
  //   background-color : red
  // }
  var arrValue = document.querySelectorAll('form input,select');
  console.log(arrValue);
  // từng phần tử trong arrValue là một dom tới thẻ html, cụ thể là dom tới input và select
  for (var i = 0; i < arrValue.length; i++) {
    // id , value
    // data là từng phần tử dom khi gọi querySelectorAll, vì đang dom nên có thể . tới các thuộc tính bên trong thẻ như id,value....
    var data = arrValue[i];
    console.log(data.id);
    // maSinhVien
    sinhVien[data.id] = data.value;
  }
  console.log(sinhVien);
  // FormData
  var promise = axios({
    method: 'POST',
    url: 'https://svcy.myclass.vn/api/SinhVienApi/ThemSinhVien',
    // data giúp truyền dữ liệu lên server
    data: sinhVien,
  });
  promise
    .then(function (result) {
      console.log(result);
      // khi gọi thêm dữ liệu thành công, ta gọi tới server một lần nữa để lấy danh sách sinh viên mới
      // khi tác động vào dữ liệu trên server, lưu ý sẽ gọi tới server để lấy dữ liệu mới, các tác động bao gồm: xoá, thêm, sửa....
      getDataUser();
      openToast(result.data);
    })
    .catch(function (error) {
      console.log(error);
      openToast(error.response.data);
    });
}

// string = 'thêm sinh viên thành công';
function openToast(string) {
  document.querySelector('.toast-body').innerHTML = string;
  // gọi tới layout toast
  const toastLiveExample = document.getElementById('liveToast');
  // thêm toastBootstrap để có thể sử dụng phương thức show giúp mở toast lên
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();
}

// ------ Hàm xoá sinh viên ------------
function deleteDataUser(maSinhVien) {
  console.log(maSinhVien);
  var promise = axios({
    method: 'DELETE',
    url: `https://svcy.myclass.vn/api/SinhVienApi/XoaSinhVien?maSinhVien=${maSinhVien}`,
  });
  promise
    .then(function (result) {
      console.log(result);
      getDataUser();
      openToast(result.data);
    })
    .catch(function (error) {
      console.log(error);
      openToast('Có lỗi xảy ra vui lòng thử lại');
      // cho gọi dữ liệu mới nhất từ server để clear cái dữ liệu không có đi
      getDataUser();
    });
}

// ----------- Lấy thông tin một sinh viên ------------------

function getInfoUser(maSV) {
  console.log(maSV);
  // gọi api lấy dữ liệu của sinh viên
  var promise = axios({
    method: 'GET',
    url: `https://svcy.myclass.vn/api/SinhVienApi/LayThongTinSinhVien?maSinhVien=${maSV}`,
  });

  promise
    .then(function (result) {
      console.log(result.data);
      var sinhVien = result.data;
      // chạy vòng lặp đưa dữ liệu sinh viên lên giao diện
      var arrField = document.querySelectorAll('form input, form select');
      console.log(arrField);
      for (var i = 0; i < arrField.length; i++) {
        // arrField một mảng chứa các dom tới các input và select có trong form ==> từng phần tử trong arrField là các dom
        // có id của các input và select trùng khớp với các tên thuộc tính trong đối tượng sinh viên
        // phanTu.value = "abcs"
        // {
        // diemToan, diemLy, diemHoa
        //}
        var id = arrField[i].id;
        //arrField[i].value dom tới input diemToan ==> id = diemToan ==> sinhVien["diemToan"] = 9
        arrField[i].value = sinhVien[id];
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// ---------- Cập nhật thông tin sinh viên ----------------
function updateInfoUser() {
  var arrField = document.querySelectorAll('form input, form select');
  var sinhVien = {};
  for (var i = 0; i < arrField.length; i++) {
    var id = arrField[i].id; // id = tenSinhVien
    // arrField[i] là từng cái dom tới input và select
    sinhVien[id] = arrField[i].value;
  }
  console.log(sinhVien);
  // sinhVien.maSinhVien

  var promise = axios({
    method: 'PUT',
    url: `https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${sinhVien.maSinhVien}
    `,
    data: sinhVien,
  });

  promise
    .then(function (result) {
      console.log(result);
      // cập nhật thành công gọi getDataUser để lấy dữ liệu mới nhất từ server
      getDataUser();
    })
    .catch(function (error) {
      console.log(error);
      openToast('Có lỗi xảy ra');
    });
}

document.querySelector('form .btn-warning').onclick = updateInfoUser;

// ------------ tìm kiếm sinh viên theo tên ---------------

function searchInfoUser(event) {
  // event.target ==> dom tới thẻ sử dụng sự kiện oninput
  var keyword = event.target.value;

  // toLowerCase giúp chuyển đổi chữ hoa thành chữ thường
  // toUpperCase giúp chuyển chữ thường thành chữ hoa
  var newKeyWord = removeVietnameseTones(keyword.toLowerCase().trim());
  console.log(newKeyWord);
  // "long" "Long"
  // với những keyword nhận vào, ta sẽ truyển đổi là viết thường hết hoặc viết hoa hết

  // loại bỏ những khoảng trắng ở trước và sau chuỗi thông qua hàm trim()

  // "dần" "dan"
  var arrFilter = [];
  for (var i = 0; i < arrUser.length; i++) {
    // arrUser ==> từng sinh viên ==> arrUser[i].tenSinhVien chứa tên của sinh viên chúng ta cần
    var tenSinhVien = removeVietnameseTones(
      arrUser[i].tenSinhVien.toLowerCase().trim()
    );

    // dùng hàm includes để kiểm tra xem keyword người dùng gõ vào có sinh viên nào trùng khớp hay không
    if (tenSinhVien.includes(newKeyWord)) {
      // console.log('Tôi là sinh viên bạn cần kiếm nè', arrUser[i]);
      // khi tìm ra sinh viên có keyword nằm trong tên, ta sẽ thêm sinh viên đó vào bên trong mảng mới là arrFilter
      arrFilter.push(arrUser[i]);
    }
    // else {
    //   console.log('tôi không phải', arrUser[i]);
    // }
  }
  console.log(arrFilter);
  // xử lí render dữ liệu khi lọc và tìm được các phần tử thành công
  renderDataUser(arrFilter);

  // "dan"
  // "dah"
}
