// Class Dialog
class Dialog {
    /**
     * State of the Input Dialog OK (1)
     */
    static OK_OPTION = 1;
    /**
     * State of the Input Dialog CANCEL (0)
     */
    static CANCEL_OPTION = 0;

    /**
     * method of Dialog Class that allows user input
     * @param {innerText} textTitle Title of the dialog (only plain text)
     * @param {innerHTML} textMessage Message of the dialog for user input (allows element tags)
     * @returns data of dialog upon resolve().
     */
    static async confirmDialog(textTitle, textMessage) {
        // create elemeents
        const inputDialog = document.createElement("dialog");
        const title = document.createElement("h4");
        const message = document.createElement("div");
        const divButtons = document.createElement("div");
        const btnOk = document.createElement("button");
        const btnCancel = document.createElement("button");
        // add attributes
        inputDialog.setAttribute("id", "inputDialog");
        title.setAttribute("id", "title");
        message.setAttribute("id", "message");
        divButtons.setAttribute("id", "divButtons");
        btnOk.setAttribute("id", "btnOk");
        btnOk.innerText = "OK";
        btnCancel.setAttribute("id", "btnCancel");
        btnCancel.innerText = "Cancel";

        // append the elements
        divButtons.append(btnOk, btnCancel);
        inputDialog.append(title, message, divButtons);
        $("body").prepend(inputDialog);

        /**
         * dialogData       =   contains the data of the input dialog
         *
         * output           =   output of the dialog (input). null is default value
         * outputLength     =   length of the output
         * operation        =   operations of the buttons in dialog. 0 is default value
         *                      1 - OK
         *                      0 - CANCEL
         */
        const dialogData = {
            operation: 0,
        };

        return new Promise((resolve) => {
            if (!inputDialog.open) {
                // Display the modal with the message
                inputDialog.showModal();

                // show the message
                title.innerText = textTitle;
                message.innerHTML = textMessage;
                btnOk.addEventListener("click", () => {
                    // close the dialog
                    inputDialog.close();

                    // remove the element
                    $(inputDialog).remove();

                    dialogData.operation = 1;

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(dialogData);
                });

                btnCancel.addEventListener("click", () => {
                    // close the dialog
                    inputDialog.close();

                    // remove the element
                    $(inputDialog).remove();

                    // update the data of dialog
                    dialogData.operation = 0;

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(dialogData);
                });
            }
        });
    }

