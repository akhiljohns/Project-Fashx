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


// const currentTime = Date.now();
// console.log(currentTime); 
// setTimeout(function() {
//   const newTime = Date.now();
  
//   let diff = (newTime - currentTime) / 1000; // Convert milliseconds to seconds
  
//   console.log(diff);
// }, 2000);




// <script>
//   const searchInput = document.getElementById('searchInput');
//   const searchIcon = document.getElementById('searchIcon');
//   const submitBtn = document.getElementById('submitBtn');
//   const searchContainer = document.getElementById('searchContainer');

//   searchIcon.addEventListener('click', function() {
//     searchInput.style.display = searchInput.style.display === 'none' ? 'block' : 'none';
//     submitBtn.style.display = submitBtn.style.display === 'none' ? 'inline-block' : 'none';
//   });

//   submitBtn.addEventListener('click', function() {
//     const searchTerm = searchInput.value.trim().toLowerCase();
//     const cards = document.querySelectorAll('.card');

//     cards.forEach(function(card) {
//       const productName = card.querySelector('.card-title').textContent.toLowerCase();

//       if (productName.includes(searchTerm)) {
//         card.style.display = 'block';
//       } else {
//         card.style.display = 'none';
//       }
//     });
//   });
// </script>


// Sample document with delivery date
const order = {

  
  deliveryDate: new Date("2023-07-26T14:30:00.000Z"), 
};

// Maximum allowed days for return
const maxReturn̥Days = 5;

// Get the current date
const currentDate = new Date();
console.log(currentDate,"--=--=-lkahjdfklhjakldfn=-=-=-=-=-=-")

// Calculate the time difference in milliseconds
const timeDifferenceMs = currentDate - order.deliveryDate;

// Convert milliseconds to days
const daysElapsed = timeDifferenceMs / (1000 * 60 * 60 * 24);
console.log(daysElapsed,"--=--=-=-=-=-=-=-=-")
// Check if the return is within the allowed timeframe
if (daysElapsed <= maxReturnDays) {
  console.log("Return is allowed.");
} else {
  console.log("Return is not allowed as it is after 5 days of delivery.");
}
