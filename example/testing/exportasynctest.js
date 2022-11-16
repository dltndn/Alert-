exports.run = () => {
  
  async function f() {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("완료!"), 1000);
    });
  
    let promise2 = new Promise((resolve, reject) => {
      setTimeout(() => resolve("2초 후 완료!"), 2000);
    });
  
    let result = await promise; // 프라미스가 이행될 때까지 기다림 (*)
    let result2 = await promise2;
  
    console.log(result); // "완료!"
    console.log(result2);
  }
  
  async function run() {
    console.log("start");
    await f();
    console.log("end");
  }

  run();
  
}  

