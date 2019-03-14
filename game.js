require('./js/libs/weapp-adapter.js')
window.p2 = require('./js/libs/p2.js')
window.PIXI = require('./js/libs/pixi.js')
window.Phaser = require('./js/libs/phaser-split.js')

// 定义全局变量
window.WIDTH = 750
window.SCALE = WIDTH / canvas.width // 游戏宽度/ canvas宽度
window.HEIGHT = canvas.height * SCALE

// Global Object 用于在 state 之间共享数据和方法
window.go = {
  game: null, // 游戏实例
  userInfo: null, // 玩家信息
  opponentInfo: null, // 对手消息
  common: require('js/common'), // 公共函数
  server: null, // 与服务器交互
  launchRoomId: null, // 进入主菜单需要加入的房间 id
  battle: null // 对战状态
}

// 初始化游戏
const config = {
  width: WIDTH,
  height: HEIGHT,
  renderer: Phaser.CANVAS, // 渲染器
  canvas: canvas // 将游戏绘制在 adapter 为我们创建的 canvas 上
}
const game = new Phaser.Game(config) // 创建游戏
go.game = game

// 注册游戏场景
game.state.add('start', require('./js/states/start'))
game.state.add('menu', require('./js/states/menu'))
game.state.add('practice', require('./js/states/practice'))
game.state.start('start') // 启动游戏场景
