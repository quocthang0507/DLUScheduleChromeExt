$(function () {
  loadComboboxes('All');
})

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let month = currentDate.getMonth();
let selectedClassName = "active";

$('#btnClass').click(handleButtonClick);
$('#btnLecturer').click(handleButtonClick);
$('#btnRoom').click(handleButtonClick);
$('#btnDepartment').click(handleButtonClick);
$('#cbxSchoolyear').change(loadComboboxes);
$('#cbxSemester').change(loadComboboxes);

$('#btnClass').click();

function loadComboboxes(e) {
  if (e === 'All') {
    loadSchoolYears();
    loadSemesters();
    loadWeeks('#cbxWeek', 'Week');
    loadWeeks('#cbxWeek2', 'Week2');
    loadClasses();
    loadLecturers();
    loadDepartments();
    loadRooms();
  }
  else if (e.target.id === 'cbxSchoolyear') {
    loadSemesters();
    loadWeeks('#cbxWeek', 'Week');
    loadWeeks('#cbxWeek2', 'Week2');
    loadClasses(true);
    loadLecturers(true);
    loadDepartments(true);
    loadRooms(true);
  }
  else if (e.target.id === 'cbxSemester') {
    loadWeeks('#cbxWeek', 'Week');
    loadWeeks('#cbxWeek2', 'Week2');
    loadClasses(true);
    loadLecturers(true);
    loadDepartments(true);
    loadRooms(true);
  }
}

function handleButtonClick(e) {
  let current = e.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== e.target) {
    current.classList.remove(selectedClassName);
    current.disabled = false;
  }
  $('#btnView').unbind();
  switch (e.target.id) {
    case 'btnClass':
      $('.class').show();
      $('.week').show();
      $('.lecturer').hide();
      $('.room').hide();
      $('.department').hide();
      $('.week2').hide();
      $('#btnView').click(function () {
        loadSchedule('Class');
      });
      break;
    case 'btnLecturer':
      $('.class').hide();
      $('.lecturer').show();
      $('.week').show();
      $('.room').hide();
      $('.department').hide();
      $('.week2').hide();
      $('#btnView').click(function () {
        loadSchedule('Lecturer');
      });
      break;
    case 'btnRoom':
      $('.class').hide();
      $('.lecturer').hide();
      $('.room').show();
      $('.week').show();
      $('.department').hide();
      $('.week2').hide();
      $('#btnView').click(function () {
        loadSchedule('Room');
      });
      break;
    case 'btnDepartment':
      $('.class').hide();
      $('.lecturer').hide();
      $('.room').hide();
      $('.week').hide();
      $('.department').show();
      $('.week2').show();
      $('#btnView').click(function () {
        loadSchedule('Department');
      });
      break;
    default:
      break;
  }

  e.target.classList.add(selectedClassName);
  e.target.disabled = true;
}

function loadSchoolYears() {
  let year = currentYear - 4;
  for (let i = 1; i <= 5; i++, year++) {
    $('#cbxSchoolyear').append($('<option>', {
      value: `${year}-${year + 1}`,
      text: `${year}-${year + 1}`,
      selected: (month >= 9 && year == currentYear) ? true : (month < 9 ? (year + 1 == currentYear ? true : false) : false)
    }));
  }
}

function loadSemesters() {
  if (month >= 9)
    $('#cbxSemester').val('HK01');
  else if (month >= 1 && month <= 7)
    $('#cbxSemester').val('HK02');
  else
    $('#cbxSemester').val('HK03');
}

function loadClasses(forceUpdate = false) {
  let result = false;
  if (!forceUpdate)
    result = getAndLoadData('Classes', '#cbxClass');
  else if (!result)
    $.get("http://qlgd.dlu.edu.vn", function (html) {
      let dom = $($.parseHTML(html));
      let options = dom.find('#ClassStudentID option').get();
      let data = options.map(item => item.value);
      saveAndLoadData(data, 'Classes', '#cbxClass');
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

function loadWeeks(idSelectTagHtml, itemValue) {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  $.getJSON('http://qlgd.dlu.edu.vn/Public/GetWeek/' + schoolyear + "$" + semester).done(function (data) {
    saveAndLoadData(data, 'Weeks', idSelectTagHtml, itemValue, 'DisPlayWeek');
    if (itemValue === 'Week')
      $('#cbxWeek').val(data[0].WeekOfYear);
    else
      $('#cbxWeek2').val(data[0].WeekOfYear2);
  });
}

function loadLecturers(forceUpdate = false) {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let result = false;
  if (!forceUpdate)
    result = getAndLoadData('Lecturers', '#cbxLecturer', 'ProfessorID', 'ProfessorName');
  else if (!result)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetProfessorByTerm/' + schoolyear + "$" + semester).done(function (data) {
      saveAndLoadData(data, 'Lecturers', '#cbxLecturer', 'ProfessorID', 'ProfessorName');
    });
}

function loadDepartments(forceUpdate = false) {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let result = false;
  if (!forceUpdate)
    result = getAndLoadData('Departments', '#cbxDepartment', 'FacultyID2', 'FacultyName');
  else if (!result)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetDepartmentIDByTerm/' + schoolyear + "$" + semester).done(function (data) {
      data.sort((a, b) => sort(a.FullName, b.FullName));
      saveAndLoadData(data, 'Departments', '#cbxDepartment', 'FacultyID2', 'FacultyName');
    });
}

