async function handleContactInfoPage(
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  city?: string
) {
  const firstNameField = document.querySelector("#input-firstName");
  if (
    firstNameField instanceof HTMLInputElement &&
    firstNameField.value === ""
  ) {
    firstNameField.value = firstName;
    firstNameField.dispatchEvent(new Event("input", { bubbles: true })); // To trigger any bound event listeners
  }

  const lastNameField = document.querySelector("#input-lastName");
  if (lastNameField instanceof HTMLInputElement && lastNameField.value === "") {
    lastNameField.value = lastName;
    lastNameField.dispatchEvent(new Event("input", { bubbles: true })); // To trigger any bound event listeners
  }
}
