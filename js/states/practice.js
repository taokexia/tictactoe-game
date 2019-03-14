// 单人练习
let cd // 倒计时
let board // 棋盘
let currentPlayer // 当前玩家
let intervalId // 倒计时定时器 Id, 用于清理倒计时定时器
let lastTimestamp  // 用于计算倒计时
let renderCD // 渲染倒计时
let setPiece // 落子

// 游戏结束
function over(result) {
  // 清理倒计时定时器
  clearInterval(intervalId)
  // 显示结果层
  go.common.showResult({
    result,
    meName: go.userInfo.nickName,
    meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
    opponentName: '电脑',
    opponentAvatar: 'avatar_unknow',
    // 结果层 UI 中有一个回到首页按钮，设置它点击回调
    callback: () => {
      go.game.state.start('menu')
    }
  })
}

// 落子，并返回游戏是否结束
function placePiece(row, col) {
  // 玩家落子
  board[row][col] = currentPlayer
  setPiece(row, col, currentPlayer)
  // 检查游戏结果
  if(checkOver()) return true
  // 双方换手
  currentPlayer = 1 - currentPlayer
  return false
}

// 重设游戏
function reset() {
  // 0 是自己， 1 是对手， -1 是空
  board = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1]
  ]

  // 随机选择先手玩家
  currentPlayer = Math.round(Math.random())

  // 倒计时(没人 60 秒)
  cd = [60000, 60000]
  lastTimestamp = Date.now()
  intervalId = setInterval(() => {
    // 更新倒计时
    const current = Date.now()
    const delta = current - lastTimestamp
    lastTimestamp = current
    cd[currentPlayer] = cd[currentPlayer] - delta
    renderCD(cd[0], cd[1])

    // 时间到，当前执子玩家判负
    cd[0] <= 0 && over('loose')
    cd[1] <= 0 && over('win')
  }, 500)
}

// 检查游戏结果
function checkOver() {
  if(go.common.checkWin(board)) {
    if(currentPlayer === 0) over('win')
    else over('lose')
    return true
    // 判断是否平局
  } else if(go.common.checkDraw(board)) {
    over('draw')
    return true
  }
  return false
}

class Practice extends Phaser.State {
  create() {
    // 画背景
    this.add.image(0, 0, 'bg_playing')
    // 重设游戏
    reset()
    // 调用 go.common.addBattleInfo 绘制游戏信息
    // 绘制游戏信息，并返回一个用于更新倒计时的函数
    renderCD = go.common.addBattleInfo({
      meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
      meName: go.userInfo.nickName,
      opponentAvatar: 'avatar_unknow',
      opponentName: '电脑'
    })
    // 传入玩家及对手倒计时，进行更新
    renderCD(cd[0], cd[1])
    // 调用 go.Common.addPieces 画棋盘
    // 返回一个用于落子的函数
    setPiece = go.common.addPieces((row, col) => {
      if(currentPlayer !== 0) return
      // 玩家落子
      const isOver = placePiece(row, col)
      if(isOver) return

      const stratage = [
        [1, 1],
        [0, 0], [0, 2], [2, 0],[2, 2],
        [0, 1], [1, 0], [1, 2], [2, 1]
      ]
      // 找到一个空位
      const availableCoord = stratage.find(coord =>board[coord[0]][coord[1]] === -1)
      // 落子
      placePiece(availableCoord[0], availableCoord[1])
    })

    // 若随机到电脑先下
    if (currentPlayer === 1) {
      placePiece(1, 1)
    }
  }
}

module.exports = Practice