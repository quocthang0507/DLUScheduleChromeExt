$(function () {
  LoadSchoolYears();
  LoadSemesters();
  LoadWeeks();
  LoadClasses();
  LoadLecturers();
  LoadDepartments();
  LoadRooms();
})

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let month = currentDate.getMonth();
let selectedClassName = "active";

btnClass.addEventListener('click', HandleButtonClick);
btnLecturer.addEventListener('click', HandleButtonClick);
btnRoom.addEventListener('click', HandleButtonClick);
btnDepartment.addEventListener('click', HandleButtonClick);

function HandleButtonClick(e) {
  let current = e.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== e.target) {
    current.classList.remove(selectedClassName);
    current.disabled = false;
  }

  switch (e.target.id) {
    case 'btnClass':
      $('.class').show();
      $('.lecturer').hide();
      $('.room').hide();
      $('.department').hide();
      break;
    case 'btnLecturer':
      $('.class').hide();
      $('.lecturer').show();
      $('.room').hide();
      $('.department').hide();
      break;
    case 'btnRoom':
      $('.class').hide();
      $('.lecturer').hide();
      $('.room').show();
      $('.department').hide();
      break;
    case 'btnDepartment':
      $('.class').hide();
      $('.lecturer').hide();
      $('.room').hide();
      $('.department').show();
      break;
    default:
      break;
  }

  e.target.classList.add(selectedClassName);
  e.target.disabled = true;
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
  let ok = GetAndLoadData('Classes', '#cbxClass');
  if (!ok)
    $.get("http://qlgd.dlu.edu.vn", function (html) {
      let dom = $($.parseHTML(html));
      let options = dom.find('#ClassStudentID option').get();
      let data = options.map(item => item.value);
      SaveAndLoadData(data, 'Classes', '#cbxClass');
    });
  // Lỗi cần phải xác thực trước khi gọi
  //
  // let schoolyear = $('#cbxSchoolyear').val();
  // let semester = $('#cbxSemester').val();
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
  let ok = GetAndLoadData('Weeks', '#cbxWeek', 'Week', 'DisPlayWeek');
  if (!ok)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetWeek/' + schoolyear + "$" + semester).done(function (data) {
      SaveAndLoadData(data, 'Weeks', '#cbxWeek', 'Week', 'DisPlayWeek');
      $('#cbxWeek').val(data[0].WeekOfYear);
    });
}

function LoadLecturers() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let ok = GetAndLoadData('Lecturers', '#cbxLecturer', 'ProfessorID', 'ProfessorName');
  if (!ok)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetProfessorByTerm/' + schoolyear + "$" + semester).done(function (data) {
      SaveAndLoadData(data, 'Lecturers', '#cbxLecturer', 'ProfessorID', 'ProfessorName');
    });
}

function LoadDepartments() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let ok = GetAndLoadData('Departments', '#cbxDepartment', 'FacultyID2', 'FacultyName');
  if (!ok)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetDepartmentIDByTerm/' + schoolyear + "$" + semester).done(function (data) {
      data.sort((a, b) => sort(a.FullName, b.FullName));
      SaveAndLoadData(data, 'Departments', '#cbxDepartment', 'FacultyID2', 'FacultyName');
    });
}

function LoadRooms() {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let ok = GetAndLoadData('Rooms', '#cbxRoom', 'RoomID', 'FullName');
  if (!ok)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetRoomIDByTerm/' + schoolyear + "$" + semester).done(function (data) {
      data.sort((a, b) => sort(a.FullName, b.FullName));
      SaveAndLoadData(data, 'Rooms', '#cbxRoom', 'RoomID', 'FullName');
    });
}

/**
 * Get data in local storage and populate it into select tag HTML
 * @param {String} keyStorage Distrinct key to identify
 * @param {String} idSelectTagHtml ID of select tag HTML
 * @param {String} itemValue Name of a field in data
 * @param {String} itemText Name of a field in data
 * @returns Check whether if a 'keyStorage' key existed in local storage
 */
function GetAndLoadData(keyStorage, idSelectTagHtml, itemValue, itemText) {
  let flag = false;
  chrome.storage.local.get(keyStorage, function (data) {
    flag = data && data[keyStorage] && data[keyStorage].length > 0;
    if (flag) {
      $(idSelectTagHtml).empty();
      $.each(data[keyStorage], function (index, value) {
        _val = itemValue ? value[itemValue] : value;
        _text = itemText ? value[itemText] : value;
        $(idSelectTagHtml).append($('<option>', {
          value: _val,
          text: _text
        }));
      });
    }
  });
  return flag;
}

/**
 * Populate data to select tag HTML and save them into local storage
 * @param {Array} data Array of object
 * @param {String} keyStorage Distrinct key to identify
 * @param {String} idSelectTagHtml ID of select tag HTML
 * @param {String} itemValue Name of a field in data
 * @param {String} itemText Name of a field in data
 */
function SaveAndLoadData(data, keyStorage, idSelectTagHtml, itemValue, itemText) {
  let json = [];
  $(idSelectTagHtml).empty();
  $.each(data, function (index, value) {
    _val = itemValue ? value[itemValue] : value;
    _text = itemText ? value[itemText] : value;
    $(idSelectTagHtml).append($('<option>', {
      value: _val,
      text: _text
    }));
    if (itemValue && itemText)
      json.push({ itemValue: _val, itemText: _text });
    else
      json.push(_val);
  });
  let content = {};
  content[keyStorage] = json;
  chrome.storage.local.set(content);
}

function sort(a, b) {
  if (a > b)
    return 1;
  else if (a < b)
    return -1;
  return 0;
}