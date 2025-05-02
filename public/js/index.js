const fileInput = document.getElementById('file-input');
const form = document.querySelector('.upload-form');

const modal = document.getElementById('folderModal');
const openBtn = document.querySelector('.open-modal-btn');
const closeBtn = document.querySelector('.close-btn');

fileInput.addEventListener('change', function () {
    if (fileInput.files.length > 0) {
        form.submit();
    }
});

openBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});