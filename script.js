var tbody = document.querySelector("#table tbody");
var dataset = [];
var 중단플래그 = false;
var 열은칸 = 0; // 오픈한 칸을 기록하는 변수
var 코드표 = {
  연칸: -1,
  물음표: -2,
  깃발: -3,
  깃발지뢰: -4,
  물음표지뢰: -5,
  지뢰: 1,
  보통칸: 0,
};
document.querySelector("#exec").addEventListener("click", function () {
  tbody.innerHTML = ""; // tbody의 내부 태그들을 모두 지움
  document.querySelector("#result").textContent = "";
  dataset = [];
  열은칸 = 0;
  중단플래그 = false;
  var hor = parseInt(document.querySelector("#hor").value);
  var ver = parseInt(document.querySelector("#ver").value);
  var mine = parseInt(document.querySelector("#mine").value);

  //지뢰 위치 뽑기
  var 후보군 = Array(hor * ver) // 가로 * 세로 = 칸의갯수 만큼 빈 배열을 만들고
    .fill() // undefinde 로 그 배열을 채운다
    .map(function (요소, 인덱스) {
      // 1대1로 채운다
      return 인덱스; // 1~100 까지 그 배열을 채움
    }); // 이 배열은 외워두면 쓸모가 많다!!
  //숫자를 1~100 까지 만들고
  var 셔플 = []; // 숫자를 랜덤하게 넣어주는 변수 셔플에 그 숫자가 한개씩 찬다 -- > 피셔예이츠 셔플이라고 부른다

  while (후보군.length > hor * ver - mine) {
    var 이동값 = 후보군.splice(Math.floor(Math.random() * 후보군.length), 1)[0];
    셔플.push(이동값);
  }
  //지뢰 테이블 만들기

  for (var i = 0; i < ver; i += 1) {
    var arr = [];
    var tr = document.createElement("tr");
    dataset.push(arr);
    for (var j = 0; j < hor; j += 1) {
      arr.push(코드표.보통칸);
      var td = document.createElement("td");
      td.addEventListener("contextmenu", function (e) {
        // 오른쪽클릭 방지
        e.preventDefault();
        if (중단플래그) {
          return; // return을 활용하여 아래 코드의 실행을 막아 게임을 중단시킴
        }
        var 부모tr = e.currentTarget.parentNode;
        var 부모tbody = e.currentTarget.parentNode.parentNode;
        var 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget);
        var 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr); // indexOf를 사용하고 싶은데 배열이 아닌 상황에 써야할때 강제적용
        if (
          e.currentTarget.textContent == "" ||
          e.currentTarget.textContent === "X"
        ) {
          e.currentTarget.textContent = "!";
          e.currentTarget.classList.add("flag");
          if (dataset[줄][칸] == 코드표.지뢰) {
            dataset[줄][칸] = 코드표.깃발지뢰;
          } else {
            dataset[줄][칸] = 코드표.깃발;
          }
        } else if (e.currentTarget.textContent == "!") {
          e.currentTarget.textContent = "?"; // 오른쪽 클릭 두번시 물음표
          e.currentTarget.classList.remove("flag"); // flag라는 스타일을 지움
          e.currentTarget.classList.add("question"); // question이라는 스타일을 추가함
          if (dataset[줄][칸] == 코드표.깃발지뢰) {
            dataset[줄][칸] = 코드표.물음표지뢰;
          } else {
            dataset[줄][칸] = 코드표.물움표;
          }
        } else if (e.currentTarget.textContent == "?") {
          e.currentTarget.classList.remove("question"); // flag라는 스타일을 지움
          if (dataset[줄][칸] == 코드표.물음표지뢰) {
            e.currentTarget.textContent = "X";
            dataset[줄][칸] = 코드표.지뢰;
          } else {
            e.currentTarget.textContent = "";
            dataset[줄][칸] = 코드표.보통칸;
          }
        }
      });

      td.addEventListener("click", function (e) {
        if (중단플래그) {
          return; // return을 활용하여 아래 코드의 실행을 막아 게임을 중단시킴
        }
        // 재귀식 코드
        // 클릭했을때  주변 지뢰 개수
        var 부모tr = e.currentTarget.parentNode;
        var 부모tbody = e.currentTarget.parentNode.parentNode;
        var 칸 = Array.prototype.indexOf.call(부모tr.children, e.currentTarget);
        var 줄 = Array.prototype.indexOf.call(부모tbody.children, 부모tr); // indexOf를 사용하고 싶은데 배열이 아닌 상황에 써야할때 강제적용
        if (
          [
            코드표.연칸,
            코드표.깃발,
            코드표.깃발지뢰,
            코드표.물음표지뢰,
            코드표.물음표,
          ].includes(dataset[줄][칸])
        ) {
          return;
        }
        // 클릭했을때
        e.currentTarget.classList.add("opened"); // td클래스에 opened라는 css를 추가함
        열은칸 += 1; // 클릭시 오픈한 칸을 기록
        if (dataset[줄][칸] == 코드표.지뢰) {
          //지뢰클릭
          e.currentTarget.textContent = "펑";
          document.querySelector("#result").textContent = "실패!!";
          중단플래그 = true;
        } else {
          var 주변 = [dataset[줄][칸 - 1], dataset[줄][칸 + 1]];
          if (dataset[줄 - 1]) {
            주변 = 주변.concat(
              // concat는 배열과 배열을 합쳐 새로운 배열을 만듭니다
              dataset[줄 - 1][칸 - 1],
              dataset[줄 - 1][칸],
              dataset[줄 - 1][칸 + 1]
            );
          }
          if (dataset[줄 + 1]) {
            주변 = 주변.concat(
              //concat은 새로운 배열을 반환하기 때문에 대입이 핋수
              dataset[줄 + 1][칸 - 1],
              dataset[줄 + 1][칸],
              dataset[줄 + 1][칸 + 1]
            );
          }
          var 주변지뢰개수 = 주변.filter(function (v) {
            return [코드표.지뢰, 코드표.깃발지뢰, 코드표.물음표지뢰].includes(
              v
            ); // 지뢰의 개수를 세준다.
          }).length; // 클릭한 칸을 기준으로 둘러싼 여덟칸
          // 앞의 갚이 거짓인 갚이면 뒤에것을 대신 써라 (false, '', 0, null, undefined , NaN)
          e.currentTarget.textContent = 주변지뢰개수 || " ";
          dataset[줄][칸] = 코드표.연칸; // 데이터 칸을 열때 0인 곳을 제외하고 연다 (재귀함수시 효율성을 위해)
          //숫자
          if (주변지뢰개수 == 0) {
            var 주변칸 = [];
            if (tbody.children[줄 - 1]) {
              주변칸 = 주변칸.concat([
                //concat은 새로운 배열을 반환하기 때문에 대입이 핋수
                tbody.children[줄 - 1].children[칸 - 1],
                tbody.children[줄 - 1].children[칸],
                tbody.children[줄 - 1].children[칸 + 1],
              ]);
            }
            주변칸 = 주변칸.concat([
              //concat은 새로운 배열을 반환하기 때문에 대입이 핋수
              tbody.children[줄].children[칸 - 1],
              tbody.children[줄].children[칸 + 1],
            ]);
            if (tbody.children[줄 + 1]) {
              주변칸 = 주변칸.concat([
                //concat은 새로운 배열을 반환하기 때문에 대입이 핋수
                tbody.children[줄 + 1].children[칸 - 1],
                tbody.children[줄 + 1].children[칸],
                tbody.children[줄 + 1].children[칸 + 1],
              ]);
            }
            주변칸
              .filter(function (v) {
                return !!v;
              })
              .forEach(function (옆칸) {
                var 부모tr = e.currentTarget.parentNode;
                var 부모tbody = e.currentTarget.parentNode.parentNode;
                var 옆칸칸 = Array.prototype.indexOf.call(
                  부모tr.children,
                  옆칸
                );
                var 옆칸줄 = Array.prototype.indexOf.call(
                  부모tbody.children,
                  부모tr
                );
                if (dataset[옆칸줄][옆칸칸] !== 코드표.연칸) {
                  옆칸.click();
                }
              });
          }
          // undefined null 을 제거하는 코드
        }
        if (열은칸 == hor * ver - mine) {
          // 모든 칸을 오픈했을때 줄과 칸을 곱한후 지뢰갯수를 뺀 값만큼 열리면 성공!
          중단플래그 = true;
          document.querySelector("#result").textContent = "승리!!";
        }
        //주변 8칸 동시 오픈
      });
      tr.appendChild(td); // 화면부분
      //td.textContent = 1; // 각 칸들에 데이터값 입력
    }
    tbody.appendChild(tr); // 화면부분
  }
  //지뢰심기
  for (var k = 0; k < 셔플.length; k++) {
    // 예 60
    var 세로 = Math.floor(셔플[k] / ver); //예 5
    var 가로 = 셔플[k] % ver; // %는 나머지 8
    tbody.children[세로].children[가로].textContent = "X"; // 화면에 tbody태그에 tr td에 X를 대입
    dataset[세로][가로] = 코드표.지뢰; // 2치원배열
  }
});

// function 재귀함수(숫자) {
//   console.log(숫자);
//   if (숫자 < 5) { // 무한히 반복되지 않게 제한을 둠
//     재귀함수(숫자 + 1); // 자기 자신을 실행
//   }
// }

// 재귀함수(1); // 무한 반복문과 가깝다
