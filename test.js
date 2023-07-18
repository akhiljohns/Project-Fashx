// console.log("Statement 1");

// setTimeout(function() {
//   console.log("Statement 2");
// }, 2000);

// console.log("Statement 3");
// console.l

// const currentHour = new Date().getHours();
// const currentMinute = new Date().getMinutes();
// const currentSecond = new Date().getSeconds();

// console.log(currentHour, currentMinute, currentSecond); // Output: 9 13 49
// const currentDate = new Date();
// console.log(currentDate); // Output: Wed Jul 15 2023 09:13:49 GMT+0000 (Coordinated Universal Time)


const currentTime = Date.now();
console.log(currentTime); 
setTimeout(function() {
  const newTime = Date.now();
  
  let diff = (newTime - currentTime) / 1000; // Convert milliseconds to seconds
  
  console.log(diff);
}, 2000);
