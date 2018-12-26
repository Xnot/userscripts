// ==UserScript==
// @name         MangaDex Mass Cover Uploader
// @namespace    https://github.com/LucasPratas/userscripts
// @version      0.20
// @icon         https://mangadex.org/favicon.ico
// @description  imagine if someone tried uploading conan covers without this
// @author       Xnot
// @updateURL    https://github.com/LucasPratas/userscripts/raw/master/mangadex-masscoveruploader.user.js
// @downloadURL  https://github.com/LucasPratas/userscripts/raw/master/mangadex-masscoveruploader.user.js
// @include      /.*mangadex\.org/title/.*/covers/
// @grant        none
// ==/UserScript==

function createForm()
{
    const userscriptInfo = document.createElement("div"); //info panel with userscript instructions
    userscriptInfo.classList.add("alert", "alert-info");
    userscriptInfo.setAttribute("role", "alert");
    userscriptInfo.innerHTML = "<h6>You are using MangaDex Mass Cover Uploader by Xnot</h6>" +
       "<ol><li>Insert volume numbers, into its respective field. Each line is one volume" +
        "<br />Alternatively, inputting a single numerical volume will increment it by 1 for each upload" +
        "<br />If you want a cover to have an empty volume for some reason leave an empty line in the appropiate spot" +
        "<li>Click browse and use shift/ctrl to select all files, " +
        "<br />If you hover over the browse button you can check if the files are in the expected order" +
        "<li>Click the Save button</ol>" +
    "If there are any problems @ or pm me on Discord";
    // "Update 1.91:" +
    //     "<ul><li>Language now doesn't reset on completion" +
    //     "<li><strike>Now works with Greasemonkey</strike> Adding Greasemonkey compatibility breaks random things unpredictably so fuck Greasemonkey</ul>" +
    // "Update 1.94:" +
    //     "<ul><li>If you enter a new line after the first group or if there's already more than one group, selecting another group from the dropdown will add it instead of replacing what's already there</ul>";
    const container = document.getElementById("manga_cover_upload_modal").getElementsByClassName("modal-content")[0];
    container.insertBefore(userscriptInfo, container.getElementsByClassName("modal-header")[0]); //insert info panel

    document.getElementById("message_container").classList.replace("display-none", "display-block");

    //create header
    const massCoverUploadHeader = document.createElement("div");
    massCoverUploadHeader.classList.add("modal-header");
    massCoverUploadHeader.innerHTML = '<h5 class="modal-title" id="manga_mass_cover_upload_label">' +
                                        '<span class="fas fa-image fa-fw " aria-hidden="true"></span>' +
                                        'Mass upload volume covers' +
                                    '</h5>';
    container.insertBefore(massCoverUploadHeader, container.getElementsByClassName("modal-header")[0]); //insert header

    //create body
    const massCoverUploadBody = document.createElement("div");
    massCoverUploadBody.classList.add("modal-body");
    massCoverUploadBody.innerHTML = '<form id="manga_mass_cover_upload_form">' +
                                    '<div class="form-group row">' +
                                        '<label for="volumes" class="col-lg-3 col-form-label-modal">' +
                                            'Volumes:' +
                                        '</label>' +
                                        '<div class="col-lg-9">' +
                                            '<textarea class="form-control" id="volumes" name="volumes" placeholder="1\n2\n3\n4" required="" style="height: 100px"></textarea>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="form-group row">' +
                                        '<label for="files" class="col-lg-3 col-form-label-modal">' +
                                            'Covers:' +
                                        '</label>' +
                                        '<div class="col-lg-9">' +
                                            '<div class="input-group">' +
                                                '<input type="text" class="form-control fileText" placeholder="Recommended resolution: ~1000px width. Max filesize: 2 MB." readonly="" name="old_files">' +
                                                '<span class="input-group-append">' +
                                                    '<span class="btn btn-secondary btn-file">' +
                                                        '<span class="far fa-folder-open fa-fw " aria-hidden="true"></span>' +
                                                        '<span>Browse</span>' +
                                                        '<input type="file" name="files" id="files" accept=".jpg,.jpeg,.png,.gif" multiple>' +
                                                    '</span>' +
                                                '</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="text-center">' +
                                        '<button class="btn btn-secondary" id="mass_upload_cover_button">' +
                                            '<span class="fas fa-save fa-fw " aria-hidden="true"></span>' +
                                            'Save' +
                                        '</button>' +
                                    '</div>' +
                                '</form>';
    container.insertBefore(massCoverUploadBody, container.getElementsByClassName("modal-header")[1]); //insert header
    document.getElementById("files").addEventListener("change", function()
                                                                {
                                                                    if(this.files.length == 1)
                                                                    {
                                                                        container.getElementsByClassName("fileText")[0].value = this.files.length + " file selected";
                                                                    }
                                                                    else
                                                                    {
                                                                        container.getElementsByClassName("fileText")[0].value = this.files.length + " files selected";
                                                                    }
                                                                });
    document.getElementById("mass_upload_cover_button").addEventListener("click", function(event)
                                                                                {
                                                                                    event.preventDefault();
                                                                                    massCoverUpload(document.getElementById("volumes").value, document.getElementById("files").files);
                                                                                });
}

