fetch("/api/stat")
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const regionSelect = document.getElementById("region");
    const targetSelect = document.getElementById("main-target");
    const attackType = document.getElementById("attack-type");
    const nationality = document.getElementById("main-nationality");
    const mainWeapon = document.getElementById("main-weapon");

    regionSelect.innerHTML = "";
    targetSelect.innerHTML = "";
    attackType.innerHTML = "";
    nationality.innerHTML = "";
    mainWeapon.innerHTML = "";


    const regionOptions = doc.querySelectorAll("#region option");
    regionOptions.forEach((option) => {
      regionSelect.appendChild(option.cloneNode(true));
    });

    const targetOptions = doc.querySelectorAll("#main-target option");
    targetOptions.forEach((option) => {
      targetSelect.appendChild(option.cloneNode(true));
    });

    const attackOptions = doc.querySelectorAll("#attack-type option");
    attackOptions.forEach((option) => {
      attackType.appendChild(option.cloneNode(true));
    });

    const nationalityOptions = doc.querySelectorAll("#main-nationality option");
    nationalityOptions.forEach((option) => {
      nationality.appendChild(option.cloneNode(true));
    });

    const weaponOptions = doc.querySelectorAll("#main-weapon option");
    weaponOptions.forEach((option) => {
      mainWeapon.appendChild(option.cloneNode(true));
    });
  })
  .catch((error) => {
    console.error("Failed to fetch options:", error);
  });
