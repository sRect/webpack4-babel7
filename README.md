## 练习babel
> 参考文章
1. [Babel快速上手使用指南](https://juejin.im/post/5cf45f9f5188254032204df1?utm_source=gold_browser_extension#comment)
2. [babel 7 教程](https://blog.zfanw.com/babel-js/#babel-%E5%A5%97%E9%A4%90)
3. [Show me the code，babel 7 最佳实践！](https://juejin.im/post/5c03a4d0f265da615e053612#heading-5)
4. [Configure Babel](https://babeljs.io/docs/en/configuration)

使用
```bash
git clone
npm install
npm run start
// 或者直接通过babel编译 
npm run babel_build
```

.babelrc配置
```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false, // 模块使用 es modules ，不使用 commonJS 规范
      "useBuiltIns": "usage", // usage-按需引入 entry-入口引入（整体引入） false-不引入polyfill
      "corejs": 2,
      "targets": {
        "browsers": [
          "last 2 version",
          "> 0.5%",
          "IE 10",
          "not dead"
        ],
      }
    }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 2,
      "helpers": true,
      "regenerator": false,
      "useESModules": true // 使用 es modules helpers, 减少 commonJS 语法代码
    }]
  ]  
}
```

源代码
```javascript
class IteratorTest {
  constructor(arr) {
    this.arr = arr || [];
  }

  createIterator() {
    return new Promise((resolve, reject) => {
      let iterator = this.arr[Symbol.iterator]();

      if (iterator) {
        resolve(iterator)
      } else {
        reject('ERROR');
      }
      
    })
  }

  async foo() {
    let [error, iterator] = await this.createIterator().then(data => [null, data]).catch(error => [error, null]);

    if (iterator) {
      console.log(iterator.next());
      console.log(iterator.next());
      console.log(iterator.next());
      console.log(iterator.next());
    }
  }
}

const iteratorTest = new IteratorTest([1,2,3]);
iteratorTest.foo();
```

babel编译后的代码
```javascript
import _slicedToArray from "@babel/runtime-corejs2/helpers/esm/slicedToArray";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime-corejs2/helpers/esm/asyncToGenerator";
import _getIterator from "@babel/runtime-corejs2/core-js/get-iterator";
import _Promise from "@babel/runtime-corejs2/core-js/promise";
import _classCallCheck from "@babel/runtime-corejs2/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime-corejs2/helpers/esm/createClass";

var IteratorTest =
/*#__PURE__*/
function () {
  function IteratorTest(arr) {
    _classCallCheck(this, IteratorTest);

    this.arr = arr || [];
  }

  _createClass(IteratorTest, [{
    key: "createIterator",
    value: function createIterator() {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        var iterator = _getIterator(_this.arr);

        if (iterator) {
          resolve(iterator);
        } else {
          reject('ERROR');
        }
      });
    }
  }, {
    key: "foo",
    value: function () {
      var _foo = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _ref, _ref2, error, iterator;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.createIterator().then(function (data) {
                  return [null, data];
                }).catch(function (error) {
                  return [error, null];
                });

              case 2:
                _ref = _context.sent;
                _ref2 = _slicedToArray(_ref, 2);
                error = _ref2[0];
                iterator = _ref2[1];

                if (iterator) {
                  console.log(iterator.next());
                  console.log(iterator.next());
                  console.log(iterator.next());
                  console.log(iterator.next());
                }

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function foo() {
        return _foo.apply(this, arguments);
      }

      return foo;
    }()
  }]);

  return IteratorTest;
}();

var iteratorTest = new IteratorTest([1, 2, 3]);
iteratorTest.foo();
```