document.addEventListener("DOMContentLoaded", function () {
    // Use buttons to toggle between views
    document.querySelector("#inbox").addEventListener("click", () => load_mailbox("inbox"));
    document.querySelector("#sent").addEventListener("click", () => load_mailbox("sent"));
    document.querySelector("#archived").addEventListener("click", () => load_mailbox("archive"));
    document.querySelector("#compose").addEventListener("click", compose_email);
    document.querySelector("#compose-form").addEventListener("submit", handleFormSubmission);

    // By default, load the inbox
    load_mailbox("inbox");
});

function compose_email() {
    // Show compose view and hide other viewst
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    // Clear out composition fields
    document.querySelector("#compose-recipients").value = "";
    document.querySelector("#compose-subject").value = "";
    document.querySelector("#compose-body").value = "";
}

function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#compose-view").style.display = "none";
    // Show the mailbox name
    document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        document.querySelector("#emails-view").innerHTML += "";
        const emailContainer = document.createElement("div");

        if (emails.length === 0) {
            emailContainer.innerHTML = `<p class="text-muted">No emails in this mailbox.</p>`;
        } else {
            emails.forEach(email => {
                const emailElement = document.createElement("div");
                emailElement.classList.add("card", "mb-2", "p-3", "border-secondary");
                emailElement.innerHTML = `
                    <div class="row align-items-center justify-content-center">

                        <div class="col-3 text-center">
                            <strong>${email.sender}</strong>
                        </div>

                        <div class="col-6 text-center">
                            <strong class="me-2">${email.subject} -</strong>
                            <span class="text-muted">${email.body.slice(0, 80)}...</span>
                        </div>

                        <div class="col-3 text-center text-muted">
                            ${email.timestamp}
                        </div>
                    </div>
                `;
                emailElement.addEventListener("click", () => load_email(email.id));
                emailContainer.appendChild(emailElement);
            })
        }
        document.querySelector("#emails-view").appendChild(emailContainer);
    })
}

function handleFormSubmission(event) {
    event.preventDefault();

    const recipients = document.querySelector("#compose-recipients").value;
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector("#compose-body").value;
    const messageElement = document.querySelector("#message");

    fetch("/emails", {
        method: "POST",
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body,
        }),
    })
    .then((response) => response.json())
    .then((result) => {

        messageElement.textContent = "";

        if (result.error) {
            messageElement.textContent = `Error: ${result.error}`;
            messageElement.style.color = "red";
        } else {
            messageElement.textContent = "Email sent successfully!";
            messageElement.style.color = "green";
            load_mailbox("sent");
        }
    })
    .catch((error) => {
        messageElement.textContent = "An unexpected error occurred";
        messageElement.style.color = "red";
        console.error(error);
    });
}
