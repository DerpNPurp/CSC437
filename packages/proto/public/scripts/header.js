const header = document.querySelector('header');

header.innerHTML = `
  <h1><a href="/index.html">Game Database</a></h1>
  <label>
    <input type="checkbox" autocomplete="off" />
    Dark mode
  </label>
`;

const checkbox = header.querySelector('input');

// restore saved preference on page load
if (localStorage.getItem('darkMode') === 'on') {
  document.body.classList.add('dark-mode');
  checkbox.checked = true;
}

// relay the checkbox change event as a custom event on the body
header.querySelector('label').onchange = function(event) {
  event.stopPropagation();
  document.body.dispatchEvent(new CustomEvent('darkmode:toggle', {
    detail: { checked: event.target.checked }
  }));
};

document.body.addEventListener('darkmode:toggle', function(event) {
  if (event.detail.checked) {
    event.currentTarget.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'on');
  } else {
    event.currentTarget.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'off');
  }
});
