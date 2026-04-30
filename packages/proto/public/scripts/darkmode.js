const label = document.querySelector('header label');

// relay the checkbox change event as a custom event on the body
label.onchange = function(event) {
  event.stopPropagation();
  document.body.dispatchEvent(new CustomEvent('darkmode:toggle', {
    detail: { checked: event.target.checked }
  }));
};

document.body.addEventListener('darkmode:toggle', function(event) {
  if (event.detail.checked) {
    event.currentTarget.classList.add('dark-mode');
  } else {
    event.currentTarget.classList.remove('dark-mode');
  }
});