function loadRooms(forceUpdate = false) {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let result = false;
  if (!forceUpdate)
    result = getAndLoadData('Rooms', '#cbxRoom', 'RoomID', 'FullName');
  else if (!result)
    $.getJSON('http://qlgd.dlu.edu.vn/Public/GetRoomIDByTerm/' + schoolyear + "$" + semester).done(function (data) {
      data.sort((a, b) => sort(a.FullName, b.FullName));
      saveAndLoadData(data, 'Rooms', '#cbxRoom', 'RoomID', 'FullName');
    });
}

/**
 * Show schedule
 * @param {String} typeSchedule 
 */
function loadSchedule(typeSchedule) {
  let schoolyear = $('#cbxSchoolyear').val();
  let semester = $('#cbxSemester').val();
  let week = $('#cbxWeek').val();
  let week2 = $('#cbxWeek2').val();
  let $class = $('#cbxClass').val();
  let lecturer = $('#cbxLecturer').val();
  let room = $('#cbxRoom').val();
  let department = $('#cbxDepartment').val();
  let url = '';
  switch (typeSchedule) {
    case 'Class':
      url = `http://qlgd.dlu.edu.vn/public/DrawingClassStudentSchedules_Mau2?YearStudy=${schoolyear}&TermID=${semester}&Week=${week}&ClassStudentID=${$class}&t=${Math.random()}`;
      break;
    case 'Lecturer':
      url = `http://qlgd.dlu.edu.vn/public/DrawingProfessorSchedule?YearStudy=${schoolyear}&TermID=${semester}&Week=${week}&ProfessorID=${lecturer}&t=${Math.random()}`;
      break;
    case 'Room':
      url = `http://qlgd.dlu.edu.vn/public/DrawingRoomSchedules?YearStudy=${schoolyear}&TermID=${semester}&Week=${week}&RoomID=${room}&t=${Math.random()}`;
      break;
    case 'Department':
      url = `http://qlgd.dlu.edu.vn/public/DrawingDepartmentSchedules_DangLuoi?YearStudy=${schoolyear}&TermID=${semester}&Week=${week2}&DepartmentID=${department}&t=${Math.random()}`;
      break;
    default:
      break;
  }
  $('#spinner').show();
  $.get(url, function (html) {
    $('#spinner').hide();
    $('#divSchedule').html(transformTable(html));
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
function getAndLoadData(keyStorage, idSelectTagHtml, itemValue, itemText) {
  let flag = true;
  chrome.storage.local.get(keyStorage, function (data) {
    if (data && data[keyStorage] && data[keyStorage].length > 0) {
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
    else
      flag = false;
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
function saveAndLoadData(data, keyStorage, idSelectTagHtml, itemValue, itemText) {
  let json = [];
  let item = {};
  $(idSelectTagHtml).empty();
  $.each(data, function (index, value) {
    _val = itemValue ? value[itemValue] : value;
    _text = itemText ? value[itemText] : value;
    $(idSelectTagHtml).append($('<option>', {
      value: _val,
      text: _text
    }));
    item = {};
    if (itemValue && itemText) {
      item[itemValue] = _val;
      item[itemText] = _text;
      json.push(item);
    }
    else
      json.push(_val);
  });
  item = {};
  item[keyStorage] = json;
  chrome.storage.local.set(item);
}

function sort(a, b) {
  if (a > b)
    return 1;
  else if (a < b)
    return -1;
  return 0;
}

function transformTable(htmlTable) {
  let dom = $(htmlTable);
  $('style', dom).remove();
  $('table', dom).removeAttr('style');
  $('table', dom).removeAttr('width');
  $('table', dom).removeAttr('border');
  $('table', dom).addClass('table table-bordered table-sm border-dark table-responsive')
  return dom;
}