$(function () {
  LoadSchoolYears();
  LoadSemesters();
  LoadClasses();
  LoadWeeks();
  LoadLecturers();
})

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let month = currentDate.getMonth();
let selectedClassName = "current";

function HandleButtonClick(e) {
  let current = e.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== e.target) {
    current.classList.remove(selectedClassName);
  }
  e.target.classList.add(selectedClassName);
}

function AddClickEvent(){
  $('.groupBtn').find('button').click(function(){
    
  });
}

function LoadSchoolYears() {
  let year = currentYear - 4;
  for (let i = 1; i <= 5; i++, year++) {
    $('#cbxSchoolyear').append($('<option>', {
      value: `${year}-${year + 1}`,
      text: `${year}-${year + 1}`,
      selected: (month >= 9 && year == currentYear) ? true : (month < 9 ? (year + 1 == currentYear ? true : false) : false)
    }));
  }
}

function LoadSemesters() {
  if (month >= 9)
    $('#cbxSemester').val('HK01');
  else if (month >= 1 && month <= 7)
    $('#cbxSemester').val('HK02');
  else
    $('#cbxSemester').val('HK03');
}

function LoadClasses() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  $("#cbxClass").empty();
  chrome.storage.sync.get('Classes', function (json) {
    if (json && json.Classes && json.Classes.length > 0) {
      $.each(json.Classes, function (key, value) {
        $("#cbxClass").append($('<option>', {
          value: value.name,
          text: value.name
        }));
      });
      return;
    }
  });
  $.get("http://qlgd.dlu.edu.vn", function (data) {
    let temp = $($.parseHTML(data));
    let json = []
    temp.find('#ClassStudentID option').each(function () {
      $('#cbxClass').append($('<option>', {
        value: $(this).val(),
        text: $(this).val()
      }));
      json.push({ 'name': $(this).val() });
    });
    chrome.storage.sync.set({ 'Classes': json });
  });
  // $.getJSON("http://qlgd.dlu.edu.vn/Home/GetClassStudentByTerm/" + schoolyear + "$" + semester).done(function (data) {
  //   $("#cbxClass").empty();
  //   $.each(data, function (key, value) {
  //     $('#cbxClass').append($('<option>', {
  //       value: value.ClassStudentID,
  //       text: value.ClassStudentName
  //     }));
  //   });
  // });
}

function LoadWeeks() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  $.getJSON('http://qlgd.dlu.edu.vn/Public/GetWeek/' + schoolyear + "$" + semester).done(function (data) {
    $('#cbxWeek').empty();
    $.each(data, function (key, value) {
      $('#cbxWeek').append($('<option>', {
        value: value.Week,
        text: value.DisPlayWeek
      }));
    })
    $('#cbxWeek').val(data[0].WeekOfYear);
  });
}

function LoadLecturers() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  $.getJSON('http://qlgd.dlu.edu.vn/Public/GetProfessorByTerm/' + schoolyear + "$" + semester).done(function (data) {
    $('#cbxLecturer').empty();
    $.each(data, function (key, value) {
      $('#cbxLecturer').append($('<option>', {
        value: value.ProfessorID,
        text: value.ProfessorName
      }));
    })
  });
}