function massCoverUpload(volumes, files)
{
    volumes = volumes.split("\n");

    if((files.length == volumes.length || (volumes.length == 1 && !isNaN(parseFloat(volumes[0])))) && files.length > 0)
    {
        uploadNext(volumes, files, 0);
    }
    else
    {
        document.getElementById("message_container").innerHTML = "<div class='alert alert-danger text-center' style='pointer-events: auto;' role='alert'><a href='#' class='float-right fas fa-window-close' data-dismiss='alert'></a><strong>Error:</strong> The amount of files does not match the amount volumes or you're using sequential upload with a non-number. See instructions and try again.</div>.";
        console.log(volumes + " | " + files);
    }
}

function uploadNext(volumes, files, i)
{
    const messageContainer = document.getElementById("message_container");
    const mangaId = (/\/(\d+)/g).exec(window.location.href)[1];

    const formData = new FormData(); //create new form data
    if(volumes.length == 1) //sequential volume upload
    {
        formData.append("volume", parseFloat(volumes[0]) + i);
    }
    else //listed volume upload
    {
        formData.append("volume", volumes[i]);
    }
    formData.append("old_file", files[i].name);
    formData.append("file", files[i]);

    //fill in bottom form so uploader can see what's being uploaded
    if(volumes.length == 1)
    {
        if(isNaN(parseFloat(volumes[0])))
        {
            document.getElementById("volume").value = volumes[0];
        }
        else
        {
            document.getElementById("volume").value = parseFloat(volumes[0]) + i;
        }
    }
    else
    {
        document.getElementById("volume").value = volumes[i];
    }
    document.getElementsByClassName("modal-body")[2].getElementsByClassName("form-control")[1].value = files[i].name;

    const j = i+1; //for printing purposes only
    const success_msg = "<div class='alert alert-success text-center' style='pointer-events: auto;' role='alert'><a href='#' class='float-right fas fa-window-close' data-dismiss='alert'></a><strong>Success:</strong> " + j + "/" + files.length + " covers have been uploaded.</div>";
    const error_msg = "<div class='alert alert-warning text-center' style='pointer-events: auto;' role='alert'><a href='#' class='float-right fas fa-window-close' data-dismiss='alert'></a><strong>Warning:</strong> Something went wrong with your upload at " + j + "/" + files.length + " files. All previous files have been uploaded.</div>";

    const uploadButton = document.getElementById("upload_cover_button"); //disable buttons
    uploadButton.childNodes[0].classList.replace("fa-save", "fa-spinner");
    uploadButton.childNodes[0].classList.replace("fa-fw", "fa-pulse");
    uploadButton.childNodes[1].textContent = "Uploading...";
    uploadButton.setAttribute("disabled", "true");
    const massUploadButton = document.getElementById("mass_upload_cover_button");
    massUploadButton.childNodes[0].classList.replace("fa-save", "fa-spinner");
    massUploadButton.childNodes[0].classList.replace("fa-fw", "fa-pulse");
    massUploadButton.childNodes[1].textContent = "Mass Uploading: " + j + "/" + files.length;
    massUploadButton.setAttribute("disabled", "true");

    $.ajax({
        url: "/ajax/actions.ajax.php?function=manga_cover_upload&id=" + mangaId,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,

        success: function (data) {
            if (!data)
            {
                messageContainer.innerHTML = success_msg;
                i++;
                if(i < files.length) //upload next after 1.0 seconds
                {
                    setTimeout(uploadNext(volumes, files, i), 1000);
                }
                else
                {
                    uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save"); //enable buttons
                    uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                    uploadButton.childNodes[1].textContent = "Save";
                    uploadButton.removeAttribute("disabled");
                    massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save");
                    massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                    massUploadButton.childNodes[1].textContent = "Save";
                    massUploadButton.removeAttribute("disabled");
                    document.getElementById("manga_cover_upload_form").reset(); //self explanatory
                    document.getElementById("manga_mass_cover_upload_form").reset();
                }
            }
            else
            {
                uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save"); //enable buttons
                uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                uploadButton.childNodes[1].textContent = "Save";
                uploadButton.removeAttribute("disabled");
                massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save");
                massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
                massUploadButton.childNodes[1].textContent = "Save";
                massUploadButton.removeAttribute("disabled");
                messageContainer.innerHTML = data;
                messageContainer.childNodes[0].style.pointerEvents = "auto";
                messageContainer.childNodes[0].innerHTML += "<a href='#' class='pull-right fas fa-window-close' data-dismiss='alert'></a>";
                messageContainer.innerHTML += error_msg;
            }
        },

        error: function(err) {
            console.error(err);
            $('#progressbar').parent().hide();
            uploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save"); //enable buttons
            uploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
            uploadButton.childNodes[1].textContent = "Save";
            uploadButton.removeAttribute("disabled");
            massUploadButton.childNodes[0].classList.replace("fa-spinner", "fa-save");
            massUploadButton.childNodes[0].classList.replace("fa-pulse", "fa-fw");
            massUploadButton.childNodes[1].textContent = "Save";
            massUploadButton.removeAttribute("disabled");
            messageContainer.innerHTML = error_msg;
        }
    });
}

createForm();