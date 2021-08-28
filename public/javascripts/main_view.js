// 배포(서비스)된 스마트 컨트랙트 주소
let contractAddress = '0xa1d598d962ff6a148c102f11fe1f439d2c44bfdd';
// ABI는 컨트랙트 내의 함수를 호출하거나 컨트랙트로부터 데이터를 얻는 방법. 이더리움 스마트 컨트랙트는 이더리움 블록체인에 배포된 바이트코드다.
let abi =
	[
		{
			"constant": false,
			"inputs": [
				{
					"name": "_indexOfProduct",
					"type": "uint256"
				}
			],
			"name": "sendToBuyer",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_indexOfProduct",
					"type": "uint256"
				}
			],
			"name": "sendToSeller",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "dappDestroy",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getOwner",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "sendFeeToOwner",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "id",
					"type": "uint256"
				}
			],
			"name": "getProduct",
			"outputs": [
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "uint256"
				},
				{
					"name": "",
					"type": "uint256"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "bool"
				},
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [],
			"name": "failBuy",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_indexOfProduct",
					"type": "uint256"
				}
			],
			"name": "sendToCA",
			"outputs": [],
			"payable": true,
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_brandName",
					"type": "string"
				},
				{
					"name": "_date",
					"type": "uint256"
				},
				{
					"name": "_price",
					"type": "uint256"
				},
				{
					"name": "_sellerPhone",
					"type": "string"
				},
				{
					"name": "_image_hash",
					"type": "string"
				}
			],
			"name": "addProduct",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getProductLength",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		}
	];

// 전역적으로 계속 쓰기 위해 let으로 선언
let bicycle;
let bicycleContract;
let accountAddress; // eoa(외부지갑-CA가 아닌 지갑)

// window(창)이(가) load가 되면
window.addEventListener('load', function () {

	// Web3 라이브러리로 객체 불러오기
	if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.log('No web3? You should consider trying MetaMask!')
		// MetaMask 연동
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	}
	// 자체 정의함수 실행
	startApp();
});

function startApp() {
	// abi parameter로 Contract를 가져옴
	bicycleContract = web3.eth.contract(abi);
	// CA를 인자로 contract객체를 bicycle로 가져옴
	bicycle = bicycleContract.at(contractAddress);
	web3.eth.getCode(contractAddress, function(e, r) {
		if(r) {
			if(r=='0x') { //web3.eth.getCode(contractAddress)에서 0x를 반환하면 댑을 파괴한 상태}
				// console.log('파기됨');
				document.getElementById('contractAddr').innerHTML = "<strong>Destroyed Contract!!!</strong>";
			} else { //댑이 있는 상태
				// console.log('계약중');
				document.getElementById('contractAddr').innerHTML = getLink(contractAddress);
			}
		} else {
			console.log(e);
		}
	})
	// 댑 개발자이면 hidden_menu의 style을 inline(보여줌). 댑 개발자가 아니면 none(보여주지 않음)
	bicycle.getOwner(function (e, r) {
		if (r) {
			document.getElementById('hidden_menu').style = "display: inline;";
		} else {
			document.getElementById('hidden_menu').style = "display: none;";
		}
	});
	// AcountAddress(eoa)를 비동기 함수로 가져옴
	web3.eth.getAccounts(function (e, r) { // e: error & r :result
		// 현재 접속된 계정은 r(result)의 0번
		document.getElementById('accountAddr').innerHTML = getLink(r[0]);
		accountAddress = r[0];
		getValue(); // 가진 이더를 보여줌
	});
	getBicycles();
}

