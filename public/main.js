/* globals fetch */
var update = document.getElementById('update')
var del = document.getElementById('delete')
const button = document.getElementById('submit');


  $('#dtBasicExample-table-id').mdbEditor({
    headerLength: 6,
    evenTextColor: '#000',
    oddTextColor: '#000',
    bgEvenColor: '',
    bgOddColor: '',
    thText: '',
    thBg: '',
    modalEditor: false,
    bubbleEditor: false,
    contentEditor: false,
    rowEditor: false
    }); 


    console.log('Client-side code running');


button.addEventListener('click', function(e) {
      console.log('button was clicked');
    });    

update.addEventListener('click', function () {
  fetch('digikey', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': '',
      'quote': ''
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
  })
})

del.addEventListener('click', function () {
  fetch('digikey', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': ''
    })
  }).then(function (response) {
    window.location.reload()
  })
})