function getDataTxt() {
  var promise = axios({
    // method : Phương thức sử dụng
    method: 'GET',
    // url : đường dẫn tới file cần đọc
    url: './data/data.txt',
    // responseType : xác định định dạng dữ liệu file cần đọc
    responseType: 'text',
  });

  // then giúp xử lí các hành động khi dữ liệu được gọi về thành công
  // catch giúp trả về lỗi khi gọi dữ liệu và các xử lí ở bên trong
  promise
    .then(function (result) {
      console.log(result);
      var content = result.data;
      // dom tới thẻ H2 và đưa dữ liệu lên giao diện
      document.getElementById('loiDongNoi').innerHTML = content;
    })
    .catch(function (error) {
      console.log(error);
      document.getElementById('loiDongNoi').innerHTML = 'Có lỗi xảy ra báo BE';
    });
}

getDataTxt();

function getDataXml() {
  var promise = axios({
    method: 'GET',
    url: './data/data.xml',
    responseType: 'document',
  });

  promise
    .then(function (result) {
      console.log(result);
      // result.data giúp truy cập vào document của file xml, có thể sử dụng các phương thức như querySelector để gọi dữ liệu
      var hoTen = result.data.querySelector('hoTen').innerHTML;
      console.log(hoTen);
    })
    .catch(function (error) {
      console.log(error);
    });
}

getDataXml();

function getDataJson() {
  var promise = axios({
    method: 'GET',
    url: './data/data.json',
    responseType: 'json',
  });

  promise
    .then(function (result) {
      console.log(result);
      document.getElementById('loiDongNoi').innerHTML = result.data.hoTen;
      document.getElementById('lop').innerHTML = result.data.lop;
    })
    .catch(function (error) {
      console.log(error);
    });
}

getDataJson();