function getBicycles() { // 자전거리스트를 보여주는 함수
	bicycle.getProductLength(function (e, r) {
		var result = ''; // 동적으로 태그 생성
		for (let i = 0; i < r; i++) {
			bicycle.getProduct(i, function (e, r) {
				// result += '<div class="show_data">';
				if (r[5] == true) { // 판매상태가 TRUE이면(판매중이면) 보여줌
					result += '<div class="show_data">';
					result += '<img src=https://ipfs.io/ipfs/' + r[6] + '/>'; // ipfs서버에 올라간 이미지를 r[6] 해시값으로 보여줌
					// result += '<h2>' + ' 브랜드명 : ' + r[0] + '</h2>';
					// result += '<h1>' + ' 연식 : ' + r[1] + '</h1>';
					// result += '<h1>' + ' 가격 : ' + r[2] + '</h1>';
					// result += '<input type="hidden" id="price_' + i + '" value="' + r[2] + '"/>';
					// result += '<h1>' + ' 전화번호 : ' + r[3] + '</h1>';
					// result += '<h1>' + ' 판매자(Adress) : ' + r[4] + '</h1>';
					result += '<h2>' + ' 브랜드명 : ' + r[0] + '</h2>';
					result += '<h1>' + ' 연식 : ' + r[1] + '</h1>';
					result += '<h1>' + ' 가격 : ' + r[2] + ' (ETH)</h1>';
					result += '<input type="hidden" id="price_' + i + '" value="' + r[2] + '"/>';
					result += '<h1>' + ' 전화번호 : ' + r[3] + '</h1>';
					result += '<h1>' + ' 판매자(Adress) : ' + r[4] + '</h1>';
					result += '<input type="text" placeholder="금액 입력(ether)" id="buy_' + i + '"/>'; // 금액과 구매의 id도 동적으로 인덱스로 생성
					result += '<input type="button" value="구매" onclick="buy(' + i + ')"/></br>';
					result += '</div>';
				} else { // 판매중이지 않으면 공백
					result += '';
				}
				// data영역에 뿌려줌
				document.getElementById('dataArea').innerHTML = result; 
			});
		}
	});
}

function getLink(addr) {
	// 이더스캔으로 주소를 연결함
	return '<a target="_blank" href=https://testnet.etherscan.io/address/' + addr + '>' + addr + '</a>';
}

function getValue() {
	getEther(); // 이더 반환하는 함수로감
}

function getEther() {
	web3.eth.getBalance(accountAddress, function (e, r) { // 비동기함수로 현재 갖고있는 이더를 보여줌
		document.getElementById('ethValue').innerHTML = web3.fromWei(r.toString()) + "ETH";
	});
}

function buy(i) { // onclick="buy(buy_i)"로 호출이 됨 i는 인덱스
	var buy_price = document.getElementById('buy_' + i); //자기가 낸(입력한) 금액
	var origin_price = document.getElementById('price_' + i); //상품의가격

	// 모든 r은 result값이 있을경우(성공했을 시)
	// 반환이라는 개념을 위해 항상 CA로 돈을 송금해야됨
	// buy_price.value를 CA의 단위인 Wei로 바꿔주기 위해 toWei()를 사용
	// CA에게 전송하는 부분은 내부적으로 콘솔로 처리(모든 거래에서 반환을 위해 sendToCA()함수가 호출되어야됨)
	bicycle.sendToCA(i, { from: accountAddress, gas: 30000, value: web3.toWei(buy_price.value, 'ether')}, function (e, r) {

		if (r) {
			console.log('CA에게 ' + buy_price.value + 'ether를 전송하였습니다.');

			if (buy_price.value < origin_price.value) { // 가진 돈 부족으로 구매 실패
				bicycle.failBuy(function (e, r) {
					if (r) {
						alert('물건을 구매하실 수 없으므로 구매자에게 보낸 돈을 반환합니다.');
					}
				});
			} else if (buy_price.value > origin_price.value) { // 상품금액을 초과한돈을 냈을 때
				bicycle.sendToBuyer(i, function (e, r) {
					if (r) {
						alert('차액인 ' + (buy_price.value - origin_price.value) + 'ether를 구매자에게 반환하였습니다.');

						bicycle.sendToSeller(i, function (e, r) {
							if (r) {
								alert('상품의 99% 가격을 판매자에게 전송하였습니다.');

								bicycle.sendFeeToOwner(function (e, r) {
									if (r) {
										alert('나머지 1%를 개발자에게 전송하였습니다.');
									}
								});
							}
						});
					}
				});
			} else {
				bicycle.sendToSeller(i, function (e, r) { // 상품금액과 같은 돈을 냈을 때
					if (r) {
						alert('상품의 99% 가격을 판매자에게 전송하였습니다.');

						bicycle.sendFeeToOwner(function (e, r) {
							if (r) {
								alert('나머지 1%를 개발자에게 전송하였습니다.');
							}
						});
					}
				});
			}
		}
	});
}

// 댑을 파괴하는 함수
function dstroy_dapp() {
	bicycle.dappDestroy(function (e, r) {
		if(r) {
			alert(r + " DAPP 을 파기하였습니다");
			document.getElementById('contractAddr').innerHTML = "Destroyed Contract!!";
		}
	});

}