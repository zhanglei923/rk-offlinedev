

/////// es6 Start


var myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
for (var [key, value] of myMap) {
console.log('es6-map', key + " = " + value);
}
// 将会显示两个log。一个是"0 = zero"另一个是"1 = one"

for (var key of myMap.keys()) {
console.log('es6-map', key);
}
// 将会显示两个log。 一个是 "0" 另一个是 "1"

for (var value of myMap.values()) {
console.log('es6-map', value);
}
// 将会显示两个log。 一个是 "zero" 另一个是 "one"

for (var [key, value] of myMap.entries()) {
console.log('es6-map', key + " = " + value);
}
// 将会显示两个log。 一个是 "0 = zero" 另一个是 "1 = one"

const set1 = new Set([1, 2, 3, 4, 5]);

console.log('es6-Set', set1.has(1));
// expected output: true

console.log('es6-Set', set1.has(5));
// expected output: true

console.log('es6-Set', set1.has(6));
// expected output: false


let var1 = 1;
const var2 = 2;

let arrowfun1 = (a,)=>{
    console.log('es6-arrow function', a)
}
arrowfun1(1)

let tpl1 = `var1=${var1}, var2=${var2}`
console.log('es6-template', tpl1)


let json1 = {
    a:1,
    b:2
}
let json2 = {
    ...json1,
    c:3,
}
console.log('es6:', json2)

const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log('es6-for of:', element);
}

class Polygon {
    constructor(height, width) {
        this.area = height * width;
    }
}

console.log('es6-class:', new Polygon(4,3).area);


function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }
  
  async function asyncCall() {
    console.log('es6-async:', 'calling');
    var result = await resolveAfter2Seconds();
    console.log('es6-async:', result);
    // expected output: 'resolved'
  }
  
  asyncCall();
  
  var a = [];
  for (var i = 0; i < 10; i++) {
        a[i] = function () {console.log('es6-block', i);};
  }
  a[0]();                // 10
  a[1]();                // 10
  a[6]();                // 10
  
  /********************/
  
  var a = [];
  for (let i = 0; i < 10; i++) {
        a[i] = function () {console.log('es6-block', i);};
  }
  a[0]();                // 0
  a[1]();                // 1
  a[6]();                // 6


const number = 42;

try {
    number = 99;
} catch(err) {
    console.log('es6-const', err);
    // expected output: TypeError: invalid assignment to const `number'
    // Note - error messages will vary depending on browser
}

console.log('es6-const', number);
// expected output: 42



var asyncIterable = {
    [Symbol.asyncIterator]() {
      return {
        i: 0,
        next() {
          if (this.i < 3) {
            return Promise.resolve({ value: this.i++, done: false });
          }
  
          return Promise.resolve({ done: true });
        }
      };
    }
  };
  
  (async function() {
     for await (num of asyncIterable) {
       console.log('es6-for await', num);
     }
  })();
  

  function multiply(a, b = 1) {
    return a * b;
  }
  
  console.log('es6-default value', multiply(5, 2));
  // expected output: 10
  
  console.log('es6-default value', multiply(5));
  // expected output: 5


  function sum(...theArgs) {
    return theArgs.reduce((previous, current) => {
      return previous + current;
    });
  }
  
  console.log('es6-rest params', sum(1, 2, 3));
  // expected output: 6
  
  console.log('es6-rest params', sum(1, 2, 3, 4));
  // expected output: 10
  
  function f(...[a, b, c]) {
    console.log('es6-rest params2',  a + b + c);
  }
  
  f(1)          // NaN (b and c are undefined)
  f(1, 2, 3)    // 6
  f(1, 2, 3, 4) // 6 (the fourth parameter is not destructured)



  var obj = {
    log: ['a', 'b', 'c'],
    get latest() {
      if (this.log.length == 0) {
        return undefined;
      }
      return this.log[this.log.length - 1];
    }
  }
  
  console.log('es6-getter',  obj.latest);
  // expected output: "c"

  var language = {
    set current(name) {
      this.log.push(name);
    },
    log: []
  }
  
  language.current = 'EN';
  language.current = 'FA';
  
  console.log('es6-setter',  language.log);
  // expected output: Array ["EN", "FA"]


  class ClassWithStaticMethod {
    static staticMethod() {
      return 'static method has been called.';
    }
  }
  
  console.log('es6-static', ClassWithStaticMethod.staticMethod());
  // expected output: "static method has been called."
  
  


/////// es6 END;

