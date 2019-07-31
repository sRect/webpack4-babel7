require('@/css/index.css');
// require("style-loader!css-loader!postcss-loader!less-loader!../node_modules/font-awesome/css/font-awesome.css");
import 'style-loader!css-loader!postcss-loader!less-loader!node_modules/font-awesome/css/font-awesome.css';
import modelShow from '@/js/modelShow';
import MyMarkup from '@/js/MyMarkup';
import Button from '@/js/createAndAddBtn';

window.onload = function() {
  modelShow(function(viewer) {
    console.log(viewer)
    if(viewer) {
      const myMarkup = new MyMarkup(viewer);
      const button = new Button(viewer);
      myMarkup.init();
      button.init();
    } else {
      throw new Error("模型初始化失败...")
    }
    
  });
}

// class IteratorTest {
//   constructor(arr) {
//     this.arr = arr || [];
//   }

//   createIterator() {
//     return new Promise((resolve, reject) => {
//       let iterator = this.arr[Symbol.iterator]();

//       if (iterator) {
//         resolve(iterator)
//       } else {
//         reject('ERROR');
//       }
      
//     })
//   }

//   async foo() {
//     let [error, iterator] = await this.createIterator().then(data => [null, data]).catch(error => [error, null]);

//     if (iterator) {
//       console.log(iterator.next());
//       console.log(iterator.next());
//       console.log(iterator.next());
//       console.log(iterator.next());
//     }
//   }
// }

// const iteratorTest = new IteratorTest([1,2,3]);
// iteratorTest.foo();

// // AOP
// function after(target, key, desc) {
//   console.log(target, key, desc)
//   const { value } = desc;
//   desc.value = function (...args) {
//     let res = value.apply(this, args);
//     console.log('加滤镜')
//     return res;
//   }
//   return desc;
// }

// class Test {
//   @after
//   takePhoto() {
//     console.log('拍照')
//   }
// }

// let t = new Test()
// t.takePhoto()