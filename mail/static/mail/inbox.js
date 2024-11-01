document.addEventListener("DOMContentLoaded", function () {
    // Use buttons to toggle between views
    document.querySelector("#inbox").addEventListener("click", () => loadMailbox("inbox"));
    document.querySelector("#sent").addEventListener("click", () => loadMailbox("sent"));
    document.querySelector("#archived").addEventListener("click", () => loadMailbox("archive"));
    document.querySelector("#compose").addEventListener("click", composeEmail);
    document.querySelector("#compose-form").addEventListener("submit", handleFormSubmission);

    // By default, load the inbox
    loadMailbox("inbox");
});

function composeEmail() {
    // Show compose view and hide other viewst
    document.querySelector("#email-detail").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    // Clear out composition fields
    document.querySelector("#compose-recipients").value = "";
    document.querySelector("#compose-subject").value = "";
    document.querySelector("#compose-body").value = "";
}

function loadMailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#email-detail").style.display = "none";
    // Show the mailbox name
    document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        document.querySelector("#emails-view").innerHTML += "";
        const emailContainer = document.createElement("div");

        if (emails.length === 0) {
            emailContainer.innerHTML = `<p class="text-muted">No emails in this mailbox.</p>`;
        } else {
            emails.forEach(email => {
                const emailElement = document.createElement("div");
                emailElement.classList.add("card", "mb-2", "p-3", "border-secondary", "email-item");

                if (mailbox === "inbox" || mailbox === "archive") {
                    emailElement.style.backgroundColor = email.read ? "#f1f1f1" : "#ffffff";
                }
                
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
                emailElement.addEventListener("click", () => {
                    loadEmail(email.id);
                    changeReadStatus(email.id, true);
                });
                emailContainer.appendChild(emailElement);
            })
        }
        document.querySelector("#emails-view").appendChild(emailContainer);
    })
}

function loadEmail(emailId) {
    fetch(`/emails/${emailId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch email");
        }
        return response.json();
    })
    .then(email => {
        changeReadStatus(emailId, true);

        const emailDetail = document.querySelector("#email-detail");
        emailDetail.innerHTML = `
            <h3>${email.subject}</h3>
            <p><strong>From:</strong> ${email.sender}</p>
            <p><strong>To:</strong> ${email.recipients}</p>
            <p><strong>Timestamp:</strong> ${email.timestamp}</p>
            <hr>
            <p>${email.body}</p>
        `;

        const replyButton = document.createElement("button");
        replyButton.className = "btn btn-primary mr-3";
        replyButton.innerText = "Reply";
        replyButton.addEventListener("click", () => replyEmail(email));
        emailDetail.appendChild(replyButton);
        
        const archiveButton = document.createElement("button");
        archiveButton.className = email.archived ? "btn btn-primary" : "btn btn-danger";
        archiveButton.innerText = email.archived ? "Unarchive" : "Archive";

        archiveButton.addEventListener("click", () => {
            changeArchivedStatus(email.id, !email.archived);
        });
        emailDetail.appendChild(archiveButton);

        document.querySelector("#emails-view").style.display = "none";
        document.querySelector("#compose-view").style.display = "none";
        emailDetail.style.display = "block";
    })
    .catch(error => {
        console.error("Error:", error);
    })
}

function changeReadStatus(emailId, isRead) {
    fetch(`/emails/${emailId}`, {
        method: "PUT",
        body: JSON.stringify({ 
            read: isRead
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update email read status");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function changeArchivedStatus(emailId, isArchived) {
    fetch(`/emails/${emailId}`, {
        method: "PUT",
        body: JSON.stringify({ 
            archived: isArchived
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update email archived status");
        }
        loadMailbox("inbox");
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function handleFormSubmission(event) {
    event.preventDefault();

    const recipients = document.querySelector("#compose-recipients").value;
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector("#compose-body").value;
    const messageElement = document.querySelector("#message");

    if (subject.trim() === "") {
        messageElement.textContent = "Error: Subject cannot be empty.";
        messageElement.style.color = "red";

        messageElement.classList.add("fade-out");
        setTimeout(() => {
            messageElement.classList.add("hidden");
            setTimeout(() => {
                messageElement.textContent = "";
                messageElement.classList.remove("fade-out", "hidden");
            }, 500);
        }, 3000);

        return;
    }

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
            loadMailbox("sent");
        }

        messageElement.classList.add("fade-out");
            setTimeout(() => {
                messageElement.classList.add("hidden");
                setTimeout(() => {
                    messageElement.textContent = "";
                    messageElement.classList.remove("fade-out", "hidden");
                }, 500);
            }, 3000);
    })
    .catch((error) => {
        messageElement.textContent = "An unexpected error occurred";
        messageElement.style.color = "red";

        messageElement.classList.add("fade-out");
            setTimeout(() => {
                messageElement.classList.add("hidden");
                setTimeout(() => {
                    messageElement.textContent = "";
                    messageElement.classList.remove("fade-out", "hidden");
                }, 500);
            }, 3000);

        console.error(error);
    });
}

function replyEmail(originalEmail) {
    document.querySelector("#email-detail").style.display = "none";
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    document.querySelector("#compose-recipients").value = originalEmail.sender;
    const originalSubject = originalEmail.subject;
    const subjectPrefix = "Re: ";
    
    if (!originalSubject.startsWith(subjectPrefix)) {
      document.querySelector("#compose-subject").value = subjectPrefix + originalSubject;
    } else {
      document.querySelector("#compose-subject").value = originalSubject;
    }

    document.querySelector("#compose-body").value = `\n\nOn ${originalEmail.timestamp}, ${originalEmail.sender} wrote:\n${originalEmail.body}\n\n`;
}
