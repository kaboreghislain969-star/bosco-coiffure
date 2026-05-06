document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const toggleMode = document.querySelector('#toggleMode');
  const savedTheme = localStorage.getItem('bosco-theme');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  if (toggleMode) {
    toggleMode.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      localStorage.setItem('bosco-theme', isDark ? 'dark' : 'light');

      const icon = toggleMode.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
      }
    });
  }

  const contactForm = document.querySelector('#contact-form');
  const successMessage = document.querySelector('#success-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const actionUrl = contactForm.action;

      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) {
            contactForm.reset();
            if (successMessage) {
              successMessage.style.display = 'block';
              successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
              window.setTimeout(() => {
                successMessage.style.display = 'none';
              }, 6000);
            }
          } else {
            return response.json().then((data) => {
              throw new Error(data.error || 'Erreur lors de l’envoi.');
            });
          }
        })
        .catch((error) => {
          console.error(error);
          alert('Une erreur est survenue lors de l’envoi du formulaire. Veuillez réessayer plus tard.');
        });
    });
  }

  const qtyInputs = document.querySelectorAll('.qty-input');
  const grandTotalOutput = document.querySelector('#grand-total');

  if (qtyInputs.length && grandTotalOutput) {
    const updateTotals = () => {
      let grandTotal = 0;

      qtyInputs.forEach((input) => {
        const price = Number(input.dataset.price) || 0;
        const quantity = Math.max(0, Number(input.value) || 0);
        const lineTotal = price * quantity;
        const row = input.closest('tr');
        const lineTotalCell = row ? row.querySelector('.line-total') : null;

        if (lineTotalCell) {
          lineTotalCell.textContent = `${lineTotal.toLocaleString('fr-FR')} FCFA`;
        }

        grandTotal += lineTotal;
      });

      grandTotalOutput.textContent = `Total Général : ${grandTotal.toLocaleString('fr-FR')} FCFA`;
    };

    qtyInputs.forEach((input) => {
      input.addEventListener('input', updateTotals);
    });

    updateTotals();
  }

  const galleryImages = document.querySelectorAll('.gallery-images .img');
  if (galleryImages.length) {
    galleryImages.forEach((image) => {
      image.addEventListener('click', () => {
        image.classList.toggle('zoomed');
      });
    });
  }
});