    /**
     * Method of Dialog Class that allows user to change password
     * @param {innerText} textTitle Title of the dialog (only plain text)
     * @param {innerHTML} textMessage Message of the dialog (allows element tags)
     * @returns {Promise} Promise that resolves with the dialog data including the new password if OK is clicked.
     */
    static async changePasswordDialog(textTitle, textMessage) {
        // Create elements
        const inputDialog = document.createElement("dialog");
        const title = document.createElement("h4");
        const message = document.createElement("div");
        const form = document.createElement("form");
        const newPasswordInput = document.createElement("input");
        const confirmPasswordInput = document.createElement("input");
        const divButtons = document.createElement("div");
        const btnSave = document.createElement("button");
        const btnCancel = document.createElement("button");
        const errorMessage = document.createElement("div");

        // Add attributes and text
        newPasswordInput.setAttribute("class", "form-control mb-3");
        confirmPasswordInput.setAttribute("class", "form-control");
        inputDialog.setAttribute("id", "inputDialog");
        title.setAttribute("id", "title");
        message.setAttribute("id", "message");
        divButtons.setAttribute("id", "divButtons");
        btnSave.setAttribute("id", "btnSave");
        btnSave.innerText = "Save";
        btnCancel.setAttribute("id", "btnCancel");
        btnCancel.innerText = "Cancel";

        newPasswordInput.setAttribute("type", "password");
        newPasswordInput.setAttribute("placeholder", "New Password");
        newPasswordInput.setAttribute("id", "newPassword");

        confirmPasswordInput.setAttribute("type", "password");
        confirmPasswordInput.setAttribute("placeholder", "Confirm Password");
        confirmPasswordInput.setAttribute("id", "confirmPassword");

        errorMessage.setAttribute("id", "errorMessage");
        errorMessage.style.color = "red";

        // Append elements
        form.append(newPasswordInput, confirmPasswordInput, errorMessage);
        divButtons.append(btnSave, btnCancel);
        inputDialog.append(title, message, form, divButtons);
        document.body.prepend(inputDialog);

        const dialogData = {
            operation: 0,
            newPassword: null,
        };

        return new Promise((resolve) => {
            // Display the modal with the message
            inputDialog.showModal();

            // Show the message
            title.innerText = textTitle;
            message.innerHTML = textMessage;

            btnSave.addEventListener("click", () => {
                const newPassword = newPasswordInput.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();

                if (newPassword === confirmPassword) {
                    // Close the dialog
                    inputDialog.close();
                    $(inputDialog).remove();

                    dialogData.operation = 1;
                    dialogData.newPassword = newPassword;

                    // Resolve the promise to indicate that the modal has been closed
                    resolve(dialogData);
                } else {
                    // Show error message

                    errorMessage.innerHTML = `<div class="alert alert-danger" role="alert">
                    Passwords do not match. Please try again.
                    </div>`;
                }
            });

            btnCancel.addEventListener("click", () => {
                // Close the dialog
                inputDialog.close();
                $(inputDialog).remove();

                // Resolve the promise to indicate that the modal has been closed
                resolve(dialogData);
            });

            newPasswordInput.addEventListener("input", validatePasswords);
            confirmPasswordInput.addEventListener("input", validatePasswords);

            function validatePasswords() {
                const newPassword = newPasswordInput.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();

                // Regular expression to check if the password contains both letters and numbers
                const hasLettersAndNumbers =
                    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

                if (
                    newPassword !== confirmPassword &&
                    confirmPassword.length > 0
                ) {
                    errorMessage.innerText = "Passwords do not match.";
                } else if (!hasLettersAndNumbers.test(newPassword)) {
                    errorMessage.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        "Password must be at least 8 characters <br>and include both letters and numbers.";
                    </div>
                `;
                } else {
                    errorMessage.innerHTML = "";
                }
            }
        });
    }

    static async showCropModal(
        cropImg,
        description,
        cropTitle,
        varietyDetails
    ) {
        // Create modal
        const modal = document.createElement("dialog");
        modal.setAttribute("id", "messageDialog");
        modal.style.width = "700px"; // Adjust as needed
        modal.style.padding = "20px";
        modal.style.textAlign = "center";
        modal.style.borderRadius = "0.5rem"; // Rounded corners

        // Sort varietyDetails by totalAreaPlanted
        varietyDetails.sort((a, b) => b.totalAreaPlanted - a.totalAreaPlanted);

        // Create innerHTML for modal content
        modal.innerHTML = `
        <div class="container-fluid">
            <ul class="nav nav-tabs d-flex justify-content-around w-100" style="border-bottom: 2px solid #007bff;">
                <li class="nav-item w-50">
                    <a class="nav-link active bg-white text-center w-100" id="cropInfoTab" href="#" style="font-weight: bold; color: #28a745;">Crop Information</a>
                </li>
                <li class="nav-item w-50">
                    <a class="nav-link bg-white text-center w-100" id="varietyTab" href="#" style="font-weight: bold; color: #6c757d;">Variety</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active bg-transparent" id="cropInfoContent" style="text-align: justify; font-size: 0.9rem; margin-top: 15px;">
                    <div class="text-center">
                        <div style="background-color: #C9AF94; color: white; padding: 10px; border-radius: 8px; font-weight: bold; font-size: 1.5rem; margin-bottom: 15px;">
                            ${cropTitle}
                        </div>
                        <img id="cropImg" src="${cropImg}" alt="Crop Image" class="img-fluid border border-primary rounded" style="width: 30rem; height: auto; margin-bottom: 10px;">
                    </div>
    
                    <div class="text-dark mt-2">${description}</div>
                </div>
                <div class="tab-pane fade bg-transparent" id="varietyContent" style="text-align: justify; font-size: 0.9rem; color: #333;">
                    <div class="accordion" id="varietyAccordion">
                        ${varietyDetails
                            .map(
                                (variety, index) => `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${index}">
                                <button class="bg-success accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                    ${variety.varietyName} (Total Area Planted: ${variety.totalAreaPlanted})
                                </button>
                            </h2>
                            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#varietyAccordion">
                                <div class="accordion-body">
                                    <img src="${variety.cropImg}" alt="${variety.varietyName} Image" class="img-fluid border border-primary rounded" style="width: 20rem; height: auto; margin-bottom: 10px;">
                                    <p><strong>Characteristics:</strong></p>
                                    <p><strong>Color:</strong> ${variety.color}</p>
                                    <p><strong>Size:</strong> ${variety.size}</p>
                                    <p><strong>Flavor:</strong> ${variety.flavor}</p>
                                    <p><strong>Growth Conditions:</strong> ${variety.growthConditions}</p>
                                    <p><strong>Pest/Disease Resistance:</strong> ${variety.pestDiseaseResistance}</p>
                                    <p><strong>Recommended Practices:</strong> ${variety.recommendedPractices}</p>
                                </div>
                            </div>
                        </div>
                        `
                            )
                            .join("")}
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
                <button id="btnClose" class="btn btn-danger" style="font-weight: bold;">Close</button>
            </div>
        </div>
        `;

        // Append modal to document body
        document.body.append(modal);

        // Create dialogData object
        const dialogData = {
            operation: 0, // Default operation
        };

        return new Promise((resolve) => {
            if (!modal.open) {
                // Display the modal
                modal.showModal();

                // Tab click event
                const cropInfoContent = modal.querySelector("#cropInfoContent");
                const varietyContent = modal.querySelector("#varietyContent");

                modal
                    .querySelector(".nav-tabs")
                    .addEventListener("click", (event) => {
                        const target = event.target;
                        if (target.id === "cropInfoTab") {
                            cropInfoContent.classList.add("show", "active");
                            varietyContent.classList.remove("show", "active");
                            target.style.color = "#28a745"; // Active tab color
                            modal.querySelector("#varietyTab").style.color =
                                "#6c757d"; // Inactive tab color
                        } else if (target.id === "varietyTab") {
                            varietyContent.classList.add("show", "active");
                            cropInfoContent.classList.remove("show", "active");
                            target.style.color = "#28a745"; // Active tab color
                            modal.querySelector("#cropInfoTab").style.color =
                                "#6c757d"; // Inactive tab color
                        }
                    });

                modal
                    .querySelector("#btnClose")
                    .addEventListener("click", () => {
                        // Close the modal
                        modal.close();
                        // Remove the modal from the DOM
                        modal.remove();
                        // Update dialogData to indicate close operation
                        dialogData.operation = 1;
                        // Resolve the promise with dialogData
                        resolve(dialogData);
                    });
            }
        });
    }

    static async downloadDialog() {
        // Create elements
        const inputDialog = document.createElement("dialog");
        const modalContent = document.createElement("div");
        const title = document.createElement("h5");
        const divButtons = document.createElement("div");
        const btnCSV = document.createElement("button");
        const btnExcel = document.createElement("button");
        const btnPDF = document.createElement("button");
        const closeButton = document.createElement("button");

        // Set attributes and text
        inputDialog.setAttribute("id", "downloadModal");
        inputDialog.setAttribute("role", "dialog");
        inputDialog.setAttribute("aria-labelledby", "downloadModalLabel");
        inputDialog.style.padding = "20px";
        inputDialog.style.borderRadius = "8px";
        inputDialog.style.maxWidth = "400px";
        inputDialog.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";

        // Modal header
        title.className = "modal-title text-center mb-4";
        title.id = "downloadModalLabel";
        title.innerText = "Download Options";

        // Close button
        closeButton.type = "button";
        closeButton.innerText = "Close";
        closeButton.className = "dialog-close btn btn-secondary";
        closeButton.style.width = "100%";
        closeButton.addEventListener("click", () => {
            inputDialog.close();
        });

        // Modal buttons with Font Awesome icons
        btnCSV.className = "btn btn-primary mb-3";
        btnCSV.innerHTML = '<i class="fas fa-file-csv"></i> Download CSV';
        btnCSV.setAttribute("data-format", "csv");
        btnCSV.style.width = "100%";

        btnExcel.className = "btn btn-success mb-3";
        btnExcel.innerHTML = '<i class="fas fa-file-excel"></i> Download Excel';
        btnExcel.setAttribute("data-format", "xlsx");
        btnExcel.style.width = "100%";

        btnPDF.className = "btn btn-danger mb-3";
        btnPDF.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF';
        btnPDF.setAttribute("data-format", "pdf");
        btnPDF.style.width = "100%";

        // Add event listeners for buttons
        let resolvePromise;
        const formatPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        [btnCSV, btnExcel, btnPDF].forEach((button) => {
            button.addEventListener("click", (event) => {
                const format = event.currentTarget.getAttribute("data-format");
                if (resolvePromise) {
                    resolvePromise(format); // Resolve the promise with the selected format
                }
                inputDialog.close(); // Close the dialog after selection
            });
        });

        // Style and structure modal body
        divButtons.className = "d-grid gap-3"; // Bootstrap's grid gap class for spacing
        divButtons.append(btnCSV, btnExcel, btnPDF, closeButton);

        // Assemble modal content
        modalContent.className = "text-center";
        modalContent.append(title, divButtons);

        inputDialog.appendChild(modalContent);
        document.body.appendChild(inputDialog);

        // Show the dialog
        inputDialog.showModal();

        // Return the promise that resolves with the selected format
        return formatPromise;
    }

    static async showInfoModal(htmlScript) {
        // Create elements
        const modal = document.createElement("dialog");
        const container = document.createElement("div");
        const btnClose = document.createElement("button");
        const btnWrapper = document.createElement("div"); // Wrapper for the button

        // Add attributes
        modal.setAttribute("id", "messageDialog");
        btnClose.setAttribute("id", "btnClose");
        btnClose.innerText = "Close";

        // Style the modal
        modal.style.maxWidth = "1000px"; // Adjust as needed
        modal.style.padding = "20px";
        modal.style.fontSize = "1em";
        modal.style.textAlign = "justify";
        modal.style.margin = "20px"; // Margin around the modal

        // Style the container
        container.style.display = "flex";
        container.style.flexDirection = "column"; // Stack content and button
        container.style.alignItems = "center"; // Center items horizontally
        container.style.gap = "20px"; // Space between content and button
        container.style.margin = "20px"; // Margin around the content

        // Render the HTML script inside the container
        container.innerHTML = htmlScript;

        // Style the button wrapper
        btnWrapper.style.display = "flex";
        btnWrapper.style.justifyContent = "flex-end"; // Align items to the right

        // Append content and button
        btnWrapper.append(btnClose);
        container.append(btnWrapper);
        modal.append(container);
        document.body.append(modal);

        // Create dialogData object
        const dialogData = {
            operation: 0, // Default operation
        };

        return new Promise((resolve) => {
            if (!modal.open) {
                // Display the modal
                modal.showModal();

                btnClose.addEventListener("click", () => {
                    // Close the modal
                    modal.close();

                    // Remove the element
                    modal.remove();

                    // Update dialogData to indicate close operation
                    dialogData.operation = 1;

                    // Resolve the promise with dialogData
                    resolve(dialogData);
                });
            }
        });
    }

    /**
     * method of Dialog Class that shows information message
     * @param {string} textTitle Title of the dialog (only plain text)
     * @param {html} textMessage Message of the dialog for user to see (allows element tags)
     * @returns nothing, it is only for displaying messages
     */
    static async showMessageDialog(textTitle, textMessage) {
        // create the elements
        const messageDialog = document.createElement("dialog");
        const title = document.createElement("h4");
        const message = document.createElement("div");
        const btnOk = document.createElement("button");
        // add aatributes
        messageDialog.setAttribute("id", "messageDialog");
        title.setAttribute("id", "title");
        message.setAttribute("id", "message");
        btnOk.setAttribute("id", "btnOk");
        btnOk.innerText = "OK";

        // append the elements
        messageDialog.append(title, message, btnOk);
        $("body").prepend(messageDialog);

        return new Promise((resolve) => {
            if (!messageDialog.open) {
                // Display the modal with the message
                messageDialog.showModal();

                // show the message
                title.innerText = textTitle;
                message.innerHTML = textMessage;

                // focus on the button
                btnOk.focus();

                function handleOnKeyDownMessageDialog(event) {
                    if (
                        event.key === "Enter" &&
                        document.activeElement === btnOk
                    ) {
                        event.preventDefault();
                        btnOk.dispatchEvent(new Event("click"));
                    }
                }

                // add keydown listener
                document.addEventListener(
                    "keydown",
                    handleOnKeyDownMessageDialog
                );

                // Listen for the close event of the modal
                btnOk.addEventListener("click", () => {
                    // Close the modal
                    messageDialog.close();

                    // remove the element
                    $(messageDialog).remove();

                    // remove keydown listener
                    document.removeEventListener(
                        "keydown",
                        handleOnKeyDownMessageDialog
                    );

                    // Resolve the promise to indicate that the modal has been closed
                    resolve();
                });
            }
        });
    }
}

export default Dialog;

// modal for download, concern, info
