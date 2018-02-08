const getScoreRecord = n => {
  return {
    P1: n[0],
    P2: n[1],
    P3: n[2],
    P4: n[3],
    X2: n[4],
    id: n[5] + 1,
  }
}

const testObj = data => {
  var isDataValid = 0;
  for (var i = 0; i < 4; ++i) {
    if (data.currentScore[i] === 0) {
      isDataValid += 1;
      console.log(isDataValid);
    }
  }
  switch (isDataValid) {
    case 0:
      console.log("至少要有一位赢家");
      data.dialog.hidden = false
      data.dialog.title = '至少要有一位赢家'
      break;
    case 1:
      console.log("合理的数据");
      break;
    case 2:
    case 3:
    case 4:
      console.log("最多只能有一位赢家");
      data.dialog.hidden = false
      data.dialog.title = '最多只能有一位赢家'
      break;
    default:
      console.log("default");
  }
  if (isDataValid === 1) {
    var p = [];

    for (var i = 0; i < 6; ++i) {
      p[i] = data.currentScore[i]
    }
    data.scoreArray.push(getScoreRecord(p))
    for (var i = 0; i < 4; ++i) {
      if (p[i] < 8) {

      } else if (p[i] < 10) {
        p[i] *= 2;
      } else if (p[i] < 13) {
        p[i] *= 3;
      } else {
        p[i] *= 4;
      }
      if (p[4] === i) {
        p[i] *= 2;
      }
    }
    data.scoreArrayCalc.push(getScoreRecord(p))

    var length_new = data.scoreArray.length;
    console.log("当前数据长度" + length_new);
    for (var i = 0; i < 4; ++i) {
      data.totalScore[i] += p[i]
    }
    data.totalMoney[0] = (data.totalScore[1] +
      data.totalScore[2] +
      data.totalScore[3]) - data.totalScore[0] * 3;

    data.totalMoney[1] = (data.totalScore[0] +
      data.totalScore[2] +
      data.totalScore[3]) - data.totalScore[1] * 3;

    data.totalMoney[2] = (data.totalScore[0] +
      data.totalScore[1] +
      data.totalScore[3]) - data.totalScore[2] * 3;

    data.totalMoney[3] = (data.totalScore[0] +
      data.totalScore[1] +
      data.totalScore[2]) - data.totalScore[3] * 3;

    for (var i = 0; i < 4; ++i) {
      data.totalMoney[i] /= 10;
    }
    return true;
  }else{
    return false
  }
}

module.exports = {
  getScoreRecord: getScoreRecord,
  testObj: testObj
}