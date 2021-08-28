function upload() {
  const reader = new FileReader(); // 파일리더기 const선언
  const photo = document.getElementById("photo"); // photo라는 id를 가진 태그를 sell.html에서 찾음
  reader.readAsArrayBuffer(photo.files[0]); // Read Provided File(photo(file)을 버퍼로 읽음)
  reader.onloadend = function () { // 리더가 준비되면
    const ipfs = window.IpfsApi('localhost', 5001) // IPFS에 연결(Connect to IPFS)
    const buf = buffer.Buffer(reader.result) // reader의 결과(data)를 buffer로 변환
    // 비동기함수로 호출하지 않을 경우 데이터를 다 받아올때까지 나머지(밑에) 코드는 동작하기 않기때문에 비동기로 처리
    ipfs.files.add(buf, (err, result) => { // IPFS에 버퍼(file)을 업로드함(Upload buffer to IPFS) 비동기함수
      if (err) {
        console.error(err); // 에러가 났을때 출력
        return;
      }
      // 상품들을 등록하기 위해서 id값으로 var변수로 받아옴
      var brand_name = document.getElementById("brand_name");
      var year = document.getElementById("year");
      var price = document.getElementById("price");
      var phone = document.getElementById("phone");
      // file함수의 0(전달된 값)을 hash로 변환해서 초기화
      var hash = result[0].hash;
      // ipfs url
      let url = `https://ipfs.io/ipfs/${result[0].hash}`
      console.log(hash);
      // 이 url로 ipfs서버로 해시형태로 변환되서 그림파일이 잘 넘어갔는지 확인 가능
      console.log(`Url --> ${url}`)
      console.log(
        '브랜드명 : ' + brand_name.options[brand_name.selectedIndex].value +
        '연식 : ' + year.value +
        '가격 : ' + price.value +
        '연락처 : ' + phone.value
      );
      //상품등록하는 비동기 함수
      bicycle.addProduct(brand_name.options[brand_name.selectedIndex].value, year.value, price.value, phone.value, hash, function(e,r) {
        console.log(r);
        alert("상품을 등록하였습니다.");
      });
    })
  }
}