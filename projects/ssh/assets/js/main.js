const header = document.querySelector('[data-header]');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelectorAll('.menu-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const nav = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });
});

document.querySelectorAll('[data-calculator]').forEach((calculator) => {
  const area = calculator.elements.area;
  const price = calculator.elements.price;
  const outputs = {
    area: calculator.querySelector('[data-area-output]'),
    price: calculator.querySelector('[data-price-output]'),
    saving: calculator.querySelector('[data-saving-output]'),
    standard: calculator.querySelector('[data-standard-output]'),
    ssh: calculator.querySelector('[data-ssh-output]'),
  };
  const number = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const updateCalculator = () => {
    const squareMetres = Number(area.value);
    const energyPrice = Number(price.value);
    const standardConsumption = squareMetres * 170;
    const sshConsumption = squareMetres * 62;
    const annualSaving = (standardConsumption - sshConsumption) * energyPrice;

    outputs.area.value = `${number.format(squareMetres)} m²`;
    outputs.price.value = `${decimal.format(energyPrice)} lei/kWh`;
    outputs.standard.textContent = number.format(standardConsumption);
    outputs.ssh.textContent = number.format(sshConsumption);
    outputs.saving.value = `${number.format(annualSaving)} lei`;
  };

  area.addEventListener('input', updateCalculator);
  price.addEventListener('input', updateCalculator);
  updateCalculator();
});
