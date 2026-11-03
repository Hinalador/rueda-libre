const bookingForm = document.querySelector("#booking-form");
const bikeTypes = bookingForm.querySelectorAll("input[name='tipos_bicicleta[]']");
const bikeTypeError = document.querySelector("#bike-types-error");
const bookingAlert = document.querySelector("#booking-alert");
const bookingModal = bootstrap.Modal.getOrCreateInstance(document.querySelector("#booking-modal"));
const rentalDate = bookingForm.querySelector("#fecha");
const today = new Date();
rentalDate.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);

function validateBikeTypes() {
    const hasSelection = Array.from(bikeTypes).some((bikeType) => bikeType.checked);
    bikeTypes[0].setCustomValidity(hasSelection ? "" : "Selecciona al menos un tipo de bicicleta.");
    const showError = bookingForm.classList.contains("was-validated") && !hasSelection;
    bikeTypeError.textContent = showError ? "Selecciona al menos un tipo de bicicleta." : "";
    bikeTypes[0].setAttribute("aria-invalid", String(showError));
}

function updateBookingSummary() {
    const selectedBikes = Array.from(bikeTypes)
        .filter((bikeType) => bikeType.checked)
        .map((bikeType) => bikeType.nextElementSibling.querySelector("strong").textContent.trim());
    const chosenDate = new Date(`${rentalDate.value}T12:00:00`);

    document.querySelector("#booking-summary-name").textContent = bookingForm.elements.nombre.value.trim();
    document.querySelector("#booking-summary-datetime").textContent =
        `${new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(chosenDate)}, ${bookingForm.elements.hora.value}`;
    document.querySelector("#booking-summary-duration").textContent =
        bookingForm.elements.duracion.selectedOptions[0].textContent;
    document.querySelector("#booking-summary-bikes").textContent = selectedBikes.join(", ");
    document.querySelector("#booking-summary-quantity").textContent = bookingForm.elements.cantidad.value;
}

function refreshValidation() {
    validateBikeTypes();
    if (bookingForm.classList.contains("was-validated") && !bookingForm.querySelector(":invalid")) {
        bookingAlert.classList.add("d-none");
    }
}

bikeTypes.forEach((bikeType) => bikeType.addEventListener("change", refreshValidation));
bookingForm.addEventListener("input", refreshValidation);
bookingForm.addEventListener("change", refreshValidation);
bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.classList.add("was-validated");
    validateBikeTypes();

    if (!bookingForm.checkValidity()) {
        bookingAlert.classList.remove("d-none");
        bookingForm.querySelector(":invalid")?.focus();
        return;
    }

    bookingAlert.classList.add("d-none");
    updateBookingSummary();
    bookingModal.show();
});

validateBikeTypes();