const TWEEN = require('@tweenjs/tween.js');

var box = document.createElement('div');
box.style.setProperty('background-color', '#008800');
box.style.setProperty('width', '100px');
box.style.setProperty('height', '100px');
document.body.appendChild(box);

// 设置循环动画
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);

var coords = {
  x: 0,
  y: 0
}; // 起始点 (0, 0)
var tween = new TWEEN.Tween(coords) // 创建一个新的tween用来改变 'coords'
  .to({
    x: 300,
    y: 200
  }, 1000) // 在1s内移动至 (300, 200)
  .easing(TWEEN.Easing.Quadratic.Out) // 使用缓动功能使的动画更加平滑
  .onUpdate(function () { // 在 tween.js 更新 'coords' 后调用
    // 将 'box' 移动到 'coords' 所描述的位置，配合 CSS 过渡
    box.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
  })
  .start(); // 立即开始 tween