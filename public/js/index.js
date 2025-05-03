const fileInput = document.getElementById('file-input');
const form = document.querySelector('.upload-form');

const modal = document.getElementById('folderModal');
const openBtn = document.querySelector('.open-modal-btn');
const closeBtn = document.querySelector('.close-btn');

const menus = document.querySelectorAll('.options-menu');

document.addEventListener('click', (e) => {
    const button = e.target.closest('.options-btn');
    if (button) {
        const id = button.getAttribute('data-id');
        const menu = document.getElementById(`menu-${id}`);

        menus.forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });

        menu.classList.toggle('hidden');
        return;
    }

    if (e.target.closest('.options-menu')) return;

    menus.forEach(menu => menu.classList.add('hidden'));

    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

if (fileInput && form) {
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            form.submit();
        }
    });
}

// Modal
if (openBtn) {
    openBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
}