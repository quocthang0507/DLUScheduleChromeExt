$(function () {
  LoadSchoolYears();
  LoadSemesters();
})

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let month = currentDate.getMonth();

function LoadSchoolYears() {
  let year = currentYear - 4;
  for (let i = 1; i <= 5; i++, year++) {
    $('#cbxSchoolYear').append($('<option>', {
      value: `${year}-${year + 1}`,
      text: `${year}-${year + 1}`,
      selected: (month >= 9 && year == currentYear) ? true : (month < 9 ? (year + 1 == currentYear ? true : false) : false)
    }));
  }
}

function LoadSemesters() {
  
